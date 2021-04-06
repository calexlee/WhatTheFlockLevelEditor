import React from "react"
import "./board.css"


const Square = ({
    itemName,
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
                callback(itemName);
            }}
        >
            <p className = "cell"> {itemName} </p>
        </div>
    );
};

export default Square;