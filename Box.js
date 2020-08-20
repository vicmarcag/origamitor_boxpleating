class Box {
    /**
     * This class represents a single box.
     * @param {*} cx X coordinate of the center.
     * @param {*} cy Y coordinate of the center
     * @param {*} rw Half-width of the box 
     * @param {*} rh Half-height of the box 
     */
    constructor(cx, cy, radius) {
        this.cx = cx;
        this.cy = cy;
        this.rw = radius; 
        this.rh = radius; 

        this.relativeRadius = 1; 
        this.color = circleColor;

        // State
        this.isBeingDragged = false;
    }

    /**
     * Color setter
     * @param {*} color Color in hexadecimal format.
     */
    setColor(color) {
        this.color = color;
    }

    /**
     * This function checks if the point (x,y) falls inside the box
     * @param {*} x X coordinate.
     * @param {*} y Y coordinate.
     */
    isInside(x, y) {
        return x <= this.cx + this.rw && x >= this.cx - this.rw && 
        y <= this.cy + this.rh && y >= this.cy - this.rh;
    }

    /**
     * This function detects if the current coordinate is over an edge.
     * @param {*} x X coordinate
     * @param {*} y Y coordinate
     * @param {*} precision Edge width.
     * @return 1 if over horizontal edge, 0 for vertical edge and -1 for none
     */
    isEdge(x, y, precision) {
        let overHitBox = (x >= this.cx - this.rw - precision) &&
                         (x <= this.cx + this.rw + precision) &&
                         (y >= this.cy - this.rh - precision) &&
                         (y <= this.cy + this.rh + precision);
        if (overHitBox) {
            let overRX = (x > this.cx + this.rw - precision) && (x < this.cx + this.rw + precision)
            let overLX = (x > this.cx - this.rw - precision) && (x < this.cx - this.rw + precision)
            let overTY = (y > this.cy - this.rh - precision) && (y < this.cy - this.rh + precision)
            let overBY = (y > this.cy + this.rh - precision) && (y < this.cy + this.rh + precision)
            if (overRX || overLX) {
                return 1;
            } else if (overTY || overBY) {
                return 0;
            } else {
                return -1;
            }
        } else {
            return -1;
        }
        
    }

    /**
     * This function shows the box, including extra information if desired.
     */
    show() {
        // Dragged color
        fill(this.color);
        if (this.isBeingDragged) {
            fill(draggedColor);
        }
        strokeWeight(2);
        stroke(0);

        // Box        
        rect(this.cx-this.rw, this.cy-this.rh, this.rw*2, this.rh*2);

        // Center
        strokeWeight(5);
        point(this.cx, this.cy);

        // Display the current size
        textSize(14);
        fill(0);
        noStroke();
        let yOffset = this.cy > size/2 ? -20 : 20;
        text(this.relativeRadius.toFixed(0), this.cx, this.cy+yOffset);
    }

    /**
     * This function moves the box to a new position.
     * @param {*} newX New X coordinate.
     * @param {*} newY New Y coordinate.
     */
    move(newX, newY, L) {
        newX = newX > size ? size : newX; 
        newX = newX < 0 ? 0 : newX; 
        newY = newY > size ? size : newY; 
        newY = newY < 0 ? 0 : newY; 
        this.cx = newX;
        this.cy = newY;

        this.correctPositionUnderGrid(L);
    }

    /**
     * This function changes the radius either by increasing it or by decreasing it.
     * @param {*} increment Delta increment (positive or negative).
     * @param {*} L Segment minimum increase.
     */
    editRadius(increment, L) {
        if (increment > 0) {
            // Increase
            this.rw = this.rw + L > size ? size : this.rw + L;
            this.rh = this.rh + L > size ? size : this.rh + L;
        } else {
            // Decrease
            this.rw = this.rw - L <= 0 ? this.rw : this.rw - L;
            this.rh = this.rh - L <= 0 ? this.rh : this.rh - L;
        }
        this.relativeRadius = Math.min(this.rw, this.rh) / L;
    }

    /**
     * This function checks if the polygon reached the maximum size (the entire paper)
     * @returns true if the box can grow more, otherwise it returns false
     */
    isPossibleToGrowMore() {
        if (this.rw == size || this.rh == size) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * This function edits the current width of the box.
     * @param {*} newX Dragged X coordinate
     * @param {*} L Segment length
     */
    editWidth(newX, L) {
        let wd = Math.floor(dist(this.cx, 0, newX, 0) / L);
        if (wd >= 1) {
            this.rw = wd * L > size ? size : wd * L;
        }
    }

    /**
     * This function edits the current height of the box.
     * @param {*} newY Dragged Y coordinate
     * @param {*} L Segment length
     */
    editHeight(newY, L) {
        let hd = Math.floor(dist(0, this.cy, 0, newY) / L);
        if (hd >= 1) {
            this.rh = hd * L > size ? size : hd * L;
        }
    }

    /**
     * This function adapts the current box to a multiple of L and moves it to the nearest grid point.
     * @param {*} L  Segment size.
     */
    adaptSize(L) {
        // Radius adaptation
        this.rw -= (this.rw % L);
        this.rh -= (this.rh % L);
        if (this.rw < L) {
            this.rw = L;
        }
        if (this.rh < L) {
            this.rh = L;
        }

        // Nearest grid point
        this.correctPositionUnderGrid(L);
    }

    /**
     * This function corrects the current position and changes it to the nearest grid point.
     * @param {*} L Segment size 
     */
    correctPositionUnderGrid(L) {
        if (this.cx % L != 0) {
            let d = Math.floor(this.cx / L);
            this.cx = this.cx / L - d < 0.5 ? d * L : (d+1) * L;
        }
        if (this.cy % L != 0) {
            let d = Math.floor(this.cy / L);
            this.cy = this.cy / L - d < 0.5 ? d * L : (d+1) * L;
        }
    }
}