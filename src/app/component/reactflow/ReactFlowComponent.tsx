import * as React from 'react';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {NodeType, WorkflowNode} from '../../model/flow/WorkflowNode';
import {
  addEdge,
  Background,
  Controls,
  Edge,
  MiniMap,
  Node,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow
} from '@xyflow/react';
import StartNode from './node/start/StartNode';
import MessageNode from './node/message/MessageNode';
import CustomEdge from './component/edge/CustomEdge';
import {EdgeType} from '../../model/flow/Flow';
import {v4 as uuidv4} from 'uuid';
import ActionNode from './node/action/ActionNode';
import ButtonNode from './node/button/ButtonNode';
import QuestionNode from './node/question/QuestionNode';
import {useTranslation} from 'react-i18next';
import ListNode from './node/list/ListNode';
import SelectNode from './node/select/SelectNode';
import {Connection} from '@xyflow/system';
import ConditionNode from './node/condition/ConditionNode';
import TimeIntervalNode from './node/time-interval/TimeIntervalNode';

export interface FlowProps {
    nodes: WorkflowNode[];
    edges: Edge[];
    viewport: any;
    lang: string;
    onSubmit?: (flow: { nodes: WorkflowNode[], edges: any[], viewport: any }) => void;
    setSaveCallback?: (cb: () => void) => void;
}

const initialEdgeTypes = {
    CUSTOM: CustomEdge,
};

function ReactFlowComponent(props: FlowProps) {
    const reactFlow = useReactFlow();
    const initialNodeTypes = {
        SELECT: (nodeProps) => <SelectNode {...nodeProps} onSelectNode={replaceNode} />,
        START: StartNode,
        MESSAGE: MessageNode,
        BUTTON: ButtonNode,
        QUESTION: QuestionNode,
        LIST: ListNode,
        ACTION: ActionNode,
        CONDITION: ConditionNode,
        TIME_INTERVAL: TimeIntervalNode,
    };

    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const nodeTypes = useMemo(() => initialNodeTypes, []);
    const edgeTypes = useMemo(() => initialEdgeTypes, []);
    const initialNodes = useMemo(() => toReactFlowNodes(props.nodes), [props.nodes]);
    const initialEdges = useMemo(() => props.edges, [props.edges]);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const { screenToFlowPosition } = useReactFlow();

    const proOptions = useMemo(() => ({ hideAttribution: true }), []);

    const { i18n } = useTranslation();
    const { onSubmit, lang } = props;
    const sourceNodeRef = useRef<string | null>(null);
    const sourceHandleRef = useRef<string | null>(null);

    useEffect(() => {
        i18n.changeLanguage(lang);
    }, [lang]);

    const onInit = (instance) => {
        setReactFlowInstance(instance);
    };

    const onSave = useCallback(async () => {
        const flow = reactFlow.toObject();
        const n = toWorkflowNode(flow.nodes as Node[]);
        const e = flow.edges;

        if (onSubmit) {
            onSubmit({ nodes: n, edges: e, viewport: flow.viewport });
        }
    }, [reactFlow, onSubmit]);

    useEffect(() => {
        if (props.setSaveCallback) {
            props.setSaveCallback(onSave);
        }
    }, [onSave]);

    const onConnectEdge = useCallback(
        (connection) => {
            const edge = { ...connection, type: EdgeType.CUSTOM, id: uuidv4() };
            setEdges((eds) => addEdge(edge, eds));

            sourceNodeRef.current = null;
            sourceHandleRef.current = null;
        },
        [setEdges]
    );

    const onConnectStart = (event: MouseEvent | TouchEvent, params: { nodeId?: string; handleId?: string; handleType?: string }) => {
        if (params?.handleId) {
            sourceNodeRef.current = params.nodeId;
            sourceHandleRef.current = params.handleId;
        }
    };

    const onConnectEnd = (event: MouseEvent | TouchEvent) => {
        if (!sourceNodeRef?.current || !sourceHandleRef?.current) {
            return;
        }

        if (hasSourceEdge(sourceNodeRef.current, sourceHandleRef.current)) {
            return;
        }

        const targetElement = event.target as HTMLElement;
        const isContinue = targetElement && !targetElement.closest('.react-flow__node, .react-flow__edge');

        if (!isContinue) {
            return;
        }

        const id = uuidv4();
        const { clientX, clientY } = 'changedTouches' in event ? event.changedTouches[0] : event;
        const position = screenToFlowPosition({ x: clientX, y: clientY });

        const newNode: Node = {
            id,
            type: 'SELECT',
            position,
            data: { id, type: 'SELECT', position },
        };

        const newEdge: Edge = {
            id: uuidv4(),
            sourceHandle: sourceHandleRef.current,
            source: sourceNodeRef?.current,
            target: id,
            targetHandle: id,
            type: EdgeType.CUSTOM,
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) => eds.concat(newEdge));
    };

    const replaceNode = useCallback((id: string, newType: NodeType) => {
        setNodes((nds) =>
            nds.map(node =>
                node.id === id ? { ...node, type: newType, data: { ...node.data, type: newType } } : node
            )
        );
    }, [setNodes]);

    const isValidConnection = (connection: Connection) => {
        const { source, sourceHandle } = connection;

        if (!source || !sourceHandle) {
            return false;
        }

        return !hasSourceEdge(source, sourceHandle);
    };

    const hasSourceEdge = (source: string, sourceHandle: string) => {
        return edges.some((edge) => edge?.source === source && edge?.sourceHandle === sourceHandle);
    };

    return (
        <ReactFlow
            id={'react-flow-wrapper-content'}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            isValidConnection={isValidConnection}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            proOptions={proOptions}
            defaultViewport={props?.viewport}
            onConnect={onConnectEdge}
            minZoom={0.1}
            onConnectStart={onConnectStart}
            onConnectEnd={onConnectEnd}
            onInit={onInit}>
            <Controls className={'xyflow-controls'} />
            <MiniMap position={'bottom-right'} />
            <Background gap={20} size={1} bgColor={'#f9fafb'} />
        </ReactFlow>
    );
}

function toReactFlowNodes(nodes: WorkflowNode[]): Node[] {
    return nodes.map(node => {
        return {
            id: node.id,
            type: node.type,
            position: node.position,
            data: node as any,
        };
    });
}

function toWorkflowNode(reactFlowNodes: Node[]): WorkflowNode[] {
    return reactFlowNodes.map(node => {
        const data = node.data as any;
        return Object.assign(data, { position: node.position });
    });
}

function ReactFlowProviderComponent(props) {
    return (
        <ReactFlowProvider>
            <ReactFlowComponent {...props} />
        </ReactFlowProvider>
    );
}

export default ReactFlowProviderComponent;
