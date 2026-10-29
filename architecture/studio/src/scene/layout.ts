import ELK, {
  type ElkNode,
  type ElkPort,
  type ElkExtendedEdge,
} from "elkjs/lib/elk.bundled.js";
import type {
  Cell,
  LayoutResult,
  LayoutService,
  Port,
  Scene,
} from "./contracts.js";

export class ElkLayout implements LayoutService {
  private engine = new ELK();
  async arrange(scene: Scene): Promise<LayoutResult> {
    const result = await this.engine.layout(this.graph(scene));
    const cells = scene.cells.map(this.cellResult.bind(this, result));
    const ports = scene.ports.map(this.portResult.bind(this, result));
    const connectors = scene.connectors.map(this.edgeResult.bind(this, result));
    return {
      cells,
      ports,
      connectors,
      engine: "elkjs/0.12.1:layered/1",
      diagnostics: scene.diagnostics,
    };
  }
  private graph(scene: Scene): ElkNode {
    return {
      id: "scene",
      layoutOptions: {
        "elk.algorithm": "layered",
        "elk.direction": "RIGHT",
        "elk.edgeRouting": "ORTHOGONAL",
        "elk.randomSeed": "42",
        "elk.spacing.nodeNode": "80",
        "elk.spacing.componentComponent": "120",
        "elk.layered.spacing.nodeNodeBetweenLayers": "240",
        "elk.layered.spacing.edgeNodeBetweenLayers": "40",
        "elk.padding": "[top=60,left=60,bottom=60,right=60]",
      },
      children: scene.cells.map(this.node.bind(this, scene)),
      edges: scene.connectors.map(ElkLayout.edge),
    };
  }
  private node(scene: Scene, cell: Cell): ElkNode {
    const ports = scene.ports.filter(ElkLayout.inCell.bind(null, cell.id));
    return {
      id: cell.id,
      width: cell.width,
      height: cell.height,
      layoutOptions: { "elk.portConstraints": "FIXED_POS" },
      ports: ports.map(this.port.bind(this, cell, ports)),
    };
  }
  private port(cell: Cell, ports: Port[], port: Port): ElkPort {
    const side = ports.filter(
      ElkLayout.sameSide.bind(null, port.direction === "out"),
    );
    const index = side.indexOf(port);
    return {
      id: port.id,
      x: port.direction === "out" ? cell.width : 0,
      y: 110 + index * 32,
      width: 0,
      height: 0,
      layoutOptions: {
        "elk.port.side": port.direction === "out" ? "EAST" : "WEST",
      },
    };
  }
  private static sameSide(out: boolean, port: Port): boolean {
    return (port.direction === "out") === out;
  }
  private static inCell(cell: string, port: Port): boolean {
    return port.cell === cell;
  }
  private static edge(edge: Scene["connectors"][number]): ElkExtendedEdge {
    return {
      id: edge.id,
      sources: [edge.sourcePort],
      targets: [edge.targetPort],
    };
  }
  private cellResult(result: ElkNode, cell: Cell) {
    const node = result.children!.find(ElkLayout.id.bind(null, cell.id))!;
    return { ...cell, x: node.x || 0, y: node.y || 0 };
  }
  private portResult(result: ElkNode, port: Port) {
    const node = result.children!.find(ElkLayout.id.bind(null, port.cell))!;
    const located = node.ports!.find(ElkLayout.id.bind(null, port.id))!;
    return { ...port, x: located.x || 0, y: located.y || 0 };
  }
  private edgeResult(result: ElkNode, edge: Scene["connectors"][number]) {
    const located = result.edges!.find(ElkLayout.id.bind(null, edge.id))!;
    return { ...edge, sections: located.sections || [] };
  }
  private static id(id: string, item: { id: string }): boolean {
    return item.id === id;
  }
}
