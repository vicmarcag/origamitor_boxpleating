class River {
    constructor(grid) {
        this.grid = grid;
        this.myL = grid.getL();
        this.color = circleColor;

        // Initialize the positions in the grid
        this.matrix = [];
        for (let i = 0; i < this.grid.getN(); i++) {
            let row = [];
            for (let j = 0; j < this.grid.getN(); j++) {
                row.push(0);
            }
            this.matrix.push(row);
        }
    }

    isInside(x, y) {
        let isInside = false;
        for (let i = 0; i < this.grid.getN(); i++) { 
            for (let j = 0; j < this.grid.getN(); j++) {
                if (this.matrix[i][j] == 1) {
                    if (x >= this.myL*i && x <= this.myL*(i+1) &&
                        y >= this.myL*j && y <= this.myL*(j+1)) {
                            isInside = true;
                            break;
                    }
                }
            }
        }
        return isInside;
    }

    setColor(color) {
        this.color = color;
    }

    addPoint(x, y, isDragged) {
        if (x >= 0 && x <= size && y >= 0 && y <= size) {
            // Get the coordinate of the clicked cell
            let coords = this.getBaseCoord(x, y);
            let x_ = coords[0];
            let y_ = coords[1];

            // If dragged, just add the point
            if (isDragged) {
                this.matrix[x_][y_] = 1;
            } else {
                // if it's just a click, deselect if required
                if (this.matrix[x_][y_] == 0) {
                    this.matrix[x_][y_] = 1;
                } else {
                    this.matrix[x_][y_] = 0;
                }
            }
        }
    }

    getBaseCoord(x, y) {
        let x_ = Math.floor(x / this.grid.getL());
        let y_ = Math.floor(y / this.grid.getL());
        return [x_, y_];
    }

    show() {
        strokeWeight(2);
        stroke(0);
        fill(this.color);
                
        for (let i = 0; i < this.grid.getN(); i++) {
            for (let j = 0; j < this.grid.getN(); j++) {
                if (this.matrix[i][j] == 1){
                    noStroke();
                    rect(this.myL*i, this.myL*j, this.myL,this.myL);

                    stroke(0);
                    // Left edges
                    if (i > 0) {
                        if (this.matrix[i-1][j] == 0) {
                            line(this.myL*i, this.myL*j, this.myL*i, this.myL*(j+1));
                        }
                    }
                    // Right edges
                    if (i < this.grid.getN()-1) {
                        if (this.matrix[i+1][j] == 0) {
                            line(this.myL*(i+1), this.myL*j, this.myL*(i+1), this.myL*(j+1));
                        }
                    }
                    // Top edges
                    if (j > 0) {
                        if (this.matrix[i][j-1] == 0) {
                            line(this.myL*i, this.myL*j, this.myL*(i+1), this.myL*j);
                        }
                    }
                    // Right edges
                    if (j < this.grid.getN()-1) {
                        if (this.matrix[i][j+1] == 0) {
                            line(this.myL*i, this.myL*(j+1), this.myL*(i+1), this.myL*(j+1));
                        }
                    }
                }
            }
        }
    }

    /**
     * This function returns a boolean that indicates if the current river is feasible or not, which
     * means that it would be disjointed.
     */
    isFeasible() {
        // Create trace matrix
        var trace = [];
        for (let i = 0; i < this.matrix.length; i++) {
            trace[i] = this.matrix[i].slice();
        }

        // Find the initial point
        let initI = -1;
        let initJ = -1;
        end_loop:
        for (let i = 0; i < this.grid.getN(); i++) {
            for (let j = 0; j < this.grid.getN(); j++) { 
                if (this.matrix[i][j] == 1) {
                    initI = i;
                    initJ = j;
                    break end_loop;
                } 
            }
        }

        // Flood fill 
        if (initI != -1 && initJ != -1) {
            this.floodFill(initI, initJ, trace);

            // Check if there are remaining ones
            let feasible = true;
            end_loop:
            for (let i = 0; i < this.grid.getN(); i++) {
                for (let j = 0; j < this.grid.getN(); j++) { 
                    if (trace[i][j] == 1) {
                        feasible = false;
                        break end_loop;
                    } 
                }
            }
            return feasible;
        } else {
            return false;
        }
    }

    /**
     * Recursive "flood fill" algorithm to detect if the river is disjointed.
     * @param {*} i Row of the initial point to check.
     * @param {*} j Column of the initial point to check.
     * @param {*} trace Tracing matrix.
     */
    floodFill(i, j, trace) {
        if (i > 0 && j > 0 && i < this.grid.getN() && j < this.grid.getN()) {
            if (trace[i][j] == 1) {
                trace[i][j] = 2;
                this.floodFill(i-1 , j, trace);
                this.floodFill(i+1 , j, trace);
                this.floodFill(i , j-1, trace);
                this.floodFill(i , j+1, trace);
            }
        }
    }
}