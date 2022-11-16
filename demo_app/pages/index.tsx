import ReactFlow, { Background } from "reactflow";
import useReactFlowAdapter from "../lib/workflow/hooks/useReactFlowAdapter";
import { demoNodes } from "../lib/workflow";

export default function Home() {
  const reactFlowGraph = useReactFlowAdapter({ wfNodes: demoNodes });

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <ReactFlow {...reactFlowGraph}>
        <Background />
      </ReactFlow>
    </div>
  );
}
