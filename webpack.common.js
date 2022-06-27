require("dotenv").config();

const Dotenv = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const { version } = require("./package.json");

const presetEnvPreset = [
  "@babel/preset-env",
  {
    targets: {
      ie: "11",
    },
    useBuiltIns: "entry",
    corejs: 3,
  },
];

module.exports = {
  entry: {
    main: ["whatwg-fetch", "./src/index"],
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    filename: "[name].[hash:8].js",
    chunkFilename: "[name].[hash:8].js",
  },
  resolve: {
    modules: ["node_modules", path.join(__dirname, "./src")],
    alias: {
      apiClients: path.resolve(__dirname, "./src/apiClients"),
      assets: path.resolve(__dirname, "./src/assets"),
      components: path.resolve(__dirname, "./src/components"),
      lib: path.resolve(__dirname, "./src/lib"),
      routes: path.resolve(__dirname, "./src/routes"),
      stores: path.resolve(__dirname, "./src/stores"),
      config: path.resolve(__dirname, "./src/config"),
      theme: path.resolve(__dirname, "./src/theme"),
    },
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        include: path.join(__dirname, "src"),
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              babelrc: false,
              presets: [presetEnvPreset, "@babel/preset-react"],
              env: {
                development: {
                  plugins: [
                    "react-hot-loader/babel",
                    "@babel/plugin-syntax-dynamic-import",
                    "@babel/plugin-proposal-optional-chaining",
                    "@babel/plugin-proposal-nullish-coalescing-operator",
                  ],
                },
              },
              plugins: ["@babel/plugin-syntax-dynamic-import"],
            },
          },
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.js$/,
        exclude: /@babel(?:\/|\\{1,2})runtime|core-js/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              babelrc: false,
              presets: [presetEnvPreset],
            },
          },
        ],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg|gif|jpg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10240, // 10K
              outputPath: "./assets",
              name: "[name].[contentHash].[ext]",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      templateParameters: {
        title: "Mesh Draw",
        description: "description",
        url: "url",
        themeColor: "#ffffff",
      },
    }),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(version),
    }),
    new Dotenv({
      path: `./env/${process.env.stage || "local"}.env`,
      systemvars: true,
    }),
    // new BundleAnalyzerPlugin(),
  ],
};
