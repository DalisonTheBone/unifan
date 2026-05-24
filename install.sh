CONFIG_DIR="/etc/unifan"
BIN_DIR="/usr/bin/unifan-bin"

sudo mkdir -p "$CONFIG_DIR"
sudo mkdir -p "$CONFIG_DIR/modules"
sudo mkdir -p "$CONFIG_DIR/profiles"

sudo cat ./default_config.json > "$CONFIG_DIR/config.json"
sudo cat ./default_profile.json > "$CONFIG_DIR/profiles/default.json"

sudo mkdir -p "$BIN_DIR"
sudo cp unifan-daemon.js "$BIN_DIR"

sudo cp unifan.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now unifan.service

sudo install -Dm755 unifan-cmd.js /usr/local/bin/unifan

echo "Complete!"
