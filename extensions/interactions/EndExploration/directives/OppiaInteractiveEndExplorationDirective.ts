// Copyright 2014 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Directive for the EndExploration 'interaction'.
 *
 * IMPORTANT NOTE: The naming convention for customization args that are passed
 * into the directive is: the name of the parameter, followed by 'With',
 * followed by the name of the arg.
 */

require('domain/utilities/UrlInterpolationService.ts');
require('services/ContextService.ts');
require('services/HtmlEscaperService.ts');
require('services/contextual/UrlService.ts');

oppia.directive('oppiaInteractiveEndExploration', [
  'UrlInterpolationService', function(UrlInterpolationService) {
    return {
      restrict: 'E',
      scope: {},
      bindToController: {},
      templateUrl: UrlInterpolationService.getExtensionResourceUrl(
        '/interactions/EndExploration/directives/' +
        'end_exploration_interaction_directive.html'),
      controllerAs: '$ctrl',
      controller: [
        '$http', '$attrs', '$q', 'UrlService',
        'ContextService', 'PAGE_CONTEXT', 'EXPLORATION_EDITOR_TAB_CONTEXT',
        'HtmlEscaperService', 'EXPLORATION_SUMMARY_DATA_URL_TEMPLATE',
        function(
            $http, $attrs, $q, UrlService,
            ContextService, PAGE_CONTEXT, EXPLORATION_EDITOR_TAB_CONTEXT,
            HtmlEscaperService, EXPLORATION_SUMMARY_DATA_URL_TEMPLATE) {
          var ctrl = this;
          var authorRecommendedExplorationIds = (
            HtmlEscaperService.escapedJsonToObj(
              $attrs.recommendedExplorationIdsWithValue));

          ctrl.isIframed = UrlService.isIframed();
          ctrl.isInEditorPage = (
            ContextService.getPageContext() === (
              PAGE_CONTEXT.EXPLORATION_EDITOR));
          ctrl.isInEditorPreviewMode = ctrl.isInEditorPage && (
            ContextService.getEditorTabContext() ===
              EXPLORATION_EDITOR_TAB_CONTEXT.PREVIEW);
          ctrl.isInEditorMainTab = ctrl.isInEditorPage && (
            ContextService.getEditorTabContext() ===
              EXPLORATION_EDITOR_TAB_CONTEXT.EDITOR);

          ctrl.collectionId = GLOBALS.collectionId;
          ctrl.getCollectionTitle = function() {
            return GLOBALS.collectionTitle;
          };

          ctrl.errorMessage = '';

          if (ctrl.isInEditorPage) {
            // Display a message if any author-recommended explorations are
            // invalid.
            var explorationId = ContextService.getExplorationId();
            $http.get(EXPLORATION_SUMMARY_DATA_URL_TEMPLATE, {
              params: {
                stringified_exp_ids: JSON.stringify(
                  authorRecommendedExplorationIds)
              }
            }).then(function(response) {
              var data = response.data;
              var foundExpIds = [];
              data.summaries.map(function(expSummary) {
                foundExpIds.push(expSummary.id);
              });

              var missingExpIds = [];
              authorRecommendedExplorationIds.forEach(function(expId) {
                if (foundExpIds.indexOf(expId) === -1) {
                  missingExpIds.push(expId);
                }
              });

              if (missingExpIds.length === 0) {
                ctrl.errorMessage = '';
              } else {
                var listOfIds = missingExpIds.join('", "');
                ctrl.errorMessage = (
                  'Warning: exploration(s) with the IDs "' + listOfIds +
                  '" will ' + 'not be shown as recommendations because they ' +
                  'either do not exist, or are not publicly viewable.');
              }
            });
          }
        }
      ]
    };
  }
]);
