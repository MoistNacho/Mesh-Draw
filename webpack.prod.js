const SentryWebpackPlugin = require("@sentry/webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const merge = require("webpack-merge");

const { version } = require("./package.json");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",
  devtool: "nosources-source-map",
  plugins: [
    new CopyPlugin([{ from: "public", to: "" }]),
    new SentryWebpackPlugin({
      release: version,
      include: "./dist",
      setCommits: {
        repo: "meshkorea/",
        auto: true,
        ignoreMissing: true,
      },
      ignore: [
        "coverage",
        "node_modules",
        "scripts",
        "assetsTransformer.js",
        "babel.config.js",
        "test.setup.js",
        "test.shim.js",
        "webpack.config.js",
        "vendor",
      ],
      silent: true,
    }),
  ],
  stats: "minimal",
});
