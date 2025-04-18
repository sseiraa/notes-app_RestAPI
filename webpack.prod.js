const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
module.exports = module.exports = merge(common, {
  mode: "production",
  module: {
    rules: [
      /* style and css*/
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
        ],
      },
      /* babel*/
      {
        test: /\.js$/,
        exclude: "/node_modules/",
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    /*html webpack plugin*/
    new HtmlWebpackPlugin({
      template: "./src/template.html",
      filename: "index.html",
    }),
  ],
});
