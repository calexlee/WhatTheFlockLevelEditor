import React, {useState} from "react"
import Square2 from "./Square2.js"
import "./board.css"

const Board2 = ({callback}) => {

    const [selected, setSelected] = useState("chef")
    const [height, setHeight] = useState(54)
    const [width, setWidth] = useState(32)
    const [items, setItems] = useState(Array(width*height).fill(""))
    const [name, setName] = useState("level")
    const [startBiome, setBiome] = useState("cave")

    const pieces = ["chef", "wall", " "]
    
    const [waveNumber, setWaveNumber] = useState(0)

    const enemies = ["chicken nugget", "buffalo chicken", "shredded chicken", "dino nugget", "hot chick"]

    const [waves, setWaves] = useState(Array(waveNumber).fill(0))
    const [selectedWave, setSelectedWave] = useState(0)

    const changeBiome = (event) => {
        setBiome(event.target.value)
    }

    const addWaveNumber = (event) => {
        setWaveNumber(waveNumber + 1)
    }
    
    const subWaveNumber = (event) => {
        if (waveNumber > 0){
            setWaveNumber(waveNumber - 1)
            if (waveNumber < selectedWave){
                decSelectedWave()
            }
        }
    }

    const changeHandler = (itemId) => {
        const new_items = items.slice()
        new_items[itemId] = selected
        setItems(new_items)
    }

    const changeSelector = (itemId) => {
        const all_pieces = pieces.concat(enemies)
        setSelected(all_pieces[itemId])
    }

    const incSelectedWave = () => {
        if (selectedWave < waveNumber){
            setSelectedWave(selectedWave + 1)
        }
    }

    const decSelectedWave = () => {
        if (selectedWave > 0) {
            setSelectedWave(selectedWave - 1)
        }
    }

    const saveToJson = () => {
        const json = JSON.stringify(
            {name: name, 
                // start_pos: startPos,
                // biome: startBiome,
                // level_height: height,
                // spawn_order: spawnOrder,
                // spawn_pos: spawnPositions,
                // spawn_times: spawnTimes,
                // spawner_types: spawnerTypes,
                // unlocks: unlocks,
                // platforms: platforms,
            });
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
                setName(JSON.parse(fileReader.result).name);
            } catch(e) {
                console.log("**Not valid JSON file!**");
            }
        }
        if (upJson !== undefined) fileReader.readAsText(upJson);
    }

    return (
        <div>
            <h1 className = "title"> Liminal Spirit Level Editor</h1>
            <div className = "upload">
            <p>Load json level: </p>
            <input type="file" onChange={(e) => readFileOnUpload(e.target.files[0])} />
            </div>

            <div className = "grid">
                {items.map((itemName, i) =>
                    <Square2
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
                <p className = "selected">Currently Selected: <Square2
                itemName = {selected}
                itemId = {0}
                hide = {false}
                large = {true}
                callback = {() => false}
                /></p>
                {pieces.map((itemName, i) =>
                <Square2
                    itemName = {itemName}
                    itemId = {i}
                    hide = {false}
                    large = {false}
                    callback = {changeSelector}
                />)}
                <p> Enemies: </p>
                {enemies.map((itemName, i) =>
                <Square2 
                    itemName = {itemName}
                    itemId = {i + pieces.length}
                    hide = {false}
                    large = {false}
                    callback = {changeSelector}
               /> )}
               <div></div>
               <br></br>
                <button className= "addWave" onClick = {addWaveNumber}>Add Wave to Level</button>
                <button className= "subWave" onClick = {subWaveNumber}> Subtract Wave from Level </button>
                <button className= "nextWave" onClick = {incSelectedWave}>Go to Next Wave</button>
                <button className= "prevWave" onClick = {decSelectedWave}> Go to Previous Wave </button>
                <br/>
                <form>
                    <label>
                        Spawns in Wave {selectedWave}
                    </label>
                    <br/>
                    <label> 
                        There are {waveNumber} total waves
                    </label>
                </form>
                <h2> Other Values </h2>
                <form>
                    <label>
                        Biome:
                        <textarea className= "jAdd" value = {startBiome} onChange= {changeBiome} />
                    </label>
                    <br/>
                    <label>
                        Spawner Types:
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

export default Board2;