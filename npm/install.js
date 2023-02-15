const { binary } = require("./binary");
if (binary.exists()) {
  console.log(`\n${binary.name} is already installed, reinstalling...`);
  binary.uninstall();
}

binary.install();
