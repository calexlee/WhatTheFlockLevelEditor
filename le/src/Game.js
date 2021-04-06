import React from "react"
import Board from "./Board.js"
import "./board.css"

const Game = () => {

    const changeHandler = () => {
        /*TODO */
    }

    return (
        <div className="game">
            <div className = "game-board">
                <Board callback = {changeHandler}/>
            </div>
            <div className = "info">
                {/* TODO */}
            </div>
        </div>
    )
}

export default Game;