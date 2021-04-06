import React from "react"
import "./board.css"


const Square = ({
    itemName,
    itemId,
    callback,
}) => {
    const divStyle = {
        color: "black",
        border: "2px solid black"
    };
    return (
        <div
            className="item"
            style = {divStyle}
            onClick={() => {
                callback(itemId);
            }}
        >
            <p className = "cell"> {itemName} </p>
        </div>
    );
};

export default Square;