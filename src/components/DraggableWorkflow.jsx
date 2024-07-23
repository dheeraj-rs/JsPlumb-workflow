/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-loop-func */
import React, { useEffect, useRef, useState } from 'react';
import { jsPlumb } from 'jsplumb';
import Modal from './Modal';
import DraggableNode from './DraggableNode';

const DraggableWorkflow = () => {
  const containerRef = useRef(null);
  const jsPlumbInstanceRef = useRef(null);
  const [nodes, setNodes] = useState([
    { id: 'node1', top: 50, left: 50, text: 'Node 1' },
  ]);
  const [connections, setConnections] = useState([]);
  const [modalInfo, setModalInfo] = useState({
    show: false,
    parentId: null,
    position: { top: 0, left: 0 },
  });

  const initializeJsPlumb = () => {
    jsPlumbInstanceRef.current = jsPlumb.getInstance({
      Connector: ['Flowchart', { cornerRadius: 5, stub: 30 }],
      Anchor: ['Right', 'Left'],
      Endpoint: ['Dot', { radius: 5 }],
      PaintStyle: { stroke: '#456', strokeWidth: 2 },
      EndpointStyle: { fill: '#456' },
      HoverPaintStyle: { stroke: '#dbe300' },
      ConnectionOverlays: [
        ['Arrow', { location: 1, width: 10, length: 10, foldback: 0.7 }],
      ],
    });
    jsPlumbInstanceRef.current.setContainer(containerRef.current);

    nodes.forEach((node) => {
      makeNodeDraggable(node.id);
    });

    jsPlumbInstanceRef.current.bind('beforeDetach', () => false);
  };

  const makeNodeDraggable = (nodeId) => {
    jsPlumbInstanceRef.current.draggable(nodeId, {
      containment: containerRef.current,
      drag: () => {
        jsPlumbInstanceRef.current.repaintEverything();
      },
      stop: (event) => {
        const nodeElement = event.el;
        setNodes((prevNodes) =>
          prevNodes.map((node) =>
            node.id === nodeId
              ? {
                  ...node,
                  top: parseInt(nodeElement.style.top, 10),
                  left: parseInt(nodeElement.style.left, 10),
                }
              : node
          )
        );
      },
    });
  };

  const addNewNodes = (parentId, branchCount) => {
    const parentNode = nodes.find((node) => node.id === parentId);
    const newNodes = [];
    const newConnections = [];
    const nodeSpacing = 150;
    const nodeWidth = 120;
    const nodeHeight = 60;
    let currentLeft = parentNode.left + nodeSpacing;
    let verticalOffset = 0;

    for (let i = 0; i < branchCount; i++) {
      const newNodeId = `node${nodes.length + newNodes.length + 1}`;
      let newTop = parentNode.top + verticalOffset * nodeSpacing;

      // Check for overlap
      let overlap = true;
      while (overlap) {
        overlap = nodes.some(
          (node) =>
            node.left < currentLeft + nodeWidth &&
            node.left + nodeWidth > currentLeft &&
            node.top < newTop + nodeHeight &&
            node.top + nodeHeight > newTop
        );

        if (overlap) {
          verticalOffset++;
          newTop = parentNode.top + verticalOffset * nodeSpacing;
        }
      }

      newNodes.push({
        id: newNodeId,
        top: newTop,
        left: currentLeft,
        text: `Node ${nodes.length + newNodes.length + 1}`,
      });

      newConnections.push({ source: parentId, target: newNodeId });

      // Move to the next horizontal position
      currentLeft += nodeSpacing;

      // If the end of the row is reached, move to the next row
      if ((i + 1) % 3 === 0) {
        currentLeft = parentNode.left + nodeSpacing;
        verticalOffset++;
      }
    }

    // Update state with new nodes and connections
    setNodes((prevNodes) => [...prevNodes, ...newNodes]);
    setConnections((prevConnections) => [
      ...prevConnections,
      ...newConnections,
    ]);

    setModalInfo({
      show: false,
      parentId: null,
      position: { top: 0, left: 0 },
    });
  };

  const createConnections = () => {
    connections.forEach((connection) => {
      jsPlumbInstanceRef.current.connect({
        source: connection.source,
        target: connection.target,
      });
    });
  };

  const toggleModal = (nodeId, position) => {
    setModalInfo((prev) => ({
      show: !prev.show,
      parentId: nodeId,
      position: position,
    }));
  };

  const resetWorkflow = () => {
    jsPlumbInstanceRef.current.reset();
    setNodes([{ id: 'node1', top: 50, left: 50, text: 'Node 1' }]);
    setConnections([]);
  };

  const autoArrange = () => {
    if (nodes.length === 0) return;

    const nodeWidth = 120;
    const nodeHeight = 60;
    const horizontalSpacing = 150;
    const verticalSpacing = 150;

    const newPositions = {};
    let currentX = 0;
    let currentY = 0;
    let maxHeightInRow = 0;

    const sortedNodes = [...nodes].sort(
      (a, b) => a.top - b.top || a.left - b.left
    );

    sortedNodes.forEach((node, index) => {
      newPositions[node.id] = {
        top: currentY,
        left: currentX,
      };

      maxHeightInRow = Math.max(maxHeightInRow, nodeHeight);

      currentX += nodeWidth + horizontalSpacing;

      if ((index + 1) % 3 === 0) {
        currentX = 0;
        currentY += maxHeightInRow + verticalSpacing;
        maxHeightInRow = 0;
      }
    });

    setNodes((prevNodes) =>
      prevNodes.map((node) => ({
        ...node,
        top: newPositions[node.id].top,
        left: newPositions[node.id].left,
      }))
    );

    setTimeout(() => {
      jsPlumbInstanceRef.current.repaintEverything();
    }, 0);
  };

  useEffect(() => {
    initializeJsPlumb();
    return () => {
      if (jsPlumbInstanceRef.current) {
        jsPlumbInstanceRef.current.reset();
      }
    };
  }, []);

  useEffect(() => {
    if (jsPlumbInstanceRef.current) {
      jsPlumbInstanceRef.current.deleteEveryConnection();
      createConnections();
      jsPlumbInstanceRef.current.repaintEverything();
    }
  }, [nodes, connections]);

  return (
    <div style={{ height: '100vh' }}>
      <div style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', gap: '10px', padding: '5px' }}>
          <button onClick={resetWorkflow}>Reset</button>
          <button onClick={autoArrange}>Auto Arrange</button>
        </div>
      </div>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          border: '1px solid #ccc',
          background:
            'linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      >
        {nodes.map((node) => (
          <DraggableNode
            key={node.id}
            node={node}
            onClick={(e) => {
              e.stopPropagation();
              const rect = e.target.getBoundingClientRect();
              toggleModal(node.id, {
                top: rect.top + window.scrollY,
                left: rect.right + window.scrollX,
              });
            }}
          />
        ))}
        <Modal
          show={modalInfo.show}
          onClose={() =>
            setModalInfo({
              show: false,
              parentId: null,
              position: { top: 0, left: 0 },
            })
          }
          onAddNodes={addNewNodes}
          parentId={modalInfo.parentId}
          position={modalInfo.position}
        />
      </div>
    </div>
  );
};

export default DraggableWorkflow;
