module.exports = {
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    library: "SoulMagic",
    libraryTarget: "var"
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-flow'],
            plugins: [
              '@babel/plugin-syntax-dynamic-import',
              '@babel/plugin-syntax-import-meta',
              ['@babel/plugin-proposal-class-properties', {'loose': false}],
              '@babel/plugin-proposal-json-strings',
              '@babel/plugin-proposal-export-default-from'
            ],
          },
        }
      }
    ]
  },
  optimization: {
    minimize: false
  }
};
