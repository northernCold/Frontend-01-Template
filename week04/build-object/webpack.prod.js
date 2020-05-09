const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./main.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js"
  },
  module: {
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, `./index.html`),
      filename: `index.html`,
      inject: true,
      minify: {
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        minifyCSS: true,
        minifyJS: true,
        removeComments: false
      }
    }),
    new CleanWebpackPlugin(),
  ]
}