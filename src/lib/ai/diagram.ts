/**
 * Pure geometry for node-and-wire schematics (hero graph, pinned console,
 * case diagrams). Nodes are placed on a column/row lattice; wires are
 * orthogonal paths (horizontal inside a row, down-across-down between rows).
 */

export interface DiagramItem {
  id: string;
  label: string;
}

export interface DiagramNode extends DiagramItem {
  index: number;
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
}

export interface DiagramEdge {
  from: string;
  to: string;
  d: string;
}

export interface Diagram {
  width: number;
  height: number;
  nodeW: number;
  nodeH: number;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export interface LayoutOptions {
  /** Column position of each node, row by row, e.g. [[0, 2], [1], [0, 2]]. Fractions allowed. */
  rows: number[][];
  nodeH: number;
  /** Minimum node width; grows to fit the longest label. */
  minNodeW: number;
  gapX: number;
  gapY: number;
  pad: number;
  /** Label font size in viewBox units (mono, about 0.6em per character). */
  fontSize: number;
}

const round = (n: number): number => Math.round(n * 10) / 10;

export function layoutDiagram(items: readonly DiagramItem[], o: LayoutOptions): Diagram {
  const longest = items.reduce((m, it) => Math.max(m, it.label.length), 0);
  const nodeW = Math.max(o.minNodeW, Math.ceil(longest * o.fontSize * 0.62 + 28));
  const nodes: DiagramNode[] = [];
  let i = 0;
  let maxCol = 0;
  o.rows.forEach((cols, r) => {
    for (const col of cols) {
      const item = items[i];
      if (!item) return;
      maxCol = Math.max(maxCol, col);
      const x = o.pad + col * (nodeW + o.gapX);
      const y = o.pad + r * (o.nodeH + o.gapY);
      nodes.push({ ...item, index: i, x, y, w: nodeW, h: o.nodeH, cx: x + nodeW / 2, cy: y + o.nodeH / 2 });
      i++;
    }
  });

  const edges: DiagramEdge[] = [];
  for (let k = 1; k < nodes.length; k++) {
    const a = nodes[k - 1]!;
    const b = nodes[k]!;
    let d: string;
    if (a.y === b.y) {
      d = b.x > a.x ? `M${a.x + a.w} ${a.cy}H${b.x}` : `M${a.x} ${a.cy}H${b.x + b.w}`;
    } else {
      const mid = round((a.y + a.h + b.y) / 2);
      d =
        a.cx === b.cx
          ? `M${a.cx} ${a.y + a.h}V${b.y}`
          : `M${a.cx} ${a.y + a.h}V${mid}H${b.cx}V${b.y}`;
    }
    edges.push({ from: a.id, to: b.id, d });
  }

  const rowsUsed = o.rows.length;
  return {
    width: round(o.pad * 2 + (maxCol + 1) * nodeW + maxCol * o.gapX),
    height: round(o.pad * 2 + rowsUsed * o.nodeH + (rowsUsed - 1) * o.gapY),
    nodeW,
    nodeH: o.nodeH,
    nodes,
    edges,
  };
}

/** n nodes in one row. */
export const stripRows = (n: number): number[][] => [Array.from({ length: n }, (_, i) => i)];

/** Two rows, left to right; a shorter second row is centred under the first. */
export function snakeRows(n: number): number[][] {
  const first = Math.ceil(n / 2);
  const second = n - first;
  const offset = (first - second) / 2;
  return [
    Array.from({ length: first }, (_, i) => i),
    Array.from({ length: second }, (_, i) => i + offset),
  ].filter((r) => r.length > 0);
}

/** Three-row zigzag for five nodes (hero): 2 / 1 / 2. Falls back to a snake otherwise. */
export function zigzagRows(n: number): number[][] {
  return n === 5 ? [[0, 2], [1], [0, 2]] : snakeRows(n);
}
