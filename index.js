"use strict";

const area = document.getElementById("area")

const grid = new Array(9)
const gridElements = new Array(9)

for(row of grid){
    row = new Array(9)
    for(col of row){
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
    rowElements = gridElements[i]

    const row = document.createElement("tr")
    tBody.appendChild(row)

    for(colElement of rowElements){
        colElement = document.createElement("td")
        //colElement.classList.add("grid-item")
        colElement.appendChild(document.createTextNode(""))
        tBody.appendChild(colElement)
    }
}

console.log(sudoku.generate(60))