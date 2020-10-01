var path = require('path');

module.exports = {
  mode: "development",
  context: __dirname,

  entry: {
    app: './app/styles/style.js'
  },

  output: {
    path: path.join(__dirname, 'app/styles'),
    publicPath: '/public/',
    filename: '[name].bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'},
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [require('autoprefixer')];
              }
            }
          },
          {loader: 'sass-loader'}
        ]
      }
    ]
  }
}
