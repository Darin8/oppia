# Copyright 2018 The Oppia Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS-IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Tests for the story editor page."""

from core.domain import story_services
from core.domain import topic_services
from core.domain import user_services
from core.tests import test_utils
import feconf


class BaseStoryEditorControllerTests(test_utils.GenericTestBase):

    def setUp(self):
        """Completes the sign-up process for the various users."""
        super(BaseStoryEditorControllerTests, self).setUp()
        self.signup(self.ADMIN_EMAIL, self.ADMIN_USERNAME)
        self.signup(self.NEW_USER_EMAIL, self.NEW_USER_USERNAME)

        self.admin_id = self.get_user_id_from_email(self.ADMIN_EMAIL)
        self.new_user_id = self.get_user_id_from_email(self.NEW_USER_EMAIL)

        self.set_admins([self.ADMIN_USERNAME])

        self.admin = user_services.UserActionsInfo(self.admin_id)
        self.topic_id = topic_services.get_new_topic_id()
        self.story_id = story_services.get_new_story_id()
        self.save_new_story(
            self.story_id, self.admin_id, 'Title', 'Description', 'Notes',
            self.topic_id)
        self.save_new_topic(
            self.topic_id, self.admin_id, 'Name', 'Description',
            [self.story_id], [], [], [], 1)


