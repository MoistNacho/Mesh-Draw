const CopyPlugin = require("copy-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const merge = require("webpack-merge");

const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",
  devtool: "nosources-source-map",
  plugins: [
    new CopyPlugin([{ from: "public", to: "" }]),
    new ForkTsCheckerWebpackPlugin(),
  ],
  stats: "minimal",
});
