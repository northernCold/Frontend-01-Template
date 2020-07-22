module.exports = {
  mode: "development",
  entry: "./main.js",
  module: {
    rules: [
      {
        test: /\.view$/,
        use: {
          loader: require.resolve('./loader.js'),
        }
      }
    ]
  },
  optimization: {
    minimize: false
  }
}