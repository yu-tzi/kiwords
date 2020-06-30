const path = require("path");
module.exports = {
  mode: 'development',
  entry: "./src/app.js",
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "app.js"
  },
  devServer: {
    contentBase: "./public"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader"]
      }
    ]
  }
};