// Copyright 2018 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Directive for the topic editor page.
 */

// TODO(vojtechjelinek): this block of requires should be removed after we
// introduce webpack for /extensions
require('components/ck-editor-helpers/ck-editor-rte.directive.ts');
require('components/ck-editor-helpers/ck-editor-widgets.initializer.ts');
require('filters/convert-unicode-with-params-to-html.filter.ts');
require('filters/convert-html-to-unicode.filter.ts');
require('filters/convert-unicode-to-html.filter.ts');
require('components/forms/validators/is-at-least.filter.ts');
require('components/forms/validators/is-at-most.filter.ts');
require('components/forms/validators/is-float.filter.ts');
require('components/forms/validators/is-integer.filter.ts');
require('components/forms/validators/is-nonempty.filter.ts');
require(
  'components/forms/custom-forms-directives/apply-validation.directive.ts');
require('components/forms/custom-forms-directives/html-select.directive.ts');
require(
  'components/forms/custom-forms-directives/require-is-float.directive.ts');
require('directives/AngularHtmlBindDirective.ts');
require('directives/MathjaxBindDirective.ts');
require(
  'components/forms/schema-based-editors/' +
  'schema-based-bool-editor.directive.ts');
require(
  'components/forms/schema-based-editors/' +
  'schema-based-choices-editor.directive.ts');
require(
  'components/forms/schema-based-editors/' +
  'schema-based-custom-editor.directive.ts');
require(
  'components/forms/schema-based-editors/' +
  'schema-based-dict-editor.directive.ts');
require(
  'components/forms/schema-based-editors/schema-based-editor.directive.ts');
require(
  'components/forms/schema-based-editors/' +
  'schema-based-expression-editor.directive.ts');
require(
  'components/forms/schema-based-editors/' +
  'schema-based-float-editor.directive.ts');
require(
  'components/forms/schema-based-editors/' +
  'schema-based-html-editor.directive.ts');
require(
  'components/forms/schema-based-editors/schema-based-int-editor.directive.ts');
require(
  'components/forms/schema-based-editors/' +
  'schema-based-list-editor.directive.ts');
require(
  'components/forms/schema-based-editors/' +
  'schema-based-unicode-editor.directive.ts');
require(
  'components/forms/schema-viewers/schema-based-custom-viewer.directive.ts');
require(
  'components/forms/schema-viewers/schema-based-dict-viewer.directive.ts');
require(
  'components/forms/schema-viewers/schema-based-html-viewer.directive.ts');
require(
  'components/forms/schema-viewers/schema-based-list-viewer.directive.ts');
require(
  'components/forms/schema-viewers/schema-based-primitive-viewer.directive.ts');
require(
  'components/forms/schema-viewers/schema-based-unicode-viewer.directive.ts');
require('components/forms/schema-viewers/schema-based-viewer.directive.ts');
require(
  'components/forms/custom-forms-directives/select2-dropdown.directive.ts');
require('components/forms/custom-forms-directives/image-uploader.directive.ts');
require(
  'components/state-directives/answer-group-editor/' +
  'answer-group-editor.directive.ts');
require('components/state-directives/hint-editor/hint-editor.directive.ts');
require(
  'components/state-directives/outcome-editor/outcome-editor.directive.ts');
require(
  'components/state-directives/outcome-editor/' +
  'outcome-destination-editor.directive.ts');
require(
  'components/state-directives/outcome-editor/' +
  'outcome-feedback-editor.directive.ts');
require(
  'components/state-directives/response-header/response-header.directive.ts');
require('components/state-directives/rule-editor/rule-editor.directive.ts');
require(
  'components/state-directives/rule-editor/rule-type-selector.directive.ts');
require(
  'components/state-directives/solution-editor/solution-editor.directive.ts');
require(
  'components/state-directives/solution-editor/' +
  'solution-explanation-editor.directive.ts');
require('filters/string-utility-filters/normalize-whitespace.filter.ts');
// ^^^ this block of requires should be removed ^^^

require('interactions/interactionsQuestionsRequires.ts');
require('objects/objectComponentsRequires.ts');

require('pages/topic-editor-page/editor-tab/topic-editor-tab.directive.ts');
require('pages/topic-editor-page/questions-tab/questions-tab.directive.ts');
require(
  'pages/topic-editor-page/subtopics-list-tab/subtopics-list-tab.directive.ts');

require('pages/topic-editor-page/services/topic-editor-routing.service.ts');
require('pages/topic-editor-page/services/topic-editor-state.service.ts');
require('services/PageTitleService.ts');
require('services/contextual/UrlService.ts');

require('pages/topic-editor-page/topic-editor-page.constants.ts');
require('pages/interaction-specs.constants.ts');

oppia.directive('topicEditorPage', ['UrlInterpolationService', function(
    UrlInterpolationService) {
  return {
    restrict: 'E',
    scope: {},
    bindToController: {},
    templateUrl: UrlInterpolationService.getDirectiveTemplateUrl(
      '/pages/topic-editor-page/topic-editor-page.directive.html'),
    controllerAs: '$ctrl',
    controller: [
      '$scope', 'PageTitleService', 'TopicEditorRoutingService',
      'TopicEditorStateService', 'UrlService',
      'EVENT_TOPIC_INITIALIZED', 'EVENT_TOPIC_REINITIALIZED',
      function($scope, PageTitleService, TopicEditorRoutingService,
          TopicEditorStateService, UrlService,
          EVENT_TOPIC_INITIALIZED, EVENT_TOPIC_REINITIALIZED) {
        var ctrl = this;
        ctrl.getActiveTabName = TopicEditorRoutingService.getActiveTabName;
        TopicEditorStateService.loadTopic(UrlService.getTopicIdFromUrl());

        var setPageTitle = function() {
          PageTitleService.setPageTitle(
            TopicEditorStateService.getTopic().getName() + ' - Oppia');
        };
        $scope.$on(EVENT_TOPIC_INITIALIZED, setPageTitle);
        $scope.$on(EVENT_TOPIC_REINITIALIZED, setPageTitle);
      }
    ]
  };
}]);
