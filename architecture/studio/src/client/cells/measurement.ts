import type { Scene } from "../../scene/contracts.js";
/** Measures the fonts used by the renderer before sending geometry to the worker. */
export class CellMeasurement {
  private context = document.createElement("canvas").getContext("2d");
  measure(scene: Scene): void {
    if (!this.context) return;
    for (const cell of scene.cells) {
      this.context.font = "600 18px system-ui";
      const title = this.context.measureText(cell.name).width + 56;
      let ports = 0;
      this.context.font = "10px system-ui";
      for (const port of scene.ports)
        if (port.cell === cell.id)
          ports = Math.max(
            ports,
            this.context.measureText(port.label).width + 40,
          );
      cell.width = Math.ceil(
        Math.min(680, Math.max(380, title, ports * 2 + 48)),
      );
    }
  }
}
