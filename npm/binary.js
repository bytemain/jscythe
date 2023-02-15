const { Binary } = require("binary-installer");

const binary = new Binary("jscythe", __dirname);
binary.configureGitHubRelease(
  "bytemain",
  "jscythe",
  "v0.0.2",
  "https://gh.artin.li"
);

module.exports = {
  binary,
};
