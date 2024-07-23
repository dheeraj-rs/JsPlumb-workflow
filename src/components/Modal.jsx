import React from 'react';

const Modal = ({ show, onClose, onAddNodes, parentId, position }) => {
  if (!show) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        backgroundColor: 'white',
        border: '1px solid #ccc',
        zIndex: 1000,
        padding: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        width: '150px',
      }}
    >
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => onAddNodes(parentId, 1)}>Add 1 Node</button>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => onAddNodes(parentId, 2)}>Add 2 Nodes</button>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => onAddNodes(parentId, 3)}>Add 3 Nodes</button>
      </div>
      <div style={{ textAlign: 'right' }}>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
