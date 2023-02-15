const { Binary } = require('./binary');
const os = require('os');

const name = 'jscythe';

function getPlatform() {
    const type = os.type();
    const arch = os.arch();

    if (type === 'Windows_NT') return `windows-${arch}`;
    if (type === 'Linux') return `linux-${arch}`;
    if (type === 'Darwin') return `darwin-${arch}`;

    throw new Error(`Unsupported platform: ${type} ${arch}`);
}

function getBinary() {
    const platform = getPlatform();
    const version = require('../package.json').version;
    const url = `https://gh.artin.li/https://github.com/bytemain/jscythe/releases/download/v${version}/jscythe-${platform}.tar.gz`;
    return new Binary(name, url);
}

module.exports = getBinary;
