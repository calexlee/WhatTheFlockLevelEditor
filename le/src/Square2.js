import React from "react"
import "./board.css"
import chef from "./media/player.png"
import blank from "./media/blank.jpg"
import wall_brownsingle from "./media/wall.png"
import specter from "./media/specter.png"
import mirror from "./media/mirror.png"


const Square2 = ({
    itemName,
    itemId,
    callback,
    hide,
    large,
    x,
    y,
}) => {
    const divStyle = {
        color: "black",
        border: "1px solid black",
        display: hide ? "none" : "inline-block",
        "background-color": "white",
        margin: 0,
        width: large ? "100px" : "27px",
        height: large ? "100px" : "20px",
        padding: "0px",
    };
    const selectImg = (i) => {
        if (i === "chef"){
            return chef
        } else if (i === "wall"){
            return wall_brownsingle
        } else if (i === "specter"){
          return specter  
        } else if (i === "mirror"){
            return mirror  
        } else {
            return blank
        }
    }
    return (
        <div
            style = {divStyle}
            onDragOver={() => {
                callback(itemId, x, y, itemName);
            }}
            onClick={() => {
                callback(itemId, x, y, itemName);
            }}
        >
            {/* <p className = "square"> {x},{y} </p> */}
            <img src={selectImg(itemName)} alt = "" className = "square"/> 
        </div>
    );
};

export default Square2;