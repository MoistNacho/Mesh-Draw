/* eslint-disable global-require */
const wp = require("@cypress/webpack-preprocessor");

module.exports = on => {
  const options = {
    webpackOptions: require("../webpack.cypress.js"),
  };
  on("file:preprocessor", wp(options));
};
