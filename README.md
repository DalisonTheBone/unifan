# Unifan
Simple and universal fan control cli with module support for adding your own laptop/computer as a module while keeping your fan profiles.

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

