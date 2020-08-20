// Hyperparameters
let size = 700;
let MAX_GRID = 64;
let GUI_SPACING = 150;

// Colors
let paperColor = "#fffcf5";
let circleColor = "#bfedbeaa";
let highlightColor = "#fca2a2aa";
let draggedColor = "#9ef0ffaa";
let strokeRiverColor = "#fbb3ff";
let gridColor = "#adadad";
let gridCenterColor = "#636363";

// Coding parameters
let lockedIdx = -1;
let lockedHeight = -1;
let lockedWidth = -1;
let isDragged = false;
let isCreatingRiver = false;
let cp;
let sliderPrevValue = -1;
let canvas, canvasId;
let currentRiverIdx = null;
let lockedRiverIdx = -1;
function setup() {
    cnv = createCanvas(size, size);
    canvasId = cnv.id();
    canvas = document.getElementById(canvasId);

    cp = new BoxPacking();

    paperColor = componentToHex(paperColor);
    circleColor = componentToHex(circleColor);
    highlightColor = componentToHex(highlightColor);
    draggedColor = componentToHex(draggedColor);
    strokeRiverColor = componentToHex(strokeRiverColor);
    gridColor = componentToHex(gridColor);
    gridCenterColor = componentToHex(gridCenterColor);

    // GUI
    let _x = 10;
    buttonCreate = createButton("New Box");
    buttonCreate.mousePressed(createBox);
    buttonCreate.position(_x, size+50);
    buttonCreate.size(GUI_SPACING*0.8)
    _x += GUI_SPACING;
    buttonDelete = createButton("Delete Selected");
    buttonDelete.mousePressed(deleteSelected);
    buttonDelete.position(_x, size+50);
    buttonDelete.size(GUI_SPACING*0.8)
    _x += GUI_SPACING;
    buttonGrow = createButton("Grow polygons");
    buttonGrow.mousePressed(growPolygons);
    buttonGrow.position(_x, size+50);
    buttonGrow.size(GUI_SPACING*0.8)
    _x += GUI_SPACING;
    buttonRiver = createCheckbox("Creating river");
    buttonRiver.changed(createRiver);
    buttonRiver.position(_x, size+50);
    buttonRiver.size(GUI_SPACING*0.8)
    _x += GUI_SPACING;

    _x = 10;
    sliderGrid = createSlider(1, MAX_GRID, 12, 1);
    sliderGrid.position(_x, size+100);
    sliderGrid.size(GUI_SPACING*1.8);
    gridDisplay = createInput('1');
    _x += GUI_SPACING*2;
    gridDisplay.position(_x, size+100);
    gridDisplay.size(GUI_SPACING*0.8)
    gridDisplay.input(gridDisplayInputChanged)
}

function draw() {
    cp.show();
    if (lockedIdx == -1) {
        checkMouseHover();
    }

    // Update the grid display
    if (sliderPrevValue != sliderGrid.value()) {
        gridDisplay.value(sliderGrid.value())
        cp.changeGrid(sliderGrid.value());
        sliderPrevValue = sliderGrid.value();
    }
}

function createBox() {
    if (!isCreatingRiver){
        cp.newBox(size/2, size/2);
        cp.selected = [];
        cp.selectRiver = [];
    } else {
        alert('Please, stop creating river before trying to do anything else.');
    }
}

function deleteSelected() {
    if (!isCreatingRiver) {
        cp.deleteSelected();
    } else {
        alert('Please, stop creating river before trying to do anything else.');
    }
}

function growPolygons() {
    if (!isCreatingRiver){
        if (!cp.detectOverlapping()) {
            cp.growPacking(0.005);
        } else {
            print('overlapped')
            alert('There are overlapping polygons! Separate them and try again.');
        }
    } else {
        alert('Please, stop creating river before trying to do anything else.');
    }
}

function createRiver() {
    if (this.checked()) {
        isCreatingRiver = true;
        currentRiverIdx = cp.newRiver();
        print(currentRiverIdx)
    } else {
        canvas.style.cursor = "default";
        isCreatingRiver = false;
        if (!cp.rivers[currentRiverIdx].isFeasible()) {
            alert('Created river is disjointed! Aborting...');
            cp.rivers.deleteRiver(currentRiverIdx);
            currentRiverIdx = -1;
        }
    }
}

