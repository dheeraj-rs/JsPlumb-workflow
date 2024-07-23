import React from 'react';

const Node = ({ node, toggleModal }) => {
  return (
    <div
      key={node.id}
      id={node.id}
      onClick={(e) => {
        e.stopPropagation();
        const rect = e.target.getBoundingClientRect();
        toggleModal(node.id, {
          top: rect.top + window.scrollY,
          left: rect.right + window.scrollX,
        });
      }}
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
        <button
          onClick={(e) => {
            e.stopPropagation();
            const rect = e.target.getBoundingClientRect();
            toggleModal(node.id, {
              top: rect.top + window.scrollY,
              left: rect.right + window.scrollX,
            });
          }}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Node;
