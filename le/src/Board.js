import React, {useState} from "react"
import Square from "./Square.js"
import "./board.css"

const Board = ({callback}) => {

    const [selected, setSelected] = useState("chef")
    const [height, setHeight] = useState(27)
    const [width, setWidth] = useState(48)
    const [items, setItems] = useState(Array(width*height).fill(""))
    const [name, setName] = useState("level")

    const pieces = ["chef", "wall", "stove", "spawn", "lure", "fire", "slow", " "]
    const chickens = ["chicken nugget", "dino nugget", "buffalo chicken"]

    const [spawnProbs, setSpawnProbs] = useState(Array(chickens.length).fill(0))
    const [chicken, setChicken] = useState(0)

    const changeHandler = (itemId) => {
        const new_items = items.slice()
        new_items[itemId] = selected
        setItems(new_items)
    }

    const changeSelector = (itemId) => {
        setSelected(pieces[itemId])
    }

    const changeChicken = (event) => {
        const new_probs = spawnProbs.slice()
        new_probs[chicken] = event.target.value
        setSpawnProbs(new_probs)
    }

    const chickenSelected = (itemId) => {
        setChicken(itemId)
    }

    const saveToJson = () => {
        const json = JSON.stringify({name: name, items: items, chickens: chickens, spawn_probs: spawnProbs});
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

    const readFileOnUpload = (upJson) => {
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
            try {
                setItems(JSON.parse(fileReader.result).items);
            } catch(e) {
                console.log("**Not valid JSON file!**");
            }
        }
        if (upJson !== undefined) fileReader.readAsText(upJson);
    }

    return (
        <div>
            <h1 className = "title"> WHAT THE FLOCK! Level Editor</h1>
            <div className = "upload">
            <p>Load json level: </p>
            <input type="file" onChange={(e) => readFileOnUpload(e.target.files[0])} />
            </div>

            <div className = "grid">
                {items.map((itemName, i) =>
                    <Square
                    itemName = {itemName}
                    itemId = {i}
                    hide = {false}
                    large = {false}
                    callback = {changeHandler}
                    />
                )
                }

            </div>

            <div className = "selector">
                <p className = "selected">Currently Selected: <Square 
                itemName = {selected}
                itemId = {0}
                hide = {false}
                large = {true}
                callback = {() => false}
                /></p>
                {pieces.map((itemName, i) =>
                <Square
                    itemName = {itemName}
                    itemId = {i}
                    hide = {false}
                    large = {false}
                    callback = {changeSelector}
                />)}
                <p> Spawn Probabilities: </p>
                {chickens.map((itemName, i) =>
                <Square 
                    itemName = {itemName}
                    itemId = {i}
                    hide = {false}
                    large = {false}
                    callback = {chickenSelected}
               /> )}
               <form>
                    <label>
                        Spawn Probability of {chickens[chicken]}: 
                        <textarea className= "jAdd" value = {spawnProbs[chicken]} onChange={changeChicken} />
                    </label>
                </form>
                <form>
                    <label>
                        Level Name: 
                        <textarea className= "jAdd" value = {name} onChange={handleName} />
                    </label>
                </form>
                <button className = "download" onClick = {downloadTxtFile}>Save JSON</button>
            </div>


        </div>
    )

}

export default Board;