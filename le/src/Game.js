import React from "react"
import Board from "./Board.js"
import Board2 from "./Board2.js"
import "./board.css"

const Game = () => {

    const changeHandler = () => {
        /*TODO */
    }

    return (
        <div className="game">
            <div className = "game-board">
                <Board2 callback = {changeHandler}/>
            </div>
            <div className = "info">
                {/* TODO */}
            </div>
        </div>
    )
}

export default Game;