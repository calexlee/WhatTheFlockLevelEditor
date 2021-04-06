import React from "react"
import "./board.css"


const Square = ({
    itemName,
    itemId,
    callback,
    hide,
}) => {
    const divStyle = {
        color: "black",
        border: "2px solid black",
        display: hide ? "none" : "inline-block" 
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