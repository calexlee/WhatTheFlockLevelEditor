import React, {useState} from "react"
import Square2 from "./Square2.js"
import "./board.css"

const Board2 = ({callback}) => {

    const [selected, setSelected] = useState("chef")
    const [height, setHeight] = useState(54)
    const [width, setWidth] = useState(32)
    const [name, setName] = useState("level")
    const [startBiome, setBiome] = useState("cave")
    const [items, setItems] = useState({
        items: [...Array(1)].map(() => Array(width*height).fill("")), 
        startPos: [],
        waveNumber: 1,
        selectedWave: 1,
    })

    const pieces = ["chef", "wall", " "]

    const enemies = ["chicken nugget", "buffalo chicken", "shredded chicken", "dino nugget", "hot chick"]

    const changeBiome = (event) => {
        setBiome(event.target.value)
    }

    const addWaveNumber = (event) => {
        const new_items = items.items.slice()
        new_items[new_items.length] = new_items[0].slice()
        setItems({items: new_items, startPos: items.startPos, waveNumber: items.waveNumber + 1, selectedWave: items.selectedWave})
    }
    
    const subWaveNumber = (event) => {
        if (items.waveNumber > 0){
            setItems({items: items.items.pop(), startPos: items.startPos, waveNumber: items.waveNumber - 1, selectedWave: items.selectedWave})
            if (items.waveNumber < items.selectedWave){
                decSelectedWave()
            }
        }
    }

    const changeHandler = (itemId, x, y, itemName) => {
        const new_item_array = items.items.slice()
        if (!enemies.includes(selected)){ // if not enemies
            new_item_array.forEach(array => {
                array[itemId] = selected
            })
        } else {
            // if an enemy
            new_item_array[items.selectedWave-1][itemId] = selected
        }
        if (selected === "chef"){
            setItems({items: new_item_array, startPos: [x,y], waveNumber: items.waveNumber, selectedWave: items.selectedWave})
        } else {
            setItems({items: new_item_array, startPos: items.startPos, waveNumber: items.waveNumber, selectedWave: items.selectedWave})
        }
    }

    const calcPlatforms = (items) => {
        var x = 0
        var y = height - 1
        var curW = 0
        var totalPlats = []

        items.forEach(i => {
            if (i === "wall"){
                curW++
            }
            x = (x + 1) % width
            if (x === 0 || i !== "wall"){
                if (x === 0) y--
                if (curW > 0){
                    totalPlats.push([x - curW, y, curW])
                    curW = 0
                }
            }
        })
        console.log(totalPlats)
    }
    
    const calcEnemyPos = (items) => {
        var x = 0
        var y = height - 1
        var enemyPosForWave = []

        items.forEach(i => {
            if (enemies.includes(i)){
                enemyPosForWave.push([x, y])
            }
            x = (x + 1) % width
            if (x === 0) y--
        })
    }

    const changeSelector = (itemId) => {
        const all_pieces = pieces.concat(enemies)
        setSelected(all_pieces[itemId])
    }

    const incSelectedWave = () => {
        if (items.selectedWave < items.waveNumber){
            setItems({items: items.items, startPos: items.startPos, waveNumber: items.waveNumber, selectedWave: items.selectedWave + 1})
        }
    }

    const decSelectedWave = () => {
        if (items.selectedWave > 0) {
            setItems({items: items.items, startPos: items.startPos, waveNumber: items.waveNumber, selectedWave: items.selectedWave - 1})
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
                {items.items[items.selectedWave-1].map((itemName, i) =>
                    <Square2
                    itemName = {itemName}
                    itemId = {i}
                    hide = {false}
                    large = {false}
                    callback = {changeHandler}
                    x = {i % width}
                    y = {height - Math.floor(i / width) - 1}
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
                        Spawns in Wave {items.selectedWave}
                    </label>
                    <br/>
                    <label> 
                        There are {items.waveNumber} total waves
                    </label>
                    <label>
                        The starting position is {items.startPos}
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