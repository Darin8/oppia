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
 * @fileoverview Directive for the Base Transclusion Component.
 */

require('pages/OppiaFooterDirective.ts');

require('domain/utilities/UrlInterpolationService.ts');

oppia.directive('baseContent', [
  'UrlInterpolationService',
  function(UrlInterpolationService) {
    return {
      restrict: 'E',
      scope: {},
      bindToController: {},
      transclude: {
        breadcrumb: '?navbarBreadcrumb',
        content: 'content',
        footer: '?pageFooter',
        navOptions: '?navOptions',
      },
      templateUrl: UrlInterpolationService.getDirectiveTemplateUrl(
        '/base_components/base_content_directive.html'),
      controllerAs: '$ctrl',
      controller: [
        function() {}
      ]
    };
  }
]);