class StoryEditorTests(BaseStoryEditorControllerTests):

    def test_can_not_access_story_editor_page_with_invalid_story_id(self):
        self.login(self.ADMIN_EMAIL)

        new_story_id = story_services.get_new_story_id()

        self.get_html_response(
            '%s/%s/%s' % (
                feconf.STORY_EDITOR_URL_PREFIX, self.topic_id,
                new_story_id), expected_status_int=404)

        # Raises error 404 even when story is saved as the new story id is not
        # associated with the topic.
        self.save_new_story(
            new_story_id, self.admin_id, 'Title', 'Description', 'Notes',
            self.topic_id)

        self.get_html_response(
            '%s/%s/%s' % (
                feconf.STORY_EDITOR_URL_PREFIX, self.topic_id,
                new_story_id), expected_status_int=404)

        self.logout()

    def test_can_not_get_access_story_handler_with_invalid_story_id(self):
        self.login(self.ADMIN_EMAIL)

        new_story_id = story_services.get_new_story_id()

        self.get_json(
            '%s/%s/%s' % (
                feconf.STORY_EDITOR_DATA_URL_PREFIX, self.topic_id,
                new_story_id), expected_status_int=404)

        # Raises error 404 even when story is saved as the new story id is not
        # associated with the topic.
        self.save_new_story(
            new_story_id, self.admin_id, 'Title', 'Description', 'Notes',
            self.topic_id)
        self.get_json(
            '%s/%s/%s' % (
                feconf.STORY_EDITOR_DATA_URL_PREFIX, self.topic_id,
                new_story_id), expected_status_int=404)

        self.logout()

    def test_put_can_not_access_story_handler_with_invalid_story_id(self):
        self.login(self.ADMIN_EMAIL)

        change_cmd = {
            'version': 1,
            'commit_message': 'changed description',
            'change_dicts': [{
                'cmd': 'update_story_property',
                'property_name': 'description',
                'old_value': 'Description',
                'new_value': 'New Description'
            }]
        }
        new_story_id = story_services.get_new_story_id()
        response = self.get_html_response(
            '%s/%s/%s' % (
                feconf.STORY_EDITOR_URL_PREFIX, self.topic_id,
                self.story_id))
        csrf_token = self.get_csrf_token_from_response(response)

        self.put_json(
            '%s/%s/%s' % (
                feconf.STORY_EDITOR_DATA_URL_PREFIX, self.topic_id,
                new_story_id), change_cmd,
            csrf_token=csrf_token, expected_status_int=404)

        # Raises error 404 even when story is saved as the new story id is not
        # associated with the topic.
        self.save_new_story(
            new_story_id, self.admin_id, 'Title', 'Description', 'Notes',
            self.topic_id)
        response = self.get_html_response(
            '%s/%s/%s' % (
                feconf.STORY_EDITOR_URL_PREFIX, self.topic_id,
                self.story_id))
        csrf_token = self.get_csrf_token_from_response(response)

        self.put_json(
            '%s/%s/%s' % (
                feconf.STORY_EDITOR_DATA_URL_PREFIX, self.topic_id,
                new_story_id),
            change_cmd, csrf_token=csrf_token, expected_status_int=404)

        self.logout()

    def test_put_can_not_access_story_handler_with_no_commit_message(self):
        self.login(self.ADMIN_EMAIL)

        change_cmd = {
            'version': 1,
            'change_dicts': [{
                'cmd': 'update_story_property',
                'property_name': 'description',
                'old_value': 'Description',
                'new_value': 'New Description'
            }]
        }

        response = self.get_html_response(
            '%s/%s/%s' % (
                feconf.STORY_EDITOR_URL_PREFIX, self.topic_id,
                self.story_id))
        csrf_token = self.get_csrf_token_from_response(response)

        json_response = self.put_json(
            '%s/%s/%s' % (
                feconf.STORY_EDITOR_DATA_URL_PREFIX, self.topic_id,
                self.story_id),
            change_cmd, csrf_token=csrf_token, expected_status_int=500)

        self.assertEqual(
            json_response['error'],
            'Expected a commit message but received none.')

        self.logout()

    def test_delete_can_not_access_story_handler_with_invalid_story_id(self):
        self.login(self.ADMIN_EMAIL)

        self.delete_json(
            '%s/%s/%s' % (
                feconf.STORY_EDITOR_DATA_URL_PREFIX, self.topic_id,
                story_services.get_new_story_id()), expected_status_int=404)
        self.logout()

    def test_cannot_access_story_editor_page_with_invalid_topic_id(self):
        self.login(self.ADMIN_EMAIL)
        self.get_html_response(
            '%s/%s/%s' % (
                feconf.STORY_EDITOR_URL_PREFIX, 'invalid_topic_id',
                self.story_id), expected_status_int=404)
        self.logout()

    def test_access_story_editor_page(self):
        """Test access to editor pages for the sample story."""
        # Check that non-admins cannot access the editor page.
        self.login(self.NEW_USER_EMAIL)
        self.get_html_response(
            '%s/%s/%s' % (
                feconf.STORY_EDITOR_URL_PREFIX, self.topic_id,
                self.story_id), expected_status_int=401)
        self.logout()

        # Check that admins can access and edit in the editor
        # page.
        self.login(self.ADMIN_EMAIL)
        self.get_html_response(
            '%s/%s/%s' % (
                feconf.STORY_EDITOR_URL_PREFIX, self.topic_id,
                self.story_id))
        self.logout()

    def test_editable_story_handler_get(self):
        # Check that non-admins cannot access the editable story data.
        self.login(self.NEW_USER_EMAIL)
        self.get_json(
            '%s/%s/%s' % (
                feconf.STORY_EDITOR_DATA_URL_PREFIX, self.topic_id,
                self.story_id), expected_status_int=401)
        self.logout()

        # Check that admins can access the editable story data.
        self.login(self.ADMIN_EMAIL)

        json_response = self.get_json(
            '%s/%s/%s' % (
                feconf.STORY_EDITOR_DATA_URL_PREFIX, self.topic_id,
                self.story_id))
        self.assertEqual(self.story_id, json_response['story']['id'])
        self.assertEqual('Name', json_response['topic_name'])
        self.logout()

    def test_editable_story_handler_put(self):
        # Check that admins can edit a story.
        change_cmd = {
            'version': 1,
            'commit_message': 'changed description',
            'change_dicts': [{
                'cmd': 'update_story_property',
                'property_name': 'description',
                'old_value': 'Description',
                'new_value': 'New Description'
            }]
        }
        self.login(self.ADMIN_EMAIL)
        response = self.get_html_response(
            '%s/%s/%s' % (
                feconf.STORY_EDITOR_URL_PREFIX, self.topic_id,
                self.story_id))
        csrf_token = self.get_csrf_token_from_response(response)

        json_response = self.put_json(
            '%s/%s/%s' % (
                feconf.STORY_EDITOR_DATA_URL_PREFIX, self.topic_id,
                self.story_id),
            change_cmd, csrf_token=csrf_token)
        self.assertEqual(self.story_id, json_response['story']['id'])
        self.assertEqual(
            'New Description', json_response['story']['description'])
        self.logout()

        # Check that non-admins cannot edit a story.
        self.put_json(
            '%s/%s/%s' % (
                feconf.STORY_EDITOR_DATA_URL_PREFIX, self.topic_id,
                self.story_id),
            change_cmd, csrf_token=csrf_token, expected_status_int=401)

    def test_can_not_delete_story_with_invalid_topic_id(self):
        self.login(self.ADMIN_EMAIL)
        self.delete_json(
            '%s/%s/%s' % (
                feconf.STORY_EDITOR_DATA_URL_PREFIX, 'invalid_topic_id',
                self.story_id), expected_status_int=404)
        self.logout()

    def test_guest_can_not_delete_story(self):
        response = self.delete_json(
            '%s/%s/%s' % (
                feconf.STORY_EDITOR_DATA_URL_PREFIX, self.topic_id,
                self.story_id), expected_status_int=401)
        self.assertEqual(
            response['error'],
            'You must be logged in to access this resource.')

    def test_editable_story_handler_delete(self):
        # Check that admins can delete a story.
        self.login(self.ADMIN_EMAIL)
        self.delete_json(
            '%s/%s/%s' % (
                feconf.STORY_EDITOR_DATA_URL_PREFIX, self.topic_id,
                self.story_id), expected_status_int=200)
        self.logout()

        # Check that non-admins cannot delete a story.
        self.login(self.NEW_USER_EMAIL)
        self.delete_json(
            '%s/%s/%s' % (
                feconf.STORY_EDITOR_DATA_URL_PREFIX, self.topic_id,
                self.story_id), expected_status_int=401)

        self.logout()

    def test_put_can_not_access_story_handler_with_no_payload_version(self):
        self.login(self.ADMIN_EMAIL)

        change_cmd = {
            'version': None,
            'commit_message': 'changed description',
            'change_dicts': [{
                'cmd': 'update_story_property',
                'property_name': 'description',
                'old_value': 'Description',
                'new_value': 'New Description'
            }]
        }

        response = self.get_html_response(
            '%s/%s/%s' % (
                feconf.STORY_EDITOR_URL_PREFIX, self.topic_id,
                self.story_id))
        csrf_token = self.get_csrf_token_from_response(response)

        json_response = self.put_json(
            '%s/%s/%s' % (
                feconf.STORY_EDITOR_DATA_URL_PREFIX, self.topic_id,
                self.story_id),
            change_cmd, csrf_token=csrf_token, expected_status_int=400)

        self.assertEqual(
            json_response['error'],
            'Invalid POST request: a version must be specified.')

        self.logout()

    def test_put_can_not_access_story_handler_with_mismatch_of_story_versions(
            self):
        self.login(self.ADMIN_EMAIL)

        change_cmd = {
            'version': 2,
            'commit_message': 'changed description',
            'change_dicts': [{
                'cmd': 'update_story_property',
                'property_name': 'description',
                'old_value': 'Description',
                'new_value': 'New Description'
            }]
        }

        response = self.get_html_response(
            '%s/%s/%s' % (
                feconf.STORY_EDITOR_URL_PREFIX, self.topic_id,
                self.story_id))
        csrf_token = self.get_csrf_token_from_response(response)

        json_response = self.put_json(
            '%s/%s/%s' % (
                feconf.STORY_EDITOR_DATA_URL_PREFIX, self.topic_id,
                self.story_id),
            change_cmd, csrf_token=csrf_token, expected_status_int=400)

        self.assertEqual(
            json_response['error'],
            'Trying to update version 1 of story from version 2, '
            'which is too old. Please reload the page and try again.')

        self.logout()

    def test_handler_raises_validation_error_with_invalid_new_description(self):
        change_cmd = {
            'version': 1,
            'commit_message': 'changed description',
            'change_dicts': [{
                'cmd': 'update_story_property',
                'property_name': 'description',
                'old_value': 'Description',
                'new_value': 0
            }]
        }
        self.login(self.ADMIN_EMAIL)
        response = self.get_html_response(
            '%s/%s/%s' % (
                feconf.STORY_EDITOR_URL_PREFIX, self.topic_id,
                self.story_id))
        csrf_token = self.get_csrf_token_from_response(response)

        json_response = self.put_json(
            '%s/%s/%s' % (
                feconf.STORY_EDITOR_DATA_URL_PREFIX, self.topic_id,
                self.story_id),
            change_cmd, csrf_token=csrf_token, expected_status_int=400)

        self.assertEqual(
            json_response['error'],
            'Expected description to be a string, received 0')