function mousePressed() {
    if (isCreatingRiver) {
        cp.rivers[currentRiverIdx].addPoint(mouseX, mouseY, false);
    } else {
        let edges = cp.isOverEdge(mouseX, mouseY);
        if (edges[0] != -1) {
            if (edges[1] == 1) {
                // Width
                lockedWidth = edges[0];
            } else if (edges[1] == 0) {
                // Height
                lockedHeight = edges[0];
            }
        }

        // Select polygon
        let clickedIdx = cp.detectInside(mouseX, mouseY);
        if (clickedIdx != -1) {
            cp.highlight(clickedIdx);
            lockedIdx = clickedIdx;
            cp.polygons[lockedIdx].isBeingDragged = true;
        }

        // Select river
        let clickedRiverIdx = cp.detectInsideRiver(mouseX, mouseY);
        if (clickedRiverIdx != -1) {
            cp.highlightRiver(clickedIdx);
            lockedRiverIdx = clickedRiverIdx;
            //cp.rivers[lockedRiverIdx].isBeingDragged = true;
        }
    }
}

function mouseDragged() {
    isDragged = true;
    if (isCreatingRiver) {
        cp.rivers[currentRiverIdx].addPoint(mouseX, mouseY, true);
    } else {
        // Changing width or height
        if (lockedWidth != -1) {
            cp.editWidth(lockedWidth, mouseX);
        } else if (lockedHeight != -1) {
            cp.editHeight(lockedHeight, mouseY);
        } else {
            // Moving
            if (lockedIdx != -1) {
                cp.movePolygon(lockedIdx, mouseX, mouseY);
                canvas.style.cursor = "grabbing";
            }
        }  
    }
}

function mouseReleased() {
    // Polygons
    if (lockedIdx != -1) {
        if (!isDragged) {
            // Just a single click: selected
            cp.select(lockedIdx);
            print('selected')
        }
        isDragged = false;
        cp.polygons[lockedIdx].isBeingDragged = false;
        lockedIdx = -1;   
    }

    // Rivers
    if (lockedRiverIdx != -1) {
        // Just a single click: selected
        cp.selectRiver(lockedIdx);
        lockedRiverIdx = -1;   
    }

    // Restore locked widths and heights
    lockedWidth = -1;
    lockedHeight = -1;
}

function checkMouseHover() {
    if (isCreatingRiver) {
        canvas.style.cursor = "cell";
        cp.grid.displayCellOver(mouseX, mouseY);
    } else {
        if (cp.selected.length == 0) {
            // Edge?
            var edges = cp.isOverEdge(mouseX, mouseY);
            if (edges[1] != -1) {
                if (edges[1] == 1) {
                    // Edge hover
                    canvas.style.cursor = "ew-resize";
                } else if (edges[1] == 0) {
                    canvas.style.cursor = "ns-resize";
                }
            } else {
                // Polygon?
                var hovered = cp.detectInside(mouseX, mouseY);
                if (hovered != -1 && cp.selected.length == 0) {
                    // Just hover
                    cp.highlight(hovered);
                    canvas.style.cursor = "pointer";
                }
                // River?
                var hovered = cp.detectInsideRiver(mouseX, mouseY);
                if (hovered != -1 && cp.selectedRiver.length == 0) {
                    // Just hover
                    cp.highlightRiver(hovered);
                    canvas.style.cursor = "pointer";
                }
            }
        }
        if (hovered == -1 && edges[0] == -1) {
            // none
            canvas.style.cursor = "default";
        }
    }
}

function mouseWheel(event) {
    cp.modifySelectedRadius(event.delta);
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function gridDisplayInputChanged() {
    let typedValue = parseInt(this.value());
    if (typedValue > 0 && typedValue <= MAX_GRID) {
        sliderGrid.value(typedValue);
        cp.changeGrid(typedValue);
    }
}