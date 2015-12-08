var path = require('path')

module.exports = {
  entry: './examples/index.tsx',
  // Currently we need to add '.ts' to resolve.extensions array.
  resolve: {
    alias: {
      src: path.join(__dirname, 'src')
    },
    extensions: ['', '.ts', '.tsx', '.webpack.js', '.web.js', '.js']
  },

  output:{
    path: './build/',
    filename: 'bundle.js',
    publicPath: '/'
  },

  // Source maps support (or 'inline-source-map' also works)
  devtool: 'source-map',

  // Add loader for .ts files.
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  },

  plugins: []
};