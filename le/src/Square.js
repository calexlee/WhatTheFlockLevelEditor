import React from "react"
import "./board.css"
import chef from "./media/chef.png"
import stove from "./media/stove.png"
import blank from "./media/blank.jpg"
import wall from "./media/wall.png"
import spawn from "./media/spawn.png"
import nugget from "./media/nugget.png"
import buffalo from "./media/buffalo.png"
import dino from "./media/dino.png"
import lure from "./media/lure.png"
import slow from "./media/slow.png"
import fire from "./media/fire.png"
import shredded from "./media/shredded_chicken.png"
import wall_botline from "./media/wall_bottomline.png"
import wall_brownsingle from "./media/wall_brownsingle.png"
import wall_leftline from "./media/wall_leftline.png"
import wall_rightline from "./media/wall_rightline.png"
import wall_topline from "./media/wall_topline.png"
import wall_yellowbottom from "./media/wall_yellowbottom.png"
import wall_yellowsingle from "./media/wall_yellowsingle.png"

const Square = ({
    itemName,
    itemId,
    callback,
    hide,
    large,
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
        if (i == "chef"){
            return chef
        } else if (i == "stove"){
            return stove
        } else if (i == "spawn"){
            return spawn
        } else if (i == "chicken nugget"){
            return nugget
        }else if (i == "dino nugget"){
            return dino
        }else if (i == "buffalo chicken"){
            return buffalo
        }  else if (i == "shredded chicken") {
            return shredded
        } else if (i == "lure"){
            return lure
        }else if (i == "fire"){
            return fire
        }else if (i == "slow"){
            return slow
        }else if (i == "wall") {
            return wall_brownsingle
        } else if (i == "wall_b") {
            return wall_botline
        } else if (i == "wall_l") {
            return wall_leftline
        } else if (i == "wall_r") {
            return wall_rightline
        } else if (i == "wall_t") {
            return wall_topline
        } else if (i == "ywall") {
            return wall_yellowsingle
        } else if (i == "ywall_b") {
            return wall_yellowbottom
        } else {
            return blank
        }
    }
    return (
        <div
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