module.exports = {
    devServer: {
        sockHost: '112.5.125.80',
        disableHostCheck: true,
    },
  outputDir: './dist',
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/'
};
