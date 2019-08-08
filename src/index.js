//POC
const nodes = [];

const newNode = (def) => {
    //state
    let node = {
        gate: "AND",
        flows: [],
        status: "initiated",
        ...def,
    };
    console.log(node.id, node.status);

    //actions
    node.undo = () => console.log("can't undo an undone node");

    node.do = () => {
        const prevState = node;
        node.status = "done";
        console.log(node.id, node.status);
        nodes[node.id].undo = () => {
            node.status = "undone";
            nodes[node.id].undo = node.undo;
            console.log(node.id, node.status);
            return node.emit("close");
        }
        
        return node.emit("open");
    }

    //flow handler
    node.flow = (op, emiterId) => {

        switch(op) {

            case "open":
                if (node.flows.includes(emiterId)) {
                    console.log(node.id, " is up to date")
                    return;
                }
                else if (node.pres.includes(emiterId)) {
                    node.flows = [...node.flows, emiterId];
                }
                else {
                    console.log(emiterId, " is not a predecessor of ", node.id);
                    console.log(node);
                }
                break;

            case "close":
                node.flows = node.flows.filter(id => id != emiterId);
                console.log(emiterId, " closed flow to ", node.id);
                break;

            default:
                console.log(op, " is not a flow operation");
                return;
        }

        switch(node.gate) {

            case "AND":
                if (node.flows.length === node.pres.length) {
                    return node.do();
                }
                console.log(node.id, " doesn't match AND condition")
                return nodes[node.id].undo();

            case "OR":
                if (node.flows.length >= 1) {
                    return node.do();
                }
                console.log(node.id, " doesn't match OR condition")
                return nodes[node.id].undo();

            case "XOR":
                if (node.flows.length === 1) {
                    return node.do();
                }
                console.log(node.id, " doesn't match XOR condition")
                return nodes[node.id].undo();
            
            default:
                console.log(node.gate, " is not a covered condition")
                return;
        }
    }

    //emiter
    node.emit = op => node.pros ? node.pros.forEach(id => nodes[id].flow(op, node.id)) : console.log("END");

    return nodes.push(node)
};

//default gate will be AND
newNode({pres: null, id: 0, pros: [1]}),
newNode({pres: [0], id: 1, pros: [2]}),
newNode({pres: [1], id: 2, pros: [3, 4]}),
newNode({pres: [2], id: 3, pros: [5]}), 
newNode({pres: [2], id: 4, pros: [5]}),
newNode({pres: [3, 4], id: 5, pros: [7], gate: "AND"}),
newNode({pres: null, id: 6, pros: [7]})
newNode({pres: [5, 6], id: 7, pros: [9], gate: "OR"}),
newNode({pres: null, id: 8, pros: [9]}),
newNode({pres: [7, 8], id: 9, pros: null, gate: "XOR"}),

console.log("START 8")
nodes[8].do();
console.log("START 0")
nodes[0].do();
console.log("START 6")
nodes[6].do();
console.log("CLOSE 8")
nodes[8].emit("close");
console.log("CLOSE 5")
nodes[5].emit("close");
console.log("CLOSE 6")
nodes[6].emit("close");
console.log("CLOSE 0")
nodes[0].emit("close");
