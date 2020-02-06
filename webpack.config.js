const path = require("path");
const merge = require("webpack-merge");
const ManifestPlugin = require('webpack-manifest-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');

const parts = require("./webpack.parts");

const PATHS = {
  app: path.join(__dirname, "src"),
  build: path.join(__dirname, "cache"),
};

const commonConfig = merge([
  {
    mode: 'production',
    entry: {
      app: PATHS.app,
    },
    output: {
      path: PATHS.build,
      filename: "[name]-[chunkhash:7].js",
    },
    plugins: [
      new CopyWebpackPlugin([{
        from: path.join(PATHS.app, 'assets'),
        to: path.join(PATHS.build, 'assets')
      }
      ]),
      new ManifestPlugin({
        fileName: 'rev-manifest.json'
      }),
      new ServiceWorkerWebpackPlugin({
        entry: path.join(__dirname, 'src/service-worker.js'),
        filename: 'service-worker.js',
        includes: ['*.css', '*.js']
      }),
    ],
  },
]);

const productionConfig = merge([
  parts.extractCSS(),
]);

module.exports = env => {
  if (env === "production") {
    return merge(commonConfig, productionConfig);
  }
};
