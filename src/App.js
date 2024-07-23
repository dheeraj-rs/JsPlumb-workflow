import 'jsplumb/css/jsplumbtoolkit-defaults.css';
import DraggableWorkflow from './components/DraggableWorkflow';

function App() {
  return (
    <div style={{ height: '100%', overflowY: 'scroll', padding: '5px' }}>
      <h1>jsPlumb Example</h1>
      <DraggableWorkflow />
    </div>
  );
}

export default App;
