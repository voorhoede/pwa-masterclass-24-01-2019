const ExtractTextPlugin = require("extract-text-webpack-plugin");

exports.extractCSS = ({include, exclude} = {}) => {
  // Output extracted CSS to a file
  const plugin = new ExtractTextPlugin({
    // `allChunks` is needed with CommonsChunkPlugin to extract
    // from extracted chunks as well.
    allChunks: true,
    filename: "[name]-[contenthash:7].css",
  });

  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: plugin.extract([
            {
              loader: 'css-loader',
              options: {importLoaders: 1},
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            },
          ]),
        },
      ],
    },
    plugins: [plugin],
  };
};

exports.loadJavaScript = ({include, exclude} = {}) => ({
  module: {
    rules: [
      {
        test: /\.js$/,
        include,
        exclude,
        use: "babel-loader",
      },
    ],
  },
});
