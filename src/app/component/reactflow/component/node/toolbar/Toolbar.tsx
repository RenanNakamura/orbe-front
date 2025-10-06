import React from 'react';
import {NodeToolbar, useReactFlow} from '@xyflow/react';
import {v4 as uuidv4} from 'uuid';
import {MdContentCopy, MdDelete} from 'react-icons/md';

export interface Props {
    id: string;
    show?: boolean;
    hiddenClone?: boolean;
}

function Toolbar(props: Props) {
    const {setNodes, setEdges} = useReactFlow();
    const showClone = props?.hiddenClone || false;

    const onDelete = () => {
        setNodes((nodes) => nodes.filter(node => node.id !== props.id));
        setEdges((edges) => edges.filter((edge) => edge.target !== props.id && edge.source !== props.id));
    };

    const onClone = () => {
        setNodes((nodes) => {
            const nodeToClone = nodes.find((node) => node.id === props.id);

            if (!nodeToClone) {
                return nodes;
            }

            const id = uuidv4();
            const position = {
                x: nodeToClone.position.x + 100,
                y: nodeToClone.position.y + 100,
            };

            const nodeWithNewsIds = deepCloneWithNewIds(nodeToClone);
            const clonedNode = {
                ...nodeWithNewsIds,
                id,
                position,
                data: JSON.parse(JSON.stringify({
                    ...nodeWithNewsIds.data,
                    id,
                    position,
                })),
                selected: true
            };

            return nodes.map(n => ({...n, selected: false})).concat(clonedNode);
        });
    };

    function deepCloneWithNewIds(obj: any): any {
        if (Array.isArray(obj)) {
            return obj.map(item => deepCloneWithNewIds(item));
        }

        if (obj !== null && typeof obj === 'object') {
            const newObj: any = {};
            for (const key in obj) {
                if (key === 'id' && typeof obj[key] === 'string') {
                    newObj[key] = uuidv4(); // Novo ID
                } else {
                    newObj[key] = deepCloneWithNewIds(obj[key]);
                }
            }
            return newObj;
        }

        return obj;
    }

    return (
        <NodeToolbar nodeId={props.id} isVisible={props?.show}>
            {
                <>
                    <button onClick={onDelete}>
                        <MdDelete className={'cursor-pointer text-white'} size={20}/>
                    </button>
                    <button onClick={onClone} hidden={showClone}>
                        <MdContentCopy className={'cursor-pointer text-white'} size={18}/>
                    </button>
                </>
            }
        </NodeToolbar>
    );
}

export default Toolbar;
