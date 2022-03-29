import React, {useState} from "react"
import Square2 from "./Square2.js"
import "./board.css"

var CryptoJS = require("crypto-js");

const Board2 = ({callback}) => {

    const [selected, setSelected] = useState("chef")
    const [height, setHeight] = useState(54)
    const [width, setWidth] = useState(32)
    const [name, setName] = useState("level")
    const [startBiome, setBiome] = useState("cave")
    const [items, setItems] = useState({
        items: [...Array(1)].map(() => Array(54*32).fill(" ")), 
        startpos: [],
        wavenumber: 1,
        selectedwave: 1,
        wavespawntimes: Array(1).fill(0),
    })

    const pieces = ["chef", "wall", " "]

    const enemies = ["lost", "specter", "circle", "triangle", "square", "seeker", "glutton", " "]

    const changeBiome = (event) => {
        setBiome(event.target.value)
    }

    const changeSpawnTimes = (event) => {
        const newWaveSpawns = items.wavespawntimes.slice()
        const num = parseInt(event.target.value) 
        newWaveSpawns[items.selectedwave - 1] = isNaN(num) ? 0 : num
        setItems({items: items.items, startpos: items.startpos, wavenumber: items.wavenumber, selectedwave: items.selectedwave, wavespawntimes: newWaveSpawns})
    }

    const addWaveNumber = () => {
        const new_items = items.items.slice()
        new_items[new_items.length] = new_items[0].slice()
        const newSpawnTimes = items.wavespawntimes.slice()
        newSpawnTimes.push(0)
        setItems({items: new_items, startpos: items.startpos, wavenumber: items.wavenumber + 1, selectedwave: items.selectedwave, wavespawntimes: newSpawnTimes})
    }
    
    const subWaveNumber = () => {
        if (items.wavenumber > 1){
            var new_items =  items.items.slice()
            new_items.pop()
            var new_spawn_times = items.wavespawntimes.slice()
            new_spawn_times.pop()
            if (items.wavenumber - 1 < items.selectedwave){
                setItems({items: new_items, startpos: items.startpos, wavenumber: items.wavenumber - 1, selectedwave: items.selectedwave - 1, wavespawntimes: new_spawn_times})
            } else {
                setItems({items: new_items, startpos: items.startpos, wavenumber: items.wavenumber - 1, selectedwave: items.selectedwave, wavespawntimes: new_spawn_times})
            }
        }
    }

    const changeHandler = (itemId, x, y, itemName) => {
        const new_item_array = items.items.slice()
        if (!enemies.includes(selected) || (selected === " " && !enemies.includes(itemName))){ // if not enemies 
            new_item_array.forEach(array => {
                array[itemId] = selected
            })
        } else {
            // if an enemy
            new_item_array[items.selectedwave-1][itemId] = selected
        }
        if (selected === "chef"){
            setItems({items: new_item_array, startpos: [x,y], wavenumber: items.wavenumber, selectedwave: items.selectedwave, wavespawntimes: items.wavespawntimes})
        } else {
            setItems({items: new_item_array, startpos: items.startpos, wavenumber: items.wavenumber, selectedwave: items.selectedwave, wavespawntimes: items.wavespawntimes})
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
        if (items.selectedwave < items.wavenumber){
            setItems({items: items.items, startpos: items.startpos, wavenumber: items.wavenumber, selectedwave: items.selectedwave + 1, wavespawntimes: items.wavespawntimes})
        }
    }

    const decSelectedWave = () => {
        if (items.selectedwave > 1) {
            setItems({items: items.items, startpos: items.startpos, wavenumber: items.wavenumber, selectedwave: items.selectedwave - 1, wavespawntimes: items.wavespawntimes})
        }
    }

    const saveToJson = () => {
        const json = JSON.stringify(
            {name: name, 
                start_pos: items.startpos,
                biome: startBiome,
                level_height: height,
                spawn_order: getEnemyList(),
                spawn_pos: calcAllEnemyPos(),
                spawn_times: items.wavespawntimes,
                // spawner_types: spawnerTypes,
                // unlocks: unlocks,
                platforms: calcPlatforms(items.items[0]),
                items: items.items,
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
                setItems({items: JSON.parse(fileReader.result).items, 
                          startpos: JSON.parse(fileReader.result).start_pos,
                          wavenumber: JSON.parse(fileReader.result).items.length,
                          selectedwave: 1,
                          wavespawntimes: JSON.parse(fileReader.result).spawn_order});
                setHeight(JSON.parse(fileReader.result).height);
                setBiome(JSON.parse(fileReader.result).biome);
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
                {items.items[items.selectedwave-1].map((itemName, i) =>
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
                        Spawns in Wave {items.selectedwave}
                    </label>
                    <br/>
                    <label> 
                        There are {items.wavenumber} total waves
                    </label>
                </form>
                <h2> Other Values </h2>
                <form>
                    <label>
                        Spawn Times are currently [{items.wavespawntimes.map((i) =>{ return <span>[{i}]</span>})}]: 
                        <textarea className = "jAdd" onChange = {changeSpawnTimes} />
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