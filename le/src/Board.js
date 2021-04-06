import React from "react"
import Square from "./Square.js"
import "./board.css"

const Board = ({callback}) => {

    const items = []

    for (var i = 0; i < 576; i++){
        items.push((0, " "));
    }

    const changeHandler = (itemName) => {
        items[itemName] = (0, "clicked")
    }


    return (
        <div>
            <p> Level Editor</p>

            <div className = "grid">
                {Object.keys(items).map((itemName) =>
                <Square
                 itemName = {itemName}
                 callback = {changeHandler}
                />)
                }

            </div>


        </div>
    )

}

export default Board;