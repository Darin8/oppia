var argv = require('yargs').argv;
var ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
var path = require('path');
var generatedJs = 'third_party/generated/js/third_party.js';
if (argv.prodEnv) {
  generatedJs = (
    'third_party/generated/js/third_party.min.js');
}

module.exports = function(config) {
  config.set({
    basePath: '../../',
    frameworks: ['jasmine'],
    files: [
      'local_compiled_js/core/tests/karma-globals.js',
      // Constants must be loaded before everything else.
      'local_compiled_js/assets/constants.js',
      'local_compiled_js/assets/rich_text_components_definitions.js',
      // Since jquery,jquery-ui,angular,angular-mocks and math-expressions
      // are not bundled, they will be treated separately.
      'third_party/static/jquery-3.4.1/jquery.min.js',
      'third_party/static/jqueryui-1.12.1/jquery-ui.min.js',
      'third_party/static/angularjs-1.5.8/angular.js',
      'third_party/static/angularjs-1.5.8/angular-mocks.js',
      'third_party/static/headroom-js-0.9.4/headroom.min.js',
      'third_party/static/headroom-js-0.9.4/angular.headroom.min.js',
      'third_party/static/math-expressions-1.7.0/math-expressions.js',
      'third_party/static/ckeditor-4.9.2/ckeditor.js',
      generatedJs,
      'local_compiled_js/core/templates/dev/head/AppInit.js',
      // Note that unexpected errors occur ("Cannot read property 'num' of
      // undefined" in MusicNotesInput.js) if the order of core/templates/...
      // and extensions/... are switched. The test framework may be flaky.
      'core/templates/dev/head/**/*_directive.html',
      'core/templates/dev/head/**/*.directive.html',
      'core/templates/dev/head/**/*.template.html',
      'local_compiled_js/extensions/**/*.js',
      'core/templates/dev/head/**/*Spec.ts',
      'core/templates/dev/head/*Spec.ts',
      'core/templates/dev/head/**/*.spec.ts',
      'core/templates/dev/head/*.spec.ts',
      'extensions/**/*Spec.ts',
      {
        pattern: 'extensions/**/*.png',
        watched: false,
        served: true,
        included: false
      },
      'extensions/interactions/**/*_directive.html',
      'extensions/interactions/rule_templates.json',
      'core/tests/data/*.json',
      {
        pattern: 'assets/i18n/**/*.json',
        watched: true,
        served: true,
        included: false
      }
    ],
    exclude: [
      'local_compiled_js/core/templates/dev/head/**/*-e2e.js',
      'local_compiled_js/extensions/**/protractor.js',
      'backend_prod_files/extensions/**',
      // TODO(vojtechjelinek): add these back after the templateCache
      // is repaired (#6960)
      'core/templates/dev/head/components/RatingDisplayDirectiveSpec.js',
      ('core/templates/dev/head/pages/exploration-editor-page/editor-tab/' +
       'services/solution-verification.service.spec.ts'),
      ('core/templates/dev/head/pages/exploration-editor-page/editor-tab/' +
       'state-name-editor/state-name-editor.directive.spec.ts'),
      ('core/templates/dev/head/components/state-editor/state-content-editor/' +
       'state-content-editor.directive.spec.ts'),
      ('core/templates/dev/head/components/state-editor/' +
       'state-interaction-editor/state-interaction-editor.directive.spec.ts'),
      ('extensions/interactions/MusicNotesInput/directives/' +
       'MusicNotesInputSpec.ts')
    ],
    proxies: {
      // Karma serves files under the /base directory.
      // We access files directly in our code, for example /folder/,
      // so we need to proxy the requests from /folder/ to /base/folder/.
      '/assets/': '/base/assets/',
      '/extensions/': '/base/extensions/'
    },
    preprocessors: {
      'core/templates/dev/head/*.ts': ['webpack'],
      'core/templates/dev/head/**/*.ts': ['webpack'],
      'extensions/**/*.ts': ['webpack'],
      'core/templates/dev/head/!(*Spec).js': ['coverage'],
      'core/templates/dev/head/**/!(*Spec).js': ['coverage'],
      'core/templates/dev/head/!(*.spec).js': ['coverage'],
      'core/templates/dev/head/**/!(*.spec).js': ['coverage'],
      'extensions/!(*Spec).js': ['coverage'],
      'extensions/**/!(*Spec).js': ['coverage'],
      // Note that these files should contain only directive templates, and no
      // Jinja expressions. They should also be specified within the 'files'
      // list above.
      'core/templates/dev/head/**/*_directive.html': ['ng-html2js'],
      'core/templates/dev/head/**/*.directive.html': ['ng-html2js'],
      'core/templates/dev/head/**/*.template.html': ['ng-html2js'],
      'extensions/interactions/**/*_directive.html': ['ng-html2js'],
      'extensions/interactions/rule_templates.json': ['json_fixtures'],
      'core/tests/data/*.json': ['json_fixtures']
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      reporters: [{
        type: 'html'
      }, {
        type: 'json'
      }],
      subdir: '.',
      dir: '../karma_coverage_reports/'
    },
    autoWatch: true,
    browsers: ['Chrome_Travis'],
    // Kill the browser if it does not capture in the given timeout [ms].
    captureTimeout: 60000,
    browserConsoleLogOptions: {
      level: 'log',
      format: '%b %T: %m',
      terminal: true
    },
    browserNoActivityTimeout: 60000,
    // Continue running in the background after running tests.
    singleRun: true,
    customLaunchers: {
      Chrome_Travis: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-ng-html2js-preprocessor',
      'karma-json-fixtures-preprocessor',
      'karma-coverage',
      'karma-webpack'
    ],
    ngHtml2JsPreprocessor: {
      moduleName: 'directiveTemplates',
      // ngHtml2JsPreprocessor adds the html inside $templateCache,
      // the key that we use for that cache needs to be exactly the same as
      // the templateUrl in directive JS. The stripPrefix and prependPrefix are
      // used for modifying the $templateCache keys.
      // If the key starts with core/ we need to get rid of that.
      stripPrefix: 'core/',
      // Every key must start with /.
      prependPrefix: '/',
    },
    jsonFixturesPreprocessor: {
      variableName: '__fixtures__'
    },

    webpack: {
      mode: 'development',
      resolve: {
        modules: [
          'core/templates/dev/head',
          'extensions'
        ],
      },
      module: {
        rules: [{
          test: /\.ts$/,
          use: [
            'cache-loader',
            'thread-loader',
            {
              loader: 'ts-loader',
              options: {
                // this is needed for thread-loader to work correctly
                happyPackMode: true
              }
            }
          ]
        },
        {
          test: /\.html$/,
          loader: 'underscore-template-loader'
        }]
      },
      plugins: [
        new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true })
      ]
    }
  });
};
