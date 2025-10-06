import React from 'react';
import {BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath, useReactFlow} from '@xyflow/react';
import {MdClose} from 'react-icons/md';

export default function CustomEdge({
                                     id,
                                     sourceX,
                                     sourceY,
                                     targetX,
                                     targetY,
                                     sourcePosition,
                                     targetPosition,
                                     style = {},
                                     markerEnd,
                                   }: EdgeProps) {
  const {setEdges} = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style}/>
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: 'all',
          }}
          className='nodrag nopan'
        >
          <button
            className='edge-button w-6 h-6 bg-gray-200 border-primary-500 cursor-pointer rounded-full text-xs leading-none justify-items-center'
            onClick={onEdgeClick}>
            <MdClose className={'text-black'} size={12}/>
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
