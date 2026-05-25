# Unifan
Simple and universal fan control cli with module support for adding your own laptop/computer as a module while keeping your fan profiles.

## Officaly Supported Computers
- Lenovo Thinkpad E14 Gen 2 Intel

## Install
Installing unifan is pretty simple:
```sh
git clone https://github.com/DalisonTheBone/unifan.git
cd unifan
sudo bash ./install.sh
```
## Setup
Now that unifan is installed, you need to add a module
### Module Instalation
To set up a module's enviroment, run:
```sh
sudo unifan module install path/to/module.js
```
### Add Module
Now that the module is setup, add it to unifan!
```sh
sudo unifan module add path/to/module.js
```
### Adding A Fan Profile
Unifan uses fan profiles, json files that specify rules for how the fan should be controled.
```sh
sudo unifan profile add path/to/profile.json
```
## Creating Fan Profiles
Fan profiles are used as custom rules for controling the speed of your fans, based on tempature ranges.

### Structure
Fan profiles are formatted json files, a array of arrays that control the fan rules.
```json
[rule1, rule2, rule3]
```
Every 3 seconds, your computer fan's will check to see if it satisfys one of these rules and set the fan speed acordingly.
A Rule is formatted as so:
```json
[Fan_Speed_Percentage, Tempature_Range]
```
Heres an example profile:
```json
[
    [0, [0,50]],
    [0.625, [60, 65]],
    [0.875, [70,75]],
    [1, [85, 120]]
]
```
Range tempatures are in degrees celcius, Fan speed is written as a percent as a decimal. You can have any amount of rules.

## Creating Modules
Modules are used to both change the tempature and read the tempatures.
### Format
Modules are written as a node common js file.
### File Specifics
Each file needs to export the following functions
```js
set_speed(speed: 0 - 1): nil
read_temp(): tempature in degrees celcius
install()
```
- set_speed: sets the fan speed for the computer from a 0-1 value
- read_temp: returns a tempature
- install: installs and sets up your computer for the rest of the module to function

### Example Module
```js

// module functions
async function set_speed(speed) {}
async function read_temp() {}
async function install() {}

// module exports
module.exports = {
    set_speed: set_speed,
    read_temp: read_temp,
    install: install
}

```

## Contribution
On the off chance someone see's and they have something to contribute, feel free! You can contact me an I'll go review it. Hope this project helps anyone who uses it.
