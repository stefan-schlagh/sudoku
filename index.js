"use strict";

const area = document.getElementById("area")

const grid = new Array(9)
const gridElements = new Array(9)

let generatedNumbers

// create the grid
function createGrid(){

    for(let row of grid){
        row = new Array(9)
        for(let col of row){
            col = 0
            //area.appendChild(document.createElement("div"))
        }
    }
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
            const colElement = document.createElement("td")
            gridElements[i][j] = colElement
            //colElement.classList.add("grid-item")
            colElement.appendChild(document.createTextNode(""))
            tBody.appendChild(colElement)
        }
    }
    // add event listener for generate
    document.getElementById("generate").addEventListener("click",() => {
        fillGridWithGeneratedNumbers()
    })
}

function fillGridWithGeneratedNumbers(){
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
            if(char == ".")
                char = " "
            gridElement.innerText = char
        }
    }
}

createGrid()
fillGridWithGeneratedNumbers()