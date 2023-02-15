const { Binary } = require('./binary');
const os = require('os');

const name = 'jscythe';
const releaseTag = process.env.JSCYTHE_RELEASE_TAG || '0.0.2'

function getPlatform() {
    const type = os.type();
    const arch = os.arch();

    // if (type === 'Windows_NT') return `windows-${arch}`;
    // if (type === 'Linux') return `linux-${arch}`;
    if (type === 'Darwin') return `darwin-${arch}`;

    throw new Error(`Unsupported platform: ${type} ${arch}`);
}

function getBinary() {
    const platform = getPlatform();
    const url = `https://gh.artin.li/https://github.com/bytemain/jscythe/releases/download/v${releaseTag}/jscythe-${platform}.tar.gz`;
    return new Binary(name, url);
}

module.exports = getBinary;
