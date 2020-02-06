const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');

exports.extractCSS = ({include, exclude} = {}) => {
  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            ExtractCssChunks.loader,
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
          ],
        },
      ],
    },
    plugins: [
      new ExtractCssChunks({
        filename: '[name].[hash:7].css',
        chunkFilename: '[id].[hash:7].css',
      }),
    ],
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
