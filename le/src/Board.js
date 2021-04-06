import React, {useState} from "react"
import Square from "./Square.js"
import "./board.css"

const Board = ({callback}) => {

    const [selected, setSelected] = useState("chef")
    const [items, setItems] = useState(Array(576).fill(""))
    const [name, setName] = useState("level")

    const pieces = ["chef", "wall", "stv", "fr", " "]
    const chickens = ["nug", "dino", "buff"]

    const changeHandler = (itemId) => {
        const new_items = items.slice()
        new_items[itemId] = selected
        setItems(new_items)
    }

    const changeSelector = (itemId) => {
        setSelected(pieces[itemId])
    }

    const changeChicken = (itemId) => {
        /*TODO */
    }

    const saveToJson = () => {
        const json = JSON.stringify({name: name, items: items, spawns: []});
        return json
    }

    const handleName = (event) => {
        setName(event.target.value)
    }

    const downloadTxtFile = () => {
        const element = document.createElement("a");
        const json = saveToJson()
        const file = new Blob([json], {type:'text/plain;charset=utf-8'});
        element.href = URL.createObjectURL(file);
        element.download = name + ".json";
        document.body.appendChild(element);
        element.click();
    }

    return (
        <div>
            <h1 className = "title"> WHAT THE FLOCK! Level Editor</h1>


            <div className = "grid">
                {items.map((itemName, i) =>
                <Square
                 itemName = {itemName}
                 itemId = {i}
                 hide = {false}
                 callback = {changeHandler}
                />)
                }

            </div>

            <div className = "selector">
                <p className = "selected">Currently Selected: {selected}</p>
                {pieces.map((itemName, i) =>
                <Square
                    itemName = {itemName}
                    itemId = {i}
                    hide = {false}
                    callback = {changeSelector}
                />)}
                <br/>
                {chickens.map((itemName, i) =>
                <Square 
                    itemName = {itemName}
                    itemId = {i}
                    hide = {selected == "fr" ? false: true}
                    callback = {changeChicken}
               /> )}
                <form>
                    <label>
                        Level Name:
                        <textarea value = {name} onChange={handleName} />
                    </label>
                </form>
                <button className = "download" onClick = {downloadTxtFile}>Save JSON</button>
            </div>


        </div>
    )

}

export default Board;