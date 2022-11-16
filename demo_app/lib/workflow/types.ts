export type Operation = "open" | "close";

export type Methods = {
  do: () => void;
  undo: () => void;
  flow: (op: Operation, emiterId: number) => void | undefined;
  emit: (op: Operation) => void;
};

export type TNode = {
  id: number;
  gate: "AND" | "OR" | "XOR";
  status: "done" | "undone" | "initiated";
  flows: Array<number>;
  pres: Array<number> | null;
  pros: Array<number> | null;
} & Methods;
