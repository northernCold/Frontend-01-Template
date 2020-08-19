const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  mode: "development",
  entry: "./src/main.js",
  devServer: {
    open: true,
    compress: false,
    contentBase: "./src"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [["@babel/plugin-transform-react-jsx", { pragma: "createElement"}]]
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin()
  ],
  optimization: {
    minimize: false
  }
}