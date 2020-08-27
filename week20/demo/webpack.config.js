
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
            "presets": [
              ["@babel/preset-env", {
              "useBuiltIns": "usage",
              "corejs": 3
            }]
            ],
            plugins: ["istanbul",["@babel/plugin-transform-react-jsx", { pragma: "createElement"}]]
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