require("dotenv").config();

const Dotenv = require("dotenv-webpack");

module.exports = {
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new Dotenv({
      path: `./env/${process.env.stage || "local"}.env`,
      safe: true,
      systemvars: true,
    }),
  ],
};
