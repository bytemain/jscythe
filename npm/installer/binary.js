const { existsSync, mkdirSync, rmSync } = require("fs");
const { join } = require("path");
const { spawnSync, spawn } = require("child_process");

const axios = require("axios");
const tar = require("tar");

const rmrf = path => {
  return rmSync(path, { force: true, recursive: true });
}

const error = msg => {
  console.error(msg);
  process.exit(1);
};

class Binary {
  constructor(name, url) {
    let errors = [];
    if (typeof url !== "string") {
      errors.push("url must be a string");
    } else {
      try {
        new URL(url);
      } catch (e) {
        errors.push(e);
      }
    }
    if (name && typeof name !== "string") {
      errors.push("name must be a string");
    }

    if (!name) {
      errors.push("You must specify the name of your binary");
    }
    if (errors.length > 0) {
      let errorMsg =
        "One or more of the parameters you passed to the Binary constructor are invalid:\n";
      errors.forEach(error => {
        errorMsg += error;
      });
      errorMsg +=
        '\n\nCorrect usage: new Binary("my-binary", "https://example.com/binary/download.tar.gz")';
      error(errorMsg);
    }
    this.url = url;
    this.name = name;
    this.installDirectory = join(__dirname, "..", "bin");

    if (!existsSync(this.installDirectory)) {
      mkdirSync(this.installDirectory, { recursive: true });
    }

    this.binaryPath = join(this.installDirectory, this.name);
  }

  exists() {
    return existsSync(this.binaryPath);
  }

  uninstall() {
    if (existsSync(this.installDirectory)) {
      rmrf(this.installDirectory);
    }
  }

  install(fetchOptions, suppressLogs = false) {
    if (existsSync(this.installDirectory)) {
      rmrf(this.installDirectory);
    }

    mkdirSync(this.installDirectory, { recursive: true });

    if (!suppressLogs) {
      console.error(`Downloading release from ${this.url}`);
    }

    return axios({ ...fetchOptions, url: this.url, responseType: "stream" })
      .then(res => {
        return new Promise((resolve, reject) => {
          const sink = res.data.pipe(
            tar.x({ strip: 1, C: this.installDirectory })
          );
          sink.on("finish", () => resolve());
          sink.on("error", err => reject(err));
        });
      })
      .then(() => {
        if (!suppressLogs) {
          console.error(`${this.name} has been installed!`);
        }
      })
      .catch(e => {
        error(`Error fetching release: ${e.message}`);
      });
  }

  async run() {
    if (!this.exists()) {
      await this.install()
    }
    const [, , ...args] = process.argv;
    const child = spawn(this.binaryPath, args, { cwd: process.cwd(), stdio: "inherit" });
    child.on('close', (code) => {
      console.log(`\nProcess exited with code ${code}`);
    });
  }

  runSync() {
    if (!this.exists()) {
      this.install()
    }

    const [, , ...args] = process.argv;

    const options = { cwd: process.cwd(), stdio: "inherit" };

    const result = spawnSync(this.binaryPath, args, options);

    if (result.error) {
      error(result.error);
    }

    process.exit(result.status);
  }
}

module.exports.Binary = Binary;
