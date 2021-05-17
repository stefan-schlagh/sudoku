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
}

class GridElement {

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
    select = event => {
        // is there a currentSelected?
        if(currentSelected.x !== null)
            // deselect currentSelected
            gridElements[currentSelected.y][currentSelected.x].deselect()
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
    }
    deselect = event => {
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
    // is the cell itself on these coordinates?
    isSelf(x,y){
        return this.x == x && this.y == y
    }
}

function fillGridWithGeneratedNumbers(){
    // get difficulty
    const difficulty = document.getElementById("difficulty").value
    // generate numbers
    generatedNumbers = sudoku.generate(difficulty)
    // fill grid with numbers
    for(let i=0;i<9;i++){
        for(let j=0;j<9;j++){
            const gridElement = gridElements[i][j].domElement
            // get char
            let char = generatedNumbers.charAt(i*9 + j)
            // if char is . , use ␣ 
            if(char == ".")
                char = " "
            grid[i][j] = char
            gridElement.innerText = char
        }
    }
}

createGrid()
fillGridWithGeneratedNumbers()