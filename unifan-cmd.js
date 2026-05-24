#!/usr/bin/env node

// Imports
const fs = require("fs")
const os = require('os');
const { exec } = require("child_process");
const util = require("util");

const Execute = util.promisify(exec);

// Constants
const CONFIG_DIR=`/etc/unifan`

// Args
const args = process.argv.slice(2);

// Functions
async function ReadConfig(path) {
    
    if (!(await fs.existsSync(path))) {return {}}

    return JSON.parse(await fs.readFileSync(path, "utf8").toString())

}

async function WriteConfig(path, config) {
    
    if (!(await fs.existsSync(path))) {return}

    await fs.writeFileSync(path, JSON.stringify(config))

}

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

// Command Logic
async function help() {
    console.log(`to use this program you need to add and install a module\n-- Commands ----------
        \n- Modules -\nunifan module install path/to/module.js - installs enviroment for module to work\nunifan module add path/to/module.js - uses specified module
        \n- Profiles -\nunifan profile add path/to/profile.json - sets the fan profile to provided
        \n- Manual -\nunifan speed % -- sets the fan speed to the provided percent (0-1)
        \n- Misc -\nunifan reload -- reloads the daemon, needed for switching back to using profiles after manualy setting`)
}

async function module_add([path]) {
    
    if (path == undefined) {return}

    await RunCommand(`sudo cp ${path} ${CONFIG_DIR}/modules`)
    let splitFile = path.split('/')
    let fineName = splitFile[splitFile.length - 1]

    let config = await ReadConfig(`${CONFIG_DIR}/config.json`)
    config.module = `${CONFIG_DIR}/modules/${fineName}`
    await WriteConfig(`${CONFIG_DIR}/config.json`, config)

    await RunCommand("sudo systemctl restart unifan.service")

}

async function profile_add([path]) {
    
    if (path == undefined) {return}

    await RunCommand(`sudo cp ${path} ${CONFIG_DIR}/profiles`)
    let splitFile = path.split('/')
    let fineName = splitFile[splitFile.length - 1]

    let config = await ReadConfig(`${CONFIG_DIR}/config.json`)
    config.profile = `${CONFIG_DIR}/profiles/${fineName}`
    await WriteConfig(`${CONFIG_DIR}/config.json`, config)

    await RunCommand("sudo systemctl restart unifan.service")

}

async function speed([speed]) {
    
    await RunCommand("sudo systemctl stop unifan.service")

    if (speed == undefined) {return}
    speed = Number(speed)

    let config = await ReadConfig(`${CONFIG_DIR}/config.json`)

    const usedModule = await require(`${config.module}`)

    usedModule.set_speed(speed)

}

async function install([path]) {

    console.log("installing...")
    const usedModule = await require(`${path}`)
    await usedModule.install()

}

async function reload() {
    await RunCommand("sudo systemctl restart unifan.service")
}

// commands
let Commands = {
    "help": help,
    "module": {"add": module_add, "install": install},
    "profile": {"add": profile_add},
    "reload": reload,
    "speed": speed
}

// Init
async function main() {

    await RunCommand("sudo echo ")

    let commandFunc = Commands
    let args = await process.argv.slice(2);
    let index = 0
    let cmdArgs = []

    for (const arg of args) {
        if (commandFunc[arg] === undefined) {cmdArgs = args.slice(index); break}
        commandFunc = commandFunc[arg]
        index++
        cmdArgs = args.slice(index)
    }
    
    try {
        await commandFunc(cmdArgs)
    } catch (err) {console.log("Invalid Command! Try 'unifan help'.")}

}

main()
