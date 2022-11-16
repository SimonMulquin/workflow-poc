import { TNode, Methods } from "./types";

//POC
export const demoNodes: Array<TNode & Methods> = [];

const newNode = (def: Partial<TNode> & Pick<TNode, "id" | "pres" | "pros">) => {
  //state
  let node = {
    gate: "AND",
    flows: [],
    status: "initiated",
    ...def,
  } as TNode & Methods;

  //actions
  node.undo = () => console.log("can't undo an undone node");

  node.do = () => {
    node.status = "done";
    console.log(node.id, node.status);
    demoNodes[node.id].undo = () => {
      node.status = "undone";
      demoNodes[node.id].undo = node.undo;
      return node.emit("close");
    };

    return node.emit("open");
  };

  //flow handler
  node.flow = (op, emiterId) => {
    switch (op) {
      case "open":
        if (node.flows?.includes(emiterId)) {
          console.log(node.id, " is up to date");
          return;
        } else if (node.pres?.includes(emiterId)) {
          node.flows = [...node.flows, emiterId];
        } else {
          console.log(emiterId, " is not a predecessor of ", node.id);
        }
        break;

      case "close":
        node.flows = node.flows?.filter(id => id != emiterId);
        console.log(emiterId, " closed flow to ", node.id);
        break;

      default:
        console.log(op, " is not a flow operation");
        return;
    }

    switch (node.gate) {
      case "AND":
        if (node.flows?.length === node.pres?.length) {
          return node.do();
        }
        console.log(node.id, " doesn't match AND condition");
        return demoNodes[node.id].undo();

      case "OR":
        if (node.flows.length >= 1) {
          return node.do();
        }
        console.log(node.id, " doesn't match OR condition");
        return demoNodes[node.id].undo();

      case "XOR":
        if (node.flows.length === 1) {
          return node.do();
        }
        console.log(node.id, " doesn't match XOR condition");
        return demoNodes[node.id].undo();

      default:
        console.log(node.gate, " is not a covered condition");
        return;
    }
  };

  //emiter
  node.emit = op =>
    node.pros
      ? node.pros.forEach(id => demoNodes[id].flow(op, node.id))
      : console.log("END");

  return demoNodes.push(node);
};

//default gate will be AND
newNode({ pres: null, id: 0, pros: [1] });
newNode({ pres: [0], id: 1, pros: [2, 3] });
newNode({ pres: [1], id: 2, pros: [4] });
newNode({ pres: [1], id: 3, pros: [4] });
newNode({ pres: [2, 3], id: 4, pros: [6], gate: "AND" });
newNode({ pres: null, id: 5, pros: [6] });
newNode({ pres: [4, 5], id: 6, pros: [8], gate: "OR" });
newNode({ pres: null, id: 7, pros: [8] });
newNode({ pres: [6, 7], id: 8, pros: null, gate: "XOR" });

console.log("START 0");
demoNodes[0].do();

console.log("START 7");
demoNodes[7].do();

