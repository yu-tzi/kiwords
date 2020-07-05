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
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      }
    ]
  }
};