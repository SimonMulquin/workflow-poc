//POC
const nodes = [];

const newNode = (pres, id, pros) => {
    //state
    let node = {pres, flows: [], id, pros, status: "initiated"};
    console.log(node.id, node.status);

    //actions
    node.do = () => {
        const prevState = node;
        node.status = "done";
        console.log(node.id, node.status);
        node.undo = () => {
            node.status = "undone";
            console.log(node.id, node.status);
            return node.emit("close");
        }
        
        return node.emit("open");
    }

    //flow handler (AND)
    node.flow = (op, emiterId) => {
        //open
        if (op === "open") {
            if (node.flows.includes(emiterId)) {
                console.log(node.id, " is up to date")
                return;
            }
            if (node.pres.includes(emiterId)) {
                node.flows = [...node.flows, emiterId];
                //AND
                if (node.flows.length === node.pres.length) {
                    return node.do();
                }
                console.log(node.id, " doesn't match its condition yet")
                return;
            }
            console.log(emiterId, " is not a predecessor of ", node.id);
            console.log(node);
            return;
        }

        //close
        if (op === "close") {
            node.flows = node.flows.filter(id => id != emiterId);
            console.log(emiterId, " closed flow to ", node.id);
            return;
        }

        //default
        console.log(op, " is not a flow operation");
        return;
    }

    //emiter
    node.emit = op => node.pros ? node.pros.forEach(id => nodes[id].flow(op, node.id)) : console.log("END");

    return nodes.push(node)
};

newNode(null, 0, [1]),
newNode([0], 1, [2]),
newNode([1], 2, [3]),
newNode([2], 3, [4]),
newNode([3], 4, null)

console.log("START")
nodes[0].do();