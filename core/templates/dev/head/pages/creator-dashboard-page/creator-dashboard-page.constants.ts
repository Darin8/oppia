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
 * @fileoverview Constants for the creator dashboard.
 */

oppia.constant(
  'EXPLORATION_DROPDOWN_STATS', {
    OPEN_FEEDBACK: 'open_feedback'
  }
);

oppia.constant(
  'EXPLORATIONS_SORT_BY_KEYS', {
    TITLE: 'title',
    RATING: 'ratings',
    NUM_VIEWS: 'num_views',
    OPEN_FEEDBACK: 'num_open_threads',
    LAST_UPDATED: 'last_updated_msec'
  }
);

oppia.constant(
  'HUMAN_READABLE_EXPLORATIONS_SORT_BY_KEYS', {
    TITLE: 'I18N_DASHBOARD_EXPLORATIONS_SORT_BY_TITLE',
    RATING: 'I18N_DASHBOARD_EXPLORATIONS_SORT_BY_AVERAGE_RATING',
    NUM_VIEWS: 'I18N_DASHBOARD_EXPLORATIONS_SORT_BY_TOTAL_PLAYS',
    OPEN_FEEDBACK: 'I18N_DASHBOARD_EXPLORATIONS_SORT_BY_OPEN_FEEDBACK',
    LAST_UPDATED: 'I18N_DASHBOARD_EXPLORATIONS_SORT_BY_LAST_UPDATED'
  }
);

oppia.constant(
  'SUBSCRIPTION_SORT_BY_KEYS', {
    USERNAME: 'subscriber_username',
    IMPACT: 'subscriber_impact'
  }
);

oppia.constant(
  'HUMAN_READABLE_SUBSCRIPTION_SORT_BY_KEYS', {
    USERNAME: 'Username',
    IMPACT: 'Impact'
  }
);
