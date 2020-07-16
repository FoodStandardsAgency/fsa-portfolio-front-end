var path = require('path');

module.exports = {
  mode: 'development',
  context: __dirname,

  entry: {
    app: './app/assets/sass/application.scss',
    display: './app/assets/sass/display.scss'
  },

  output: {
    path: path.join(__dirname, 'public'),
    publicPath: '/public/',
    filename: '[name].bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
			  implementation: require('node-sass'),
			  sassOptions:{
				  includePaths: [
					path.join(__dirname, 'node_modules/govuk-elements-sass/public/sass'),
					path.join(__dirname, 'node_modules/govuk_frontend_toolkit/stylesheets'),
				  ]
			  }
            }
          }
        ],
      }
    ]
  }
}
