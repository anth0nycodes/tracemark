import { Canvas, type CanvasOptions, type TOptions } from "fabric";
import { HistoryMixin } from "fabric-history-v6";

export class CanvasWithHistory extends HistoryMixin(Canvas) {
  constructor(
    el?: string | HTMLCanvasElement,
    options: TOptions<CanvasOptions> = {}
  ) {
    super(el, options);
    this._historyInit();
  }

  dispose() {
    this._historyDispose();
    return super.dispose();
  }
}
