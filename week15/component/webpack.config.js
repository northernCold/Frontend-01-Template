
module.exports = {
  mode: "development",
  entry: "./src/carousel.js",
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
  optimization: {
    minimize: false
  }
}