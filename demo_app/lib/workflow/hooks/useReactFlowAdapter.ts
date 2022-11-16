import { TNode } from "../types";
import { Edge, Node as RFNode } from "reactflow";

type ReactFlowGraph = { nodes: Array<RFNode>; edges: Array<Edge> };

const workflowToReactFlow = (
  source: Array<TNode> = [],
  res: ReactFlowGraph = { nodes: [], edges: [] }
): ReactFlowGraph => {
  if (source.length === 0) return res;
  const [wfNode, ...rest] = source;

  const rfNode: RFNode = {
    id: `${wfNode.id}`,
    data: wfNode,
    position: { x: res.nodes.length * 180, y: 100 },
  };

  const edges: Array<Edge> = wfNode.pros
    ? wfNode.pros.map(proNodeId => ({
        id: `${wfNode.id}->${proNodeId}`,
        source: `${wfNode.id}`,
        target: `${proNodeId}`,
        type: "smoothstep",
      }))
    : [];

  return workflowToReactFlow(rest, {
    nodes: [...res.nodes, rfNode],
    edges: [...res.edges, ...edges],
  });
};

const useReactFlowAdapter = ({
  wfNodes,
}: {
  wfNodes: Array<TNode>;
}): ReactFlowGraph => {
  const edge = { id: "e1-2", source: "1", target: "2" };

  return workflowToReactFlow(wfNodes);
};

export default useReactFlowAdapter;
