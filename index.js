"use strict";

// globals
// sudoku area
const area = document.getElementById("area")
// solved dialog
const solvedDialog = document.getElementById("solved-dialog")
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
        newGame()
    })
    // add event listener for solve
    document.getElementById("solve").addEventListener("click",() => {
        solveSudoku()
    })
    // add keylistener
    document.getElementsByTagName("table")[0].addEventListener("keyup",event => {
        let selected
        // arrows
        if(event.code.includes("Arrow")){
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
        }
        // numbers
        else if(event.code.includes("Digit") || event.code.includes("Numpad") 
        || event.code.includes("space") || event.code.includes("Space")){

            const digit = parseInt(event.code.replace("Digit","").replace("Numpad",""))
            const element = gridElements[currentSelected.y][currentSelected.x]
            // if digit is set Char to NaN
            if(isNaN(digit) || digit === 0){
                deselectCurrent()
                element.setChar(" ")
                element.select()
            // if element is original, do not allow to change
            } else if(!element.isOriginal){
                deselectCurrent()
                element.setChar(digit)
                element.select()
            }
            if(checkGrid())
                sudokuSolved()
        }
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
    // value of the element
    value = NaN

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
        this.check()
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
        if(this.domElement.innerText !== ""){ 
            for(let i=0;i<9;i++){
                for(let j=0;j<9;j++){
                    const gridElement = gridElements[i][j]
                    if(gridElement.domElement.innerText == this.domElement.innerText){
                        cb(gridElement)
                    }
                }
            }
        }
    }
    // is the cell itself on these coordinates?
    isSelf = (x,y) => {
        return this.x == x && this.y == y
    }
    setOriginalChar = char => {
        this.setChar(char)
        this.domElement.classList.add("original")
        this.isOriginal = true
    }
    setChar = char => {
        this.domElement.innerText = char
        this.prevValue = this.value
        this.value = parseInt(char)
    }
    // check if empty
    empty = () => {
        return isNaN(this.value)
    }
    // check if valid
    check = () => {
        // if value 
        let valid = true
        // row
        const row = gridElements[this.y]
        for(let i=0;i<9;i++){
            // if not self
            if(!this.isSelf(i,this.y)){
                // y = y, i = x
                const value = gridElements[this.y][i].value
                if(value == this.value){
                    gridElements[this.y][i].markRed()
                    valid = false
                } else if(value == this.prevValue){
                    gridElements[this.y][i].unMarkRed()
                }
            }
        }
        // col
        for(let i=0;i<9;i++){
            // if not self
            if(!this.isSelf(this.x,i)){
                // x = x, y = i
                const value = gridElements[i][this.x].value
                if(value == this.value){
                    gridElements[i][this.x].markRed()
                    valid = false
                } else if(value == this.prevValue){
                    gridElements[i][this.x].unMarkRed()
                }
            }
        }
        // cell
        const origin = this.getCellOrigin()
        for(let i=0;i<3;i++){
            for(let j=0;j<3;j++){
                // get x and y
                const x = origin.x + i
                const y = origin.y + j
                // if not self
                if(!this.isSelf(x,y)){
                    const value = gridElements[y][x].value
                    if(value == this.value){
                        gridElements[y][x].markRed()
                        valid = false
                    } else if(value == this.prevValue){
                        gridElements[y][x].unMarkRed()
                    }
                }
            }
        }
        if(valid)
            this.unMarkRed()
        else
            this.markRed()
        return valid
    }
    markRed = () => {
        this.domElement.classList.add("red")
    }
    unMarkRed = () => {
        this.domElement.classList.remove("red")
    }
}

function checkGrid(){
    for(let i=0;i<9;i++){
        for(let j=0;j<9;j++){
            const gridElement = gridElements[i][j]
            if(gridElement.empty() || !gridElement.check())
                return false
        }
    }
    return true;
}

function newGame(){
    solvedDialog.classList.add("hide")
    fillGridWithGeneratedNumbers()
    // get stopwatch elements
    const sec = document.querySelector("#stopwatch #sec")
    const min = document.querySelector("#stopwatch #min")
    const h = document.querySelector("#stopwatch #h")
    // reset and start stopwatch
    stopWatch.reset()
    stopWatch.start(sec,min,h)
}

function sudokuSolved(){
    solvedDialog.classList.remove("hide")
    // stop and reset stopWatch
    stopWatch.stop()
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
            gridElement.domElement.classList.remove("red")
        }
    }
}

function solveSudoku(){
    // solve
    const solution = sudoku.solve(generatedNumbers)
    // fill grid with solution
    for(let i=0;i<9;i++){
        for(let j=0;j<9;j++){
            const gridElement = gridElements[i][j]
            // if char is . , use ␣ 
            if(!gridElement.isOriginal)
                gridElement.setChar( solution.charAt(i*9 + j))
        }
    }
    sudokuSolved()
}

createGrid()
newGame()