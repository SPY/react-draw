interface Point { x: number; y: number; }

declare namespace JSX {
    interface IntrinsicElements {
         "draw-line": { from: Point, to: Point };
         "draw-group": {};
         "draw-root": { width: number; height: number; context: CanvasRenderingContext2D };
    }
}