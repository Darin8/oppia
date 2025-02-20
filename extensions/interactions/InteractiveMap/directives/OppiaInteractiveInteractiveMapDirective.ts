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
 * @fileoverview Directive for the InteractiveMap interaction.
 *
 * IMPORTANT NOTE: The naming convention for customization args that are passed
 * into the directive is: the name of the parameter, followed by 'With',
 * followed by the name of the arg.
 */

require('domain/utilities/BrowserCheckerService.ts');
require('domain/utilities/UrlInterpolationService.ts');
require('interactions/InteractiveMap/directives/InteractiveMapRulesService.ts');
require(
  'pages/exploration-player-page/services/current-interaction.service.ts');
require('services/HtmlEscaperService.ts');

oppia.directive('oppiaInteractiveInteractiveMap', [
  'HtmlEscaperService', 'InteractiveMapRulesService', 'UrlInterpolationService',
  'EVENT_NEW_CARD_AVAILABLE',
  function(
      HtmlEscaperService, InteractiveMapRulesService, UrlInterpolationService,
      EVENT_NEW_CARD_AVAILABLE) {
    return {
      restrict: 'E',
      scope: {},
      bindToController: {
        getLastAnswer: '&lastAnswer'
      },
      templateUrl: UrlInterpolationService.getExtensionResourceUrl(
        '/interactions/InteractiveMap/directives/' +
        'interactive_map_interaction_directive.html'),
      controllerAs: '$ctrl',
      controller: [
        '$attrs', '$scope', '$timeout', 'BrowserCheckerService',
        'CurrentInteractionService', function(
            $attrs, $scope, $timeout, BrowserCheckerService,
            CurrentInteractionService) {
          var ctrl = this;
          ctrl.coords = [
            HtmlEscaperService.escapedJsonToObj($attrs.latitudeWithValue),
            HtmlEscaperService.escapedJsonToObj($attrs.longitudeWithValue)];
          ctrl.zoom = (
            HtmlEscaperService.escapedJsonToObj($attrs.zoomWithValue));
          ctrl.interactionIsActive = (ctrl.getLastAnswer() === null);
          ctrl.mapMarkers = {};
          var coords = ctrl.coords || [0, 0];
          var zoomLevel = parseInt(ctrl.zoom, 10) || 0;

          ctrl.setOverlay = function() {
            ctrl.overlayStyle = {
              'background-color': 'white',
              opacity: 0.5,
              'z-index': 1001
            };
          };

          ctrl.hideOverlay = function() {
            ctrl.overlayStyle = {
              'background-color': 'white'
            };
          };

          var changeMarkerPosition = function(lat, lng) {
            ctrl.mapMarkers.mainMarker = {
              lat: lat,
              lng: lng,
              icon: {
                iconUrl: UrlInterpolationService.getExtensionResourceUrl(
                  '/interactions/InteractiveMap/static/marker-icon.png'),
                // The size of the icon image in pixels.
                iconSize: [25, 41],
                // The coordinates of the "tip" of the icon.
                iconAnchor: [12, 41],
                shadowUrl: UrlInterpolationService.getExtensionResourceUrl(
                  '/interactions/InteractiveMap/static/marker-shadow.png'),
                // The size of the shadow image in pixels.
                shadowSize: [41, 41],
                // The coordinates of the "tip" of the shadow.
                shadowAnchor: [13, 41],
                // The URL to a retina sized version of the icon image.
                // Used for Retina screen devices.
                iconRetinaUrl: UrlInterpolationService.getExtensionResourceUrl(
                  '/interactions/InteractiveMap/static/marker-icon-2x.png'),
                shadowRetinaUrl: (
                  UrlInterpolationService.getExtensionResourceUrl(
                    '/interactions/InteractiveMap/static/marker-shadow.png'))
              }
            };
          };

          $scope.$on(EVENT_NEW_CARD_AVAILABLE, function() {
            ctrl.interactionIsActive = false;
            ctrl.setOverlay();
          });

          $scope.$on('showInteraction', function() {
            refreshMap();
          });

          var refreshMap = function() {
            ctrl.mapOptions = {
              center: {
                lat: coords[0],
                lng: coords[1],
                zoom: zoomLevel
              },
              defaults: {
                // Disable dragging for mobile devices.
                dragging: !BrowserCheckerService.isMobileDevice()
              },
              events: {
                map: {
                  enable: ['click', 'mouseover', 'mouseout'],
                  logic: 'emit'
                }
              }
            };
            if (!ctrl.interactionIsActive) {
              changeMarkerPosition(
                ctrl.getLastAnswer()[0], ctrl.getLastAnswer()[1]);
            }
          };

          $scope.$on('leafletDirectiveMap.interactiveMap.mouseover',
            function() {
              if (!ctrl.interactionIsActive) {
                ctrl.setOverlay();
              }
            });

          $scope.$on('leafletDirectiveMap.interactiveMap.mouseout', function() {
            if (!ctrl.interactionIsActive) {
              ctrl.hideOverlay();
            }
          });
          $scope.$on('leafletDirectiveMap.interactiveMap.click',
            function(evt, args) {
              if (ctrl.interactionIsActive) {
                var newLat = args.leafletEvent.latlng.lat;
                var newLng = args.leafletEvent.latlng.lng;
                changeMarkerPosition(newLat, newLng);
                CurrentInteractionService.onSubmit(
                  [newLat, newLng], InteractiveMapRulesService);
              }
            });
          refreshMap();
        }
      ]
    };
  }
]);
