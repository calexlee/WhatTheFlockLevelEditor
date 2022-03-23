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
        waveSpawnTimes: Array(1).fill(0),
    })

    const pieces = ["chef", "wall", " "]

    const enemies = ["specter", "mirror"]

    const changeBiome = (event) => {
        setBiome(event.target.value)
    }

    const changeSpawnTimes = (event) => {
        const newWaveSpawns = items.waveSpawnTimes.slice()
        newWaveSpawns[items.selectedWave] = event.target.value
        setItems({items: items.items, startPos: items.startPos, waveNumber: items.waveNumber + 1, selectedWave: items.selectedWave, waveSpawnTimes: newWaveSpawns})
    }

    const addWaveNumber = () => {
        const new_items = items.items.slice()
        new_items[new_items.length] = new_items[0].slice()
        const newSpawnTimes = items.waveSpawnTimes.slice()
        newSpawnTimes.push(0)
        setItems({items: new_items, startPos: items.startPos, waveNumber: items.waveNumber + 1, selectedWave: items.selectedWave, waveSpawnTimes: newSpawnTimes})
    }
    
    const subWaveNumber = () => {
        if (items.waveNumber > 1){
            var new_items =  items.items.slice()
            new_items.pop()
            var new_spawn_times = items.waveSpawnTimes.slice()
            new_spawn_times.pop()
            if (items.waveNumber - 1 < items.selectedWave){
                setItems({items: new_items, startPos: items.startPos, waveNumber: items.waveNumber - 1, selectedWave: items.selectedWave - 1, waveSpawnTimes: new_spawn_times})
            } else {
                setItems({items: new_items, startPos: items.startPos, waveNumber: items.waveNumber - 1, selectedWave: items.selectedWave, waveSpawnTimes: new_spawn_times})
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
            setItems({items: new_item_array, startPos: [x,y], waveNumber: items.waveNumber, selectedWave: items.selectedWave, waveSpawnTimes: items.waveSpawnTimes})
        } else {
            setItems({items: new_item_array, startPos: items.startPos, waveNumber: items.waveNumber, selectedWave: items.selectedWave, waveSpawnTimes: items.waveSpawnTimes})
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
        return totalPlats
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
        return enemyPosForWave
    }

    const calcAllEnemyPos = () => {
        var allEnemyPos = []
        items.items.forEach(itemlist => {
            allEnemyPos.push(calcEnemyPos(itemlist))
        })
        return allEnemyPos
    }

    const getEnemyList = () => {
        var enemyList = []
        items.items.forEach(itemlist => {
            var enemySlice = []
            itemlist.forEach(item => {
                if (enemies.includes(item)){
                    enemySlice.push(item)
                }
            })
            enemyList.push(enemySlice)
        })
        return enemyList
    }

    const changeSelector = (itemId) => {
        const all_pieces = pieces.concat(enemies)
        setSelected(all_pieces[itemId])
    }

    const incSelectedWave = () => {
        if (items.selectedWave < items.waveNumber){
            setItems({items: items.items, startPos: items.startPos, waveNumber: items.waveNumber, selectedWave: items.selectedWave + 1, waveSpawnTimes: items.waveSpawnTimes})
        }
    }

    const decSelectedWave = () => {
        if (items.selectedWave > 1) {
            setItems({items: items.items, startPos: items.startPos, waveNumber: items.waveNumber, selectedWave: items.selectedWave - 1, waveSpawnTimes: items.waveSpawnTimes})
        }
    }

    const saveToJson = () => {
        const json = JSON.stringify(
            {name: name, 
                start_pos: items.startPos,
                biome: startBiome,
                level_height: height,
                spawn_order: getEnemyList(),
                spawn_pos: calcAllEnemyPos(),
                spawn_times: items.spawnTimes,
                // spawner_types: spawnerTypes,
                // unlocks: unlocks,
                platforms: calcPlatforms(items.items[0]),
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
            {/* <div className = "upload">
            <p>Load json level: </p>
            <input type="file" onChange={(e) => readFileOnUpload(e.target.files[0])} />
            </div> */}

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
               <br></br>
                <button className= "addWave" onClick = {addWaveNumber}>Add Wave to Level</button>
                <button className= "subWave" onClick = {subWaveNumber}> Subtract Wave from Level </button>
                <button className= "nextWave" onClick = {incSelectedWave}>Go to Next Wave</button>
                <button className= "prevWave" onClick = {decSelectedWave}> Go to Previous Wave </button>
                <br/>
                <div className="textfields">
                <form>
                    <label>
                        Spawns in Wave {items.selectedWave}
                    </label>
                    <br/>
                    <label> 
                        There are {items.waveNumber} total waves
                    </label>
                </form>
                <h2> Other Values </h2>
                <form>
                    <label>
                        Wave {items.selectedWave} Spawn Time: 
                        <textarea className = "jAdd" value = {items.waveSpawnTimes[items.selectedWave]} onChange = {changeSpawnTimes} />
                    </label>
                </form>
                <form>
                <label>
                        Biome:
                        <textarea className= "jAdd" value = {startBiome} onChange= {changeBiome} />
                    </label>
                </form>

                <form>
                    <label>
                        Level Name: 
                        <textarea className= "jAdd" value = {name} onChange={handleName} />
                    </label>
                </form>
                </div>
                <button className = "download" onClick = {downloadTxtFile}>Save JSON</button>
            </div>


        </div>
    )

}

export default Board2;