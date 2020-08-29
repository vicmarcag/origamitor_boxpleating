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

    isFeasible() {
        return true;
    }
}