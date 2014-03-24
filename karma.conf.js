module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      'lib/assets/javascripts/bigscreen/**/*.coffee',
      'lib/assets/javascripts/bigscreen/templates/**/*.eco',
      'spec/lib/jquery-1.8.3.js',
      'spec/lib/jasmine-jquery-1.3.1.js',
      'spec/fixtures.coffee',
      'spec/bigscreen/**/*_spec.coffee',
      {
        pattern: 'spec/fixtures/**/*.html',
        include: false
      }
    ],
    preprocessors: {
      '**/*.coffee': ['coffee'],
      '**/*.eco': ['eco']
    },
    coffeePreprocessor: {
      options: {
        sourceMap: true
      }
    },
    ecoPreprocessor: {
      options: {
        baseTemplatePath: 'lib/assets/javascripts',
        enableJSTGlobalVariable: true
      }
    },
    reporters: ['dots'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    sauceLabs: {
      testName: 'bigscreen'
    },
    customLaunchers: {
      sl_chrome: {
        base: 'SauceLabs',
        browserName: 'chrome'
      },
      sl_firefox: {
        base: 'SauceLabs',
        browserName: 'firefox'
      },
      sl_opera: {
        base: 'SauceLabs',
        browserName: 'opera'
      },
      sl_safari: {
        base: 'SauceLabs',
        browserName: 'safari',
        platform: 'OS X 10.9',
        version: '7'
      },
      sl_ie_10: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 8',
        version: '10'
      },
      sl_ie_11: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 8.1',
        version: '11'
      },
    }
  });

  if (process.env.TRAVIS) {
    config.sauceLabs.build = 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')';
  }
};
