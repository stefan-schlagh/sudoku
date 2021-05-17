"use strict";

// globals
const area = document.getElementById("area")
// grid (numbers)
const grid = new Array(9)
// grid (elements)
const gridElements = new Array(9)
// generated numbers are stored here
let generatedNumbers
// currentSelected
const currentSelected = {
    x: null,
    y: null
}

// create the grid
function createGrid(){
    // init grid as empty array
    for(let i=0;i<9;i++){
        grid[i] = new Array(9)
    }
    // init gridElements
    let tBody;
    for(let i=0;i<9;i++){
        if(i%3 == 0){
            tBody = document.createElement("tbody")
            area.appendChild(tBody)
        }
        gridElements[i] = new Array(9)

        const row = document.createElement("tr")
        tBody.appendChild(row)

        for(let j=0;j<9;j++){
            const colElement = new GridElement(i,j)
            tBody.appendChild(colElement.domElement)
        }
    }
    // add event listener for generate
    document.getElementById("generate").addEventListener("click",() => {
        fillGridWithGeneratedNumbers()
    })
    // add keylistener for arrows
    document.getElementsByTagName("table")[0].addEventListener("keyup",event => {
        let selected
        if(event.code == "ArrowUp"){
            selected = {
                x: currentSelected.x,
                // y - 1, but check for boundaries
                y: currentSelected.y > 0 ? currentSelected.y - 1 : 0
            }
        } else if(event.code == "ArrowRight"){
            selected = {
                // x + 1, but check for boundaries
                x: currentSelected.x < 8 ? currentSelected.x + 1 : 8,
                y: currentSelected.y
            }
        } else if(event.code == "ArrowDown"){
            selected = {
                x: currentSelected.x,
                // y + 1, but check for boundaries
                y: currentSelected.y < 8 ? currentSelected.y + 1 : 8
            }
        } else if(event.code == "ArrowLeft"){
            selected = {
                // x - 1, but check for boundaries
                x: currentSelected.x > 0 ? currentSelected.x - 1 : 0,
                y: currentSelected.y
            }
        } else {
            // nothing selected, return
            return
        }
        const element = gridElements[selected.y][selected.x]
        element.select()
    })
}

function deselectCurrent(){
    // is there a currentSelected?
    if(currentSelected.x !== null)
    // deselect currentSelected
    gridElements[currentSelected.y][currentSelected.x].deselect()
}

class GridElement {
    // does the content of the element come from the generated?
    isOriginal = true

    constructor(y,x){
        // x,y
        this.x = x
        this.y = y
        // create domElement
        this.domElement = document.createElement("td")
        gridElements[y][x] = this
        this.domElement.appendChild(document.createTextNode(""))
        // add event
        this.domElement.addEventListener("click",this.select)
    }
    select = () => {
        deselectCurrent()
        // set currentSelected
        currentSelected.x = this.x
        currentSelected.y = this.y
        // add color
        this.domElement.classList.add("gray")
        // add color to row and col
        this.doOnRow(this.y,element => {
            element.domElement.classList.add("lightGray")
        })
        this.doOnCol(this.x,element => {
            element.domElement.classList.add("lightGray")
        })
        // add color to cell
        this.doOnCell(element => {
            element.domElement.classList.add("lightGray")
        })
        // add color to same number
        this.doOnSameNumber(element => {
            element.domElement.classList.add("middleGray")
        })
    }
    deselect = () => {
        // remove color
        this.domElement.classList.remove("gray")
        // remove color from row and col
        this.doOnRow(this.y,element => {
            element.domElement.classList.remove("lightGray")
        })
        this.doOnCol(this.x,element => {
            element.domElement.classList.remove("lightGray")
        })
        // remove color from cell
        this.doOnCell(element => {
            element.domElement.classList.remove("lightGray")
        })
        // remove color from same number
        this.doOnSameNumber(element => {
            element.domElement.classList.remove("middleGray")
        })
    }
    // callback returns for each GridElement in the row
    doOnRow = (y,cb) => {
        const row = gridElements[y]
        for(const element of row){
            cb(element)
        }
    }
    // callback returns for each GridElement in the column
    doOnCol = (x,cb) => {
        for(const row of gridElements){
            cb(row[x])
        }
    }
    getCellOrigin = () => {
        return {
            x: this.x - (this.x % 3),
            y: this.y - (this.y % 3)
        }
    }
    doOnCell = (cb) => {
        const origin = this.getCellOrigin()
        for(let i=0;i<3;i++){
            for(let j=0;j<3;j++){
                // get x and y
                const x = origin.x + i
                const y = origin.y + j
                // if not self
                if(!this.isSelf(x,y))
                    cb(gridElements[y][x])
            }
        }
    }
    doOnSameNumber = (cb) => {
        for(let i=0;i<9;i++){
            for(let j=0;j<9;j++){
                const gridElement = gridElements[i][j]
                if(this.domElement.innerText !== " " 
                    && gridElement.domElement.innerText === this.domElement.innerText){

                        cb(gridElement)
                }
            }
        }
    }
    // is the cell itself on these coordinates?
    isSelf = (x,y) => {
        return this.x == x && this.y == y
    }
    setOriginalChar = char => {
        this.domElement.innerText = char
        this.domElement.classList.add("original")
        this.isOriginal = true
    }
    setChar = char => {
        this.domElement.innerText = char
    }
}

function fillGridWithGeneratedNumbers(){
    // deselect current cell
    deselectCurrent()
    currentSelected.x = null
    currentSelected.y = null
    // get difficulty
    const difficulty = document.getElementById("difficulty").value
    // generate numbers
    generatedNumbers = sudoku.generate(difficulty)
    // fill grid with numbers
    for(let i=0;i<9;i++){
        for(let j=0;j<9;j++){
            const gridElement = gridElements[i][j]
            // get char
            let char = generatedNumbers.charAt(i*9 + j)
            // if char is . , use ␣ 
            if(char == "."){
                char = " "
                gridElement.isOriginal = false
                gridElement.domElement.classList.remove("original")
                gridElement.setChar(char)
            } else
                gridElement.setOriginalChar(char)
            grid[i][j] = char
        }
    }
}

createGrid()
fillGridWithGeneratedNumbers()