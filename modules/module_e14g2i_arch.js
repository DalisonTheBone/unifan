
// Imports
const { exec } = require("child_process");
const util = require("util");

const Execute = util.promisify(exec);

// functions
async function RunCommand(Command) {
    
    let [success, result] = [false, ""]
    
    try {
        const {stdout, stderr} = await Execute(Command)

        if (stderr) {
            [success, result] = [false, stderr]
        }

        if (stdout) {
            [success, result] = [true, stdout]
        }

    } catch (err) {[success, result] = [false, "idk vro :("]}

    return [success, result]

}

async function GetValidTemps() {
    
    let [s, tempStr] = await RunCommand("sensors -jA")

    if (!s) {return [false, {}]}

    let TempJson = JSON.parse(tempStr)
    
    let Responce = {
        "CPU": 0,
        "GPU": 0,
    }

    let Thinkpad = TempJson["thinkpad-isa-0000"]
    let Core = TempJson["coretemp-isa-0000"]

    if (Core && Core["Package id 0"] && Core["Package id 0"]["temp1_input"]) {
        Responce.CPU = Core["Package id 0"]["temp1_input"]
    }

    if (Thinkpad) {

        if (Thinkpad["GPU"]["temp2_input"]) {Responce.GPU = Thinkpad["GPU"]["temp2_input"]}
        if (Thinkpad["CPU"]["temp1_input"]) {Responce.CPU = Thinkpad["CPU"]["temp1_input"]}

    }

    return [true, Responce]

}


async function set_speed(speed) {
    
    speed = Math.min(1, speed)
    speed = Math.max(0, speed)
    speed = Math.floor(speed*8)
    
    if (speed == 0) {speed = "auto"}
    if (speed == 8) {speed = "disengaged"}

    return await RunCommand(`echo "level ${speed}" | tee /proc/acpi/ibm/fan`)

}

async function read_temp() {
    
    const [success, res] = await GetValidTemps()

    if (!success) {
        console.log("Error Getting Temps")
        return 100
    }
    
    return Math.max(res.CPU, res.GPU)

}

// init
module.exports = {
    set_speed: set_speed,
    read_temp: read_temp
}
