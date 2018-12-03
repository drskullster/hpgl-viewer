const path = require('path');

module.exports = {
  entry: './src/hpgl-viewer.js',
  output: {
    filename: 'hpgl-viewer.js',
    path: path.resolve(__dirname, 'lib'),
    libraryTarget: "umd"
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'demo'),
    publicPath: '/hpgl-viewer/lib/'
  }
};
