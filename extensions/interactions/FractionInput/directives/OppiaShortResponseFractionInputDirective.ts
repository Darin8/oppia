// Copyright 2019 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Directive for the FractionInput short response.
 */

require('domain/objects/FractionObjectFactory.ts');
require('domain/utilities/UrlInterpolationService.ts');
require('services/HtmlEscaperService.ts');

oppia.directive('oppiaShortResponseFractionInput', [
  'FractionObjectFactory', 'HtmlEscaperService', 'UrlInterpolationService',
  function(
      FractionObjectFactory, HtmlEscaperService, UrlInterpolationService) {
    return {
      restrict: 'E',
      scope: {},
      bindToController: {},
      templateUrl: UrlInterpolationService.getExtensionResourceUrl(
        '/interactions/FractionInput/directives/' +
        'fraction_input_short_response_directive.html'),
      controllerAs: '$ctrl',
      controller: ['$attrs', function($attrs) {
        var ctrl = this;
        var answer = HtmlEscaperService.escapedJsonToObj($attrs.answer);
        ctrl.answer = FractionObjectFactory.fromDict(answer).toString();
      }]
    };
  }
]);
