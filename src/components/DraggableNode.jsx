import React from 'react';

const DraggableNode = ({ node, onClick }) => {
  return (
    <div
      id={node.id}
      // onClick={onClick}
      style={{
        position: 'absolute',
        top: `${node.top}px`,
        left: `${node.left}px`,
        width: '120px',
        height: '60px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        backgroundColor: '#f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '5px',
        cursor: 'move',
      }}
    >
      <div>{node.text}</div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={onClick}>+</button>
      </div>
    </div>
  );
};

export default DraggableNode;
