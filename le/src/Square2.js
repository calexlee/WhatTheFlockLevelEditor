import React from "react"
import "./board.css"
import chef from "./media/player.png"
import blank from "./media/blank.jpg"
import wall_brownsingle from "./media/wall.png"
import specter from "./media/specter.png"
import triangle from "./media/triangle.png"
import square from "./media/square.png"
import circle from "./media/circle.png"
import seeker from "./media/seeker.png"
import glutton from "./media/glutton.png"
import lost from "./media/lost.png"


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
        } else if (i === "square"){
            return square  
        }else if (i === "triangle"){
            return triangle  
        }else if (i === "circle"){
            return circle  
        }else if (i === "seeker"){
            return seeker  
        }else if (i === "glutton"){
            return glutton  
        }else if (i === "lost"){
            return lost  
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