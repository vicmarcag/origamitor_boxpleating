class CreasePattern {

    constructor(grid, polygons, rivers) {
        this.N = grid.getN();
        this.L = grid.getL();
        this.feasible = true;

        this.lines = new Lines();
        this.addPolygonLines(polygons);
        this.addRiverLines(rivers);
    }

    isFeasible() {
        return this.feasible;
    }

    addPolygonLines(boxes) {
        for (let p of boxes) {
            // Square
            if (p.rw == p.rh) {
                let tl = this.coordToGridIndex(p.cx - p.rw, p.cy - p.rh);
                let br = this.coordToGridIndex(p.cx + p.rw, p.cy + p.rh);
                this.lines.add(tl, br);
                let tr = this.coordToGridIndex(p.cx + p.rw, p.cy - p.rh);
                let bl = this.coordToGridIndex(p.cx - p.rw, p.cy + p.rh);
                this.lines.add(tr, bl);
            } else {
                // Rectangle
                let a = this.coordToGridIndex(p.cx - p.rw, p.cy - p.rh);
                let b = this.coordToGridIndex(p.cx + p.rw, p.cy - p.rh);
                let c = this.coordToGridIndex(p.cx - p.rw, p.cy + p.rh);
                let d = this.coordToGridIndex(p.cx + p.rw, p.cy + p.rh);
                let m1, m2;
                if (p.rw > p.rh) {
                    // Horizontal
                    m1 = this.coordToGridIndex(p.cx - p.rw + p.rh, p.cy);
                    m2 = this.coordToGridIndex(p.cx + p.rw - p.rh, p.cy);
                    this.lines.add(a, m1);
                    this.lines.add(c, m1);
                    this.lines.add(m2, b);
                    this.lines.add(m2, d);
                    this.lines.add(m1, m2);
                } else {
                    // Vertical
                    m1 = this.coordToGridIndex(p.cx, p.cy - p.rh + p.rw);
                    m2 = this.coordToGridIndex(p.cx, p.cy + p.rh - p.rw);
                    this.lines.add(a, m1);
                    this.lines.add(b, m1);
                    this.lines.add(m2, c);
                    this.lines.add(m2, d);
                }
                this.lines.add(m1, m2);
            }
        }
    }

    addRiverLines(rivers) {
        for (let r of rivers) {
            
        }
    }

    // TODO
    detectCorners(river) {
        let N = river.grid.getN();
        
    }

    coordToGridIndex(x, y) {
        let x_ = Math.round(x / this.L);
        x_ = x_ < 0 ? 0 : x_ > this.L*this.N ? this.L*this.N : x_;
        let y_ = Math.round(y / this.L);
        y_ = y_ < 0 ? 0 : y_ > this.L*this.N ? this.L*this.N : y_;
        return y_ * (this.N + 1) + x_;
    }

    indexToCoord(idx) {
        let y = Math.floor(idx/(this.N+1)) * this.L;
        let x = idx % (this.N+1) * this.L;
        return createVector(x, y);
    }

    show() {
        stroke(155,0,0);
        noFill();
        strokeWeight(2);
        for (let i = 0; i < this.lines.length(); i++) {
            let idxs = this.lines.get(i);
            let pos1 = this.indexToCoord(idxs.x);
            let pos2 = this.indexToCoord(idxs.y);
            line(pos1.x, pos1.y, pos2.x, pos2.y);
        }
    }
}

class Lines {
    constructor() {
        this.basicLinesX1 = [];
        this.basicLinesX2 = [];
    }

    add(i1, i2) {
        this.basicLinesX1.push(i1);
        this.basicLinesX2.push(i2);
    }

    get(index) {
        return createVector(this.basicLinesX1[index], this.basicLinesX2[index]);
    }

    length() {
        return this.basicLinesX1.length;
    }
}