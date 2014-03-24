var baseConfig = require('./karma.conf');

module.exports = function(config) {
  baseConfig(config);

  config.set({
    autoWatch: false,
    singleRun: true,
    browsers: [
      'sl_chrome',
      'sl_firefox',
      'sl_opera',
      'sl_safari',
      'sl_ie_10',
      'sl_ie_11'
    ]
  })
}
