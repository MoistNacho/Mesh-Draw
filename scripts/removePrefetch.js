/* eslint-disable no-useless-escape */
const path = require("path");
const replace = require("replace-in-file");

const distDir = "./dist";
const indexHtmlFilePath = path.join(distDir, "index.html");

replace.sync({
  files: [indexHtmlFilePath],
  from: /<link[^>]*rel="prefetch"[^>]*>/g,
  to: "",
});

replace.sync({
  files: [indexHtmlFilePath],
  from: `<script src="https://connect.facebook.net/en_US/fbevents.js" async></script>`,
  to: "",
});
