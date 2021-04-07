import React from "react"
import "./board.css"
import chef from "./media/chef.png"
import stove from "./media/stove.png"
import blank from "./media/blank.jpg"
import wall from "./media/wall.png"
import spawn from "./media/spawn.png"

const Square = ({
    itemName,
    itemId,
    callback,
    hide,
}) => {
    const divStyle = {
        color: "black",
        border: "1px solid black",
        display: hide ? "none" : "inline-block",
        "background-color": itemName == "wall" ? "black" : "white",
    };
    const selectImg = (i) => {
        if (i == "chef"){
            return chef
        } else if (i == "stove"){
            return stove
        } else if (i == "wall"){
            return wall
        } else if (i == "spawn"){
            return spawn
        }else{
            return blank
        }
    }
    return (
        <div
            className="item"
            style = {divStyle}
            onClick={() => {
                callback(itemId);
            }}
        >
            {/* <p className = "square"> {itemId}</p> */}
            <img src={selectImg(itemName)} alt = "" className = "square"/> 
        </div>
    );
};

export default Square;