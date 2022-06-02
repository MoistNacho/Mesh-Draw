const fs = require("fs");
const path = require("path");

const stage = process.argv[2];

(function () {
  fs.readFile(path.join("env", `${stage}.env`), "utf8", (err, data) => {
    if (err || !data) {
      return;
    }

    const config = data
      .split("\n")
      .filter((x) => x)
      .reduce((prev, mapping) => {
        const key = mapping.split("=")[0];
        const value = mapping.replace(`${key}=`, "").replace(/"/g, "");
        return {
          ...prev,
          [key]: value,
        };
      }, {});

    const configFile = `window.env = ${JSON.stringify(config)};`;

    fs.readdir("./dist/", function (err, files) {
      if (files) {
        fs.writeFileSync(path.join("dist", "config.js"), configFile);
      }
    });
  });
})();
