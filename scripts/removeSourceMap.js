const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");

const distDir = "./dist";

const removeSourceMap = (file, dir) => {
  if (/\.js$/.test(file)) {
    fs.readFile(path.join(dir, file), "utf8", (err, data) => {
      if (!data) {
        return;
      }
      const result = data.split("\n");
      let sourceMapIndex;

      if (result.length < 2) {
        return;
      }

      if (result[result.length - 1].startsWith("//# sourceMappingURL")) {
        sourceMapIndex = result.length - 1;
      } else if (result[result.length - 2].startsWith("//# sourceMappingURL")) {
        sourceMapIndex = result.length - 2;
      }

      if (sourceMapIndex !== undefined) {
        fs.writeFileSync(
          path.join(dir, file),
          result.slice(0, sourceMapIndex).join("\n"),
        );
      }
    });
  }
};

(function deleteMaps() {
  fs.readdir(distDir, (err, files) => {
    if (files) {
      rimraf(`${distDir}/*.js.map`, () => {
        files.forEach((file) => removeSourceMap(file, distDir));
      });
    }
  });
})();
