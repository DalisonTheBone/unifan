
// Imports
const { env } = require("process");
const fs = require("fs");
const os = require('os');

// Constants
const CONFIG_DIR=`${os.homedir()}/.config/unifan`

// Config
let config = {
    "module": "",
    "profile": ""
}
let profile = []
let usedModule
let FanMode = "auto"

// Functions
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function loadConfig() {

    let success = true
    let errMsg = ""
    
    try {
        if (await fs.existsSync(`${CONFIG_DIR}/config.json`)) {
            config = JSON.parse(await fs.readFileSync(`${CONFIG_DIR}/config.json`, 'utf8').toString())
        } else {console.error()}

    } catch (err) {
        success = false
        errMsg = err
    }

    if (!success) {console.error(errMsg)}

}

async function loadProfile() {

    let success = true
    let errMsg = ""
    
    try {
        if (await fs.existsSync(`${config.profile}`)) {
            profile = JSON.parse(await fs.readFileSync(`${config.profile}`, 'utf-8').toString())
        } else {console.error()}

    } catch (err) {
        success = false
        errMsg = err
    }

    if (!success) {console.error(errMsg)}

}

async function loadModule() {

    let success = true
    let errMsg = ""
    
    try {

        usedModule = require(`${config.module}`)

    } catch (err) {
        success = false
        errMsg = err
    }

    if (!success) {console.error(errMsg)}

}

function isNumberInRange(Number, Range) {

    const [min, max] = Range

    return (Number >= min && Number <=max)

}

async function SetFanRange(Tempature) {
    
    for (let key in profile) {
        if (profile.hasOwnProperty(key)) {
            //console.log(key, "test")
            let [Mode, Range] = profile[key]
            if (key != FanMode && isNumberInRange(Tempature, Range)) {
                FanMode = key
                await usedModule.set_speed(Mode)
            }
        }
    }

}

async function updateFans() {
    
    const temp = await usedModule.read_temp()

    await SetFanRange(temp)

}

async function main() {
    
   await loadConfig()
   await loadProfile()
   await loadModule()

   await SetFanRange(100)
   
   while (true) {

        await sleep(3*1000)
        await updateFans()

   }

}


// Init
console.log(`mkdir -p ${CONFIG_DIR}/test`)
main()
