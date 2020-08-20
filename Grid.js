class Grid {
    /**
     * This class represents a grid.
     * @param {*} N Number of segments.
     */
    constructor(N) {
        this.N = N;
        this.L = N > 0 ? size/N : 0;
    }

    /**
     * Getter for the length of the segment
     */
    getL() {
        return this.L;
    }

    /**
     * Getter for the number of segments
     */
    getN() {
        return this.N;
    }

    /**
     * This function shows the grid
     */
    show() {
        if (this.N > 1) {
            // Grid lines
            stroke(gridColor);
            strokeWeight(2);
            for (let i = 1; i < this.N; i++) {
                // Horizontal
                line(0, this.L*i, size, this.L*i);
                // Vertical
                line(this.L*i, 0, this.L*i, size);
            }
        }
        // Center lines
        stroke(gridCenterColor);
        strokeWeight(2);
        drawingContext.setLineDash([5, 15]);
        line(0, size/2, size, size/2);
        line(size/2, 0, size/2, size);
        drawingContext.setLineDash([]);
    }

    displayCellOver(x, y) {
        if (x >= 0 && x <= size && y >= 0 && y <= size) {
            let x_ = Math.floor(x / this.L) * this.L;
            let y_ = Math.floor(y / this.L) * this.L;

            fill(strokeRiverColor);
            stroke(gridColor);
            strokeWeight(2);
            rect(x_, y_, this.L, this.L);
        }
    }
}