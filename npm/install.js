const npm = require('./installer');
const binary = npm();
if (binary.exists()) {
  console.log(`\n${binary.name} is already installed, reinstalling...`)
  binary.uninstall();
}

binary.install();
