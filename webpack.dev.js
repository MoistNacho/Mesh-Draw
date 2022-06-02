const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");

const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    contentBase: path.join(__dirname, "public"),
    historyApiFallback: {
      rewrites: [{ from: /./, to: "/index.html" }],
    },
    hot: true,
    port: 6927,
    stats: "minimal",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      eslint: {
        files: "./src/**/*.{ts,tsx,js,jsx}",
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
});
