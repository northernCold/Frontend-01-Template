
module.exports = {
  mode: "development",
  entry: "./src/main.js",
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
      },
      {
        test: /.css$/,
        use: {
          loader: require.resolve("./lib/css-loader.js")
        }
      }
    ]
  },
  optimization: {
    minimize: false
  }
}