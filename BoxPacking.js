class BoxPacking {
    
    /**
     * This class represents the BoxPacking object that tracks the current polygons.
     */
    constructor() {
        this.polygons = [];
        this.selected = [];
        this.rivers = [];
        this.selectedRiver = [];
        this.grid = new Grid(1);
    }

    newRiver() {
        this.rivers.push(new River(this.grid));
        return this.rivers.length-1;
    }

    deleteRiver(idx) {
        if (this.rivers.length > 0) {
            this.rivers.splice(idx, 1);
        }
    }

    /**
     * This function changes the current grid.
     * @param {*} N Number of segments of the new grid.
     */
    changeGrid(N) {
        // Changing the grid
        this.grid = new Grid(N);

        // Adapting current polygons
        for (let i of this.polygons) {
            i.adaptSize(this.grid.getL());
        }

        // Bye rivers
        this.rivers = [];
    }

    /**
     * This function creates a new box.
     * @param {*} cx Center X coordinate.
     * @param {*} cy Center Y coordinate.
     */
    newBox(cx, cy) {
        this.polygons.push(new Box(cx, cy, this.grid.getL()));
    }

    /**
     * This function shows the entire BoxPleating circle packing.
     */
    show() {
        // Paper background
        fill(paperColor);
        rect(0, 0, size, size);

        // Grid
        this.grid.show();

        // Paper border
        strokeWeight(10);
        stroke(0);
        noFill();
        rect(0, 0, size, size);

        // Rivers
        for (let r of this.rivers) {
            r.show();
        }

        // Polygons
        if (this.polygons.length > 0) {
            for (let p of this.polygons) {
                p.show();
            }
        }
    }

    /**
     * This function adds a new polygon to the selected array and highlights it.
     * @param {*} idx Index of the polygon that should be selected.
     */
    select(idx) {
        if (idx != -1) {
            if (this.selected.indexOf(idx) >= 0) {
                // Unselect
                let i = this.selected.indexOf(idx);
                this.polygons[this.selected[i]].setColor(circleColor);
                this.selected.splice(i,1);
            } else {
                this.selected.push(idx);
                this.polygons[idx].setColor(highlightColor);
            }
        }
    }
    selectRiver(idx) {
        if (idx != -1) {
            if (this.selectedRiver.indexOf(idx) >= 0) {
                // Unselect
                let i = this.selectedRiver.indexOf(idx);
                this.rivers[this.selectedRiver[i]].setColor(circleColor);
                this.selectedRiver.splice(i,1);
            } else {
                this.selectedRiver.push(idx);
                this.rivers[idx].setColor(highlightColor);
            }
        }
    }

    /**
     * This function increments the radius of the currently selected polygons.
     * @param {*} increment Delta increment (positive or negative).
     */
    modifySelectedRadius(increment) {
        if (this.selected.length > 0) {
            for (let i = 0; i < this.selected.length; i++) {
                this.polygons[this.selected[i]].editRadius(increment, this.grid.getL());
            }
        }
    }

    /**
     * This function deletes the currently selected polygons.
     */
    deleteSelected() {
        if (this.selected.length > 0) {
            // First: descent sort of the indexes
            this.selected.sort(function(a, b) { return b-a; });
            // Remove them from the array
            for (let i = 0; i < this.selected.length; i++) {
                this.polygons.splice(this.selected[i],1);
            }
            this.selected = [];
        }
    }

    /**
     * This function moves a polygon.
     * @param {*} idx Polygon index.
     * @param {*} newX New X coordinate.
     * @param {*} newY New Y coordinate.
     */
    movePolygon(idx, newX, newY) {
        if (idx != -1) {
            this.polygons[idx].move(newX, newY, this.grid.getL());
        }
    }

    /**
     * This function edits the width of the selected polygon
     * @param {*} idx Selected polygon index
     * @param {*} currentX Current dragged X coordinate
     */
    editWidth(idx, currentX) {
        if (idx != -1) {
            this.polygons[idx].editWidth(currentX, this.grid.getL());
        }
    }

    /**
     * This function edits the height of the selected polygon
     * @param {*} idx Selected polygon index
     * @param {*} currentX Current dragged Y coordinate
     */
    editHeight(idx, currentY) {
        if (idx != -1) {
            this.polygons[idx].editHeight(currentY, this.grid.getL());
        }
    }

    /**
     * This function detects if the position (x,y) falls inside any polygon.
     * @param {*} x Coordinate X
     * @param {*} y Coordinate Y
     * @return Index of the top selected polygon
     */
    detectInside(x, y) {
        let collisionIdx = -1;
        for (let i of this.polygons) {
            if (i.isInside(x, y)) {
                collisionIdx = this.polygons.indexOf(i);
            } 
        }
        return collisionIdx;
    }
    detectInsideRiver(x, y) {
        let collisionIdx = -1;
        for (let i of this.rivers) {
            if (i.isInside(x, y)) {
                collisionIdx = this.rivers.indexOf(i);
            } 
        }
        return collisionIdx;
    }

    /**
     * This function detects if the current coordinate is over any edge.
     * @param {*} x X coordinate
     * @param {*} y Y coordinate
     * @returns [idx, edge] Where idx is the index of the hovered box and edge detects
     * if some edge has been hit: 1 for horizontal edge, 0 for vertical edge and -1 for none
     */
    isOverEdge(x, y) {
        let precision = 5;
        let collisionIdx = -1;
        let edge = -1;
        for (let i of this.polygons) {
            var isEdge = i.isEdge(x, y, precision);
            if (isEdge >= 0) {
                collisionIdx = this.polygons.indexOf(i);
                edge = isEdge;
            } 
        }
        return [collisionIdx, edge];
    }
    
    /**
     * This function highlights a polygon.
     * @param {*} idx Index of the polygon to highlight.
     */
    highlight(idx) {
        if (idx != -1) {
            this.polygons[idx].setColor(highlightColor);
            this.polygons[idx].show();
            this.polygons[idx].setColor(circleColor);
        }
    }
    highlightRiver(idx) {
        if (idx != -1) {
            this.rivers[idx].setColor(highlightColor);
            this.rivers[idx].show();
            this.rivers[idx].setColor(circleColor);
        }
    }

    /**
     * This function detects overlapping between all polygons.
     * @return Boolean that indicates if something overlapped or not.
     */
    detectOverlapping() {
        let overlapped = false;
        endLoop:
        for (let i = 0; i < this.polygons.length; i++) {
            for (let j = 0; j < this.polygons.length; j++) {
                if (this.overlaps(i,j)) {
                    overlapped = true;
                    break endLoop;
                }
            }
        }
        return overlapped;
    }

    /**
     * This function checks if two polygons overlap.
     * @param {*} i Index of the first polygon.
     * @param {*} j Index of the second polygon.
     */
    overlaps(i, j) {
        let overlapped = false;
        if (i != j) {
            // TODO: THIS ONLY WORKS FOR BOXES!!!!!!!!!!!!!!!! --------------------------------------------------------
            // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            let obj1 = this.polygons[i];
            let obj2 = this.polygons[j];
            if ((obj1 instanceof Box) && (obj2 instanceof Box)){
                if (!((obj1.cx - obj1.radius >= obj2.cx + obj2.radius) ||
                    (obj1.cx + obj1.radius <= obj2.cx - obj2.radius) ||
                    (obj1.cy - obj1.radius >= obj2.cy + obj2.radius) ||
                    (obj1.cy + obj1.radius <= obj2.cy - obj1.radius))) {
                    overlapped = true;
                } 
            } else if ((obj1 instanceof River) && (obj2 instanceof River)){
                print("Overlapping RIVER vs RIVER not implemented yet.");
            } else {
                print("Overlapping BOX vs RIVER not implemented yet.");
            }

            let d = dist(this.polygons[i].cx, this.polygons[i].cy, this.polygons[j].cx, this.polygons[j].cy);
            let R = this.polygons[i].radius + this.polygons[j].radius
            if (d < R) {
                overlapped = true;
            }
        }
        return overlapped;
    }

    /**
     * This function tries to grow all the polygons at once.
     * @param {*} step Growing step.
     */
    growPacking(step) {
        step *= size;
        // Initialize the array of polygons that should grow
        let growingPolygonsIdx = [];
        for (let i = 0; i < this.polygons.length; i++) {
            growingPolygonsIdx.push(i);
        }
        // Begin growing until two of them collides
        while (growingPolygonsIdx.length > 0) {
            for (let i = growingPolygonsIdx.length-1; i >= 0; i--) {
                // Sum the radius
                let current = growingPolygonsIdx[i];
                this.polygons[current].editRadius(1, this.grid.getL());
                // Check for any collision
                let overlap = false;
                for (let j = 0; j < this.polygons.length; j++) {
                    overlap = this.overlaps(current, j);
                    if (overlap) { break; }
                }
                if (overlap) {
                    this.polygons[current].editRadius(-1, this.grid.getL());
                    growingPolygonsIdx.splice(i, 1);
                } 
                // Maximum growth
                if (!this.polygons[current].isPossibleToGrowMore()) {
                    growingPolygonsIdx.splice(i, 1);
                }
            }
        }
    }
}

