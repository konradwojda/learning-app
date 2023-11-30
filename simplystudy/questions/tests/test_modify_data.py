from django.core.exceptions import ValidationError
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from simplystudy.questions.models import (
    Course,
    Question,
    QuestionSet,
    Test,
    TestQuestion,
    TestQuestionAnswer,
    UserResource,
)
from simplystudy.questions.tests.fixtures import SAMPLE_USERS, load_sample_data
from simplystudy.users.models import User


class ModifyDataTests(APITestCase):
    """Testy sprawdzające API służące do zmiany danych oraz ich usuwania."""

    maxDiff = None

    @classmethod
    def setUpTestData(cls) -> None:
        load_sample_data()

    def test_data_loaded(self) -> None:
        self.assertTrue(User.objects.count(), 2)
        self.assertTrue(Course.objects.count(), 2)
        self.assertTrue(QuestionSet.objects.count(), 2)
        self.assertTrue(Question.objects.count(), 2)
        self.assertTrue(Test.objects.count(), 1)
        self.assertTrue(TestQuestion.objects.count(), 4)
        self.assertTrue(TestQuestionAnswer.objects.count(), 5)

    def test_add_question_normal(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.post(
            "/api/questions/",
            {"content": "content", "answer": "answer", "question_set": 1},
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        question_set = QuestionSet.objects.get(id=1)
        self.assertEqual(question_set.questions.count(), 2)
        self.client.logout()

    def test_add_question_no_permissions(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[1])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.post(
            "/api/questions/",
            {"content": "content", "answer": "answer", "question_set": 1},
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        question_set = QuestionSet.objects.get(id=1)
        self.assertEqual(question_set.questions.count(), 1)
        self.client.logout()

    def test_add_question_superuser(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[2])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.post(
            "/api/questions/",
            {"content": "content", "answer": "answer", "question_set": 1},
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        question_set = QuestionSet.objects.get(id=1)
        self.assertEqual(question_set.questions.count(), 2)
        self.client.logout()

    def test_edit_question_normal(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.patch(
            "/api/questions/1/",
            {"content": "content", "answer": "answer"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        question_set = QuestionSet.objects.get(id=1)
        self.assertEqual(question_set.questions.count(), 1)
        self.assertEqual(question_set.questions.first().content, "content")
        self.assertEqual(question_set.questions.first().answer, "answer")
        self.client.logout()

    def test_edit_question_no_permissions(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[1])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.patch(
            "/api/questions/1/",
            {"content": "content", "answer": "answer"},
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        question_set = QuestionSet.objects.get(id=1)
        self.assertEqual(question_set.questions.count(), 1)
        self.assertEqual(question_set.questions.first().content, "Question 1?")
        self.assertEqual(question_set.questions.first().answer, "Answer1.")
        self.client.logout()

    def test_edit_question_superuser(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[2])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.patch(
            "/api/questions/1/",
            {"content": "content", "answer": "answer"},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        question_set = QuestionSet.objects.get(id=1)
        self.assertEqual(question_set.questions.count(), 1)
        self.assertEqual(question_set.questions.first().content, "content")
        self.assertEqual(question_set.questions.first().answer, "answer")
        self.client.logout()

    def test_delete_question_normal(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.delete("/api/questions/1/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        question_set = QuestionSet.objects.get(id=1)
        self.assertEqual(question_set.questions.count(), 0)
        self.client.logout()

    def test_delete_question_no_permissions(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[1])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.delete("/api/questions/1/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        question_set = QuestionSet.objects.get(id=1)
        self.assertEqual(question_set.questions.count(), 1)
        self.assertEqual(question_set.questions.first().content, "Question 1?")
        self.assertEqual(question_set.questions.first().answer, "Answer1.")
        self.client.logout()

    def test_delete_question_superuser(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[2])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.delete("/api/questions/1/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        question_set = QuestionSet.objects.get(id=1)
        self.assertEqual(question_set.questions.count(), 0)
        self.client.logout()

    def test_add_question_set_normal(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.post(
            "/api/question_sets/",
            {
                "name": "name",
                "description": "description",
                "is_private": True,
                "course": 1,
                "owner": "first_user",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        question_set = QuestionSet.objects.get(id=3)
        self.assertEqual(question_set.name, "name")
        self.assertEqual(question_set.description, "description")
        self.assertEqual(question_set.is_private, True)
        self.assertEqual(question_set.course.id, 1)
        self.assertEqual(question_set.owner, SAMPLE_USERS[0])
        self.client.logout()

    def test_add_question_set_no_permissions(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[1])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.post(
            "/api/question_sets/",
            {
                "name": "name",
                "description": "description",
                "is_private": True,
                "course": 1,
                "owner": "first_user",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(QuestionSet.objects.count(), 2)
        self.client.logout()

    def test_add_question_set_superuser(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[2])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.post(
            "/api/question_sets/",
            {
                "name": "name",
                "description": "description",
                "is_private": True,
                "course": 1,
                "owner": "first_user",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        question_set = QuestionSet.objects.get(id=3)
        self.assertEqual(question_set.name, "name")
        self.assertEqual(question_set.description, "description")
        self.assertEqual(question_set.is_private, True)
        self.assertEqual(question_set.course.id, 1)
        self.assertEqual(question_set.owner, SAMPLE_USERS[0])
        self.client.logout()

    def test_edit_question_set_normal(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.patch(
            "/api/question_sets/1/",
            {
                "name": "name",
                "description": "description",
                "is_private": True,
                "course": 1,
                "owner": "first_user",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        question_set = QuestionSet.objects.get(id=1)
        self.assertEqual(question_set.name, "name")
        self.assertEqual(question_set.description, "description")
        self.assertEqual(question_set.is_private, True)
        self.assertEqual(question_set.course.id, 1)
        self.assertEqual(question_set.owner, SAMPLE_USERS[0])
        self.client.logout()

    def test_edit_question_set_no_permissions(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[1])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.patch(
            "/api/question_sets/1/",
            {
                "name": "name",
                "description": "description",
                "is_private": True,
                "course": 1,
                "owner": "first_user",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        question_set = QuestionSet.objects.get(id=1)
        self.assertEqual(question_set.name, "QS1")
        self.assertEqual(question_set.description, "Desc1")
        self.assertEqual(question_set.is_private, True)
        self.assertEqual(question_set.course.id, 1)
        self.assertEqual(question_set.owner, SAMPLE_USERS[0])
        self.client.logout()

    def test_edit_question_set_superuser(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[2])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.patch(
            "/api/question_sets/1/",
            {
                "name": "name",
                "description": "description",
                "is_private": True,
                "course": 1,
                "owner": "first_user",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        question_set = QuestionSet.objects.get(id=1)
        self.assertEqual(question_set.name, "name")
        self.assertEqual(question_set.description, "description")
        self.assertEqual(question_set.is_private, True)
        self.assertEqual(question_set.course.id, 1)
        self.assertEqual(question_set.owner, SAMPLE_USERS[0])
        self.client.logout()

    def test_delete_question_set_normal(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.delete("/api/question_sets/1/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(QuestionSet.objects.count(), 1)
        self.client.logout()

    def test_delete_question_set_no_permissions(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[1])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.delete("/api/question_sets/1/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(QuestionSet.objects.count(), 2)
        self.client.logout()

    def test_delete_question_set_superuser(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[2])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.delete("/api/question_sets/1/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(QuestionSet.objects.count(), 1)
        self.client.logout()

    def test_add_course_normal(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.post(
            "/api/courses/",
            {
                "name": "name",
                "description": "description",
                "university": "university",
                "owner": "first_user",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        course = Course.objects.get(id=3)
        self.assertEqual(course.name, "name")
        self.assertEqual(course.description, "description")
        self.assertEqual(course.university, "university")
        self.assertEqual(course.owner, SAMPLE_USERS[0])
        self.client.logout()

    def test_add_course_no_permissions(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[1])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.post(
            "/api/courses/",
            {
                "name": "name",
                "description": "description",
                "university": "university",
                "owner": "first_user",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Course.objects.count(), 2)
        self.client.logout()

    def test_add_course_superuser(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[2])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.post(
            "/api/courses/",
            {
                "name": "name",
                "description": "description",
                "university": "university",
                "owner": "first_user",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        course = Course.objects.get(id=3)
        self.assertEqual(course.name, "name")
        self.assertEqual(course.description, "description")
        self.assertEqual(course.university, "university")
        self.assertEqual(course.owner, SAMPLE_USERS[0])
        self.client.logout()

    def test_edit_course_normal(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.patch(
            "/api/courses/1/",
            {
                "name": "name",
                "description": "description",
                "university": "university",
                "owner": "first_user",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        course = Course.objects.get(id=1)
        self.assertEqual(course.name, "name")
        self.assertEqual(course.description, "description")
        self.assertEqual(course.university, "university")
        self.assertEqual(course.owner, SAMPLE_USERS[0])
        self.client.logout()

    def test_edit_course_invalid_user(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.patch(
            "/api/courses/1/",
            {
                "name": "name",
                "description": "description",
                "university": "university",
                "owner": "invalid_user",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.client.logout()

    def test_edit_course_no_permissions(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[1])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.patch(
            "/api/courses/1/",
            {
                "name": "name",
                "description": "description",
                "university": "university",
                "owner": "first_user",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        course = Course.objects.get(id=1)
        self.assertEqual(course.name, "Course1")
        self.assertEqual(course.description, "Desc1")
        self.assertEqual(course.university, "University1")
        self.assertEqual(course.owner, SAMPLE_USERS[0])
        self.client.logout()

    def test_edit_course_superuser(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[2])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.patch(
            "/api/courses/1/",
            {
                "name": "name",
                "description": "description",
                "university": "university",
                "owner": "first_user",
            },
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        course = Course.objects.get(id=1)
        self.assertEqual(course.name, "name")
        self.assertEqual(course.description, "description")
        self.assertEqual(course.university, "university")
        self.assertEqual(course.owner, SAMPLE_USERS[0])
        self.client.logout()

    def test_delete_course_normal(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.delete("/api/courses/1/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Course.objects.count(), 1)
        self.client.logout()

    def test_delete_course_no_permissions(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[1])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.delete("/api/courses/1/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Course.objects.count(), 2)
        self.client.logout()

    def test_delete_course_superuser(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[2])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.delete("/api/courses/1/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Course.objects.count(), 1)
        self.client.logout()

    def test_add_user_resource_normal(self) -> None:
        question_set = QuestionSet.objects.get(id=1)
        question_set.is_private = False
        question_set.save()
        token = Token.objects.get(user=SAMPLE_USERS[1])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.post(
            "/api/user_resources/",
            {
                "user": "second_user",
                "question_set": 1,
            },
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(UserResource.objects.count(), 1)
        self.client.logout()

    def test_add_user_resource_no_permissions(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[1])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.post(
            "/api/user_resources/",
            {
                "user": "first_user",
                "question_set": 1,
            },
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(UserResource.objects.count(), 0)
        self.client.logout()

    def test_adduser_resource_superuser(self) -> None:
        question_set = QuestionSet.objects.get(id=1)
        question_set.is_private = False
        question_set.save()
        token = Token.objects.get(user=SAMPLE_USERS[2])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.post(
            "/api/user_resources/",
            {
                "user": "second_user",
                "question_set": 1,
            },
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(UserResource.objects.count(), 1)
        self.client.logout()

    def test_add_user_resource_own_question_set(self) -> None:
        question_set = QuestionSet.objects.get(id=1)
        question_set.is_private = False
        question_set.save()
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        with self.assertRaises(ValidationError):
            self.client.post(
                "/api/user_resources/",
                {
                    "user": "first_user",
                    "question_set": 1,
                },
            )
        self.assertEqual(UserResource.objects.count(), 0)
        self.client.logout()

    def test_add_user_resource_private_set(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[1])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        with self.assertRaises(ValidationError):
            self.client.post(
                "/api/user_resources/",
                {
                    "user": "second_user",
                    "question_set": 1,
                },
            )
        self.assertEqual(UserResource.objects.count(), 0)
        self.client.logout()

    def test_delete_user_resource_normal(self) -> None:
        question_set = QuestionSet.objects.get(id=1)
        question_set.is_private = False
        question_set.save()
        token = Token.objects.get(user=SAMPLE_USERS[1])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.post(
            "/api/user_resources/",
            {
                "user": "second_user",
                "question_set": 1,
            },
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(UserResource.objects.count(), 1)
        response = self.client.delete("/api/user_resources/1/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(UserResource.objects.count(), 0)
        self.client.logout()

    def test_delete_user_resource_no_permissions(self) -> None:
        question_set = QuestionSet.objects.get(id=1)
        question_set.is_private = False
        question_set.save()
        token = Token.objects.get(user=SAMPLE_USERS[1])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.post(
            "/api/user_resources/",
            {
                "user": "second_user",
                "question_set": 1,
            },
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(UserResource.objects.count(), 1)
        self.client.logout()
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.delete("/api/user_resources/1/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(UserResource.objects.count(), 1)
        self.client.logout()

    def test_delete_user_resource_superuser(self) -> None:
        question_set = QuestionSet.objects.get(id=1)
        question_set.is_private = False
        question_set.save()
        token = Token.objects.get(user=SAMPLE_USERS[1])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.post(
            "/api/user_resources/",
            {
                "user": "second_user",
                "question_set": 1,
            },
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(UserResource.objects.count(), 1)
        self.client.logout()
        token = Token.objects.get(user=SAMPLE_USERS[2])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.delete("/api/user_resources/1/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(UserResource.objects.count(), 0)
        self.client.logout()

    def test_add_test_normal(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.post(
            "/api/tests/",
            {
                "name": "name",
                "question_set": 1,
            },
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Test.objects.count(), 2)
        self.client.logout()

    def test_add_test_no_permissions(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[1])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.post(
            "/api/tests/",
            {
                "name": "name",
                "question_set": 1,
            },
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Test.objects.count(), 1)
        self.client.logout()

    def test_add_test_superuser(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[2])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.post(
            "/api/tests/",
            {
                "name": "name",
                "question_set": 1,
            },
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Test.objects.count(), 2)
        self.client.logout()

    def test_edit_test_normal(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.patch(
            "/api/tests/1/",
            {
                "name": "name",
                "question_set": 1,
            },
        )
        test = Test.objects.get(id=1)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(test.name, "name")
        self.assertEqual(test.question_set.id, 1)
        self.assertEqual(Test.objects.count(), 1)
        self.client.logout()

    def test_edit_test_no_permissions(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[1])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.patch(
            "/api/tests/1/",
            {
                "name": "name",
                "question_set": 1,
            },
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        test = Test.objects.get(id=1)
        self.assertEqual(test.name, "Test for QS1")
        self.assertEqual(test.question_set.id, 1)
        self.assertEqual(Test.objects.count(), 1)
        self.client.logout()

    def test_edit_test_superuser(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[2])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.patch(
            "/api/tests/1/",
            {
                "name": "name",
                "question_set": 1,
            },
        )
        test = Test.objects.get(id=1)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(test.name, "name")
        self.assertEqual(test.question_set.id, 1)
        self.assertEqual(Test.objects.count(), 1)
        self.client.logout()

    def test_delete_test_normal(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.delete("/api/tests/1/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Test.objects.count(), 0)
        self.client.logout()

    def test_delete_test_no_permissions(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[1])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.delete("/api/tests/1/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Test.objects.count(), 1)
        self.client.logout()

    def test_delete_test_superuser(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[2])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.delete("/api/tests/1/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Test.objects.count(), 0)
        self.client.logout()

    def test_test_details_method_not_allowed(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.put("/api/test_details/1/")
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.client.logout()

    def test_add_test_question_text(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.post(
            "/api/test_questions/",
            {
                "test": 1,
                "question": "Question?",
                "question_type": "TEXT",
                "question_choices": [{"text": "answer", "is_correct": True}],
            },
            format="json",
        )
        question = TestQuestion.objects.get(id=response.data["id"])
        self.assertEqual(question.test.id, 1)
        self.assertEqual(question.question_type, "TEXT")
        self.assertEqual(question.question, "Question?")
        self.assertEqual(question.is_true, None)
        self.assertEqual(question.question_choices.count(), 1)
        self.assertEqual(question.question_choices.first().text, "answer")

    def test_add_test_question_tf(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.post(
            "/api/test_questions/",
            {
                "test": 1,
                "question_type": "TF",
                "question": "Question?",
                "is_true": False,
                "question_choices": [],
            },
            format="json",
        )
        question = TestQuestion.objects.get(id=response.data["id"])
        self.assertEqual(question.test.id, 1)
        self.assertEqual(question.question_type, "TF")
        self.assertEqual(question.question, "Question?")
        self.assertEqual(question.is_true, False)
        self.assertEqual(question.question_choices.count(), 0)

    def test_add_test_question_single(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.post(
            "/api/test_questions/",
            {
                "test": 1,
                "question_type": "SINGLE",
                "question": "Question?",
                "question_choices": [
                    {"text": "answer1", "is_correct": True},
                    {"text": "answer2", "is_correct": False},
                ],
            },
            format="json",
        )
        question = TestQuestion.objects.get(id=response.data["id"])
        self.assertEqual(question.test.id, 1)
        self.assertEqual(question.question_type, "SINGLE")
        self.assertEqual(question.question, "Question?")
        self.assertEqual(question.is_true, None)
        self.assertEqual(question.question_choices.count(), 2)
        self.assertEqual(question.question_choices.first().text, "answer1")
        self.assertEqual(question.question_choices.first().is_correct, True)
        self.assertEqual(question.question_choices.last().text, "answer2")
        self.assertEqual(question.question_choices.last().is_correct, False)

    def test_add_test_question_multiple(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.post(
            "/api/test_questions/",
            {
                "test": 1,
                "question_type": "MULTIPLE",
                "question": "Question?",
                "question_choices": [
                    {"text": "answer1", "is_correct": True},
                    {"text": "answer2", "is_correct": True},
                ],
            },
            format="json",
        )
        question = TestQuestion.objects.get(id=response.data["id"])
        self.assertEqual(question.test.id, 1)
        self.assertEqual(question.question_type, "MULTIPLE")
        self.assertEqual(question.question, "Question?")
        self.assertEqual(question.is_true, None)
        self.assertEqual(question.question_choices.count(), 2)
        self.assertEqual(question.question_choices.first().text, "answer1")
        self.assertEqual(question.question_choices.first().is_correct, True)
        self.assertEqual(question.question_choices.last().text, "answer2")
        self.assertEqual(question.question_choices.last().is_correct, True)

    def test_add_test_question_single_no_correct_answer(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.post(
            "/api/test_questions/",
            {
                "test": 1,
                "question_type": "SINGLE",
                "question": "Question?",
                "question_choices": [
                    {"text": "answer1", "is_correct": False},
                    {"text": "answer2", "is_correct": False},
                ],
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data.serializer.is_valid())
        self.assertEqual(TestQuestion.objects.count(), 4)

    def test_add_test_question_multiple_no_correct_answer(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.post(
            "/api/test_questions/",
            {
                "test": 1,
                "question_type": "MULTIPLE",
                "question": "Question?",
                "question_choices": [
                    {"text": "answer1", "is_correct": False},
                    {"text": "answer2", "is_correct": False},
                ],
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data.serializer.is_valid())
        self.assertEqual(TestQuestion.objects.count(), 4)

    def test_add_test_question_single_multiple_correct_answers(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.post(
            "/api/test_questions/",
            {
                "test": 1,
                "question_type": "SINGLE",
                "question": "Question?",
                "question_choices": [
                    {"text": "answer1", "is_correct": True},
                    {"text": "answer2", "is_correct": True},
                ],
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data.serializer.is_valid())
        self.assertEqual(TestQuestion.objects.count(), 4)

    def test_add_test_question_no_permissions(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[1])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.post(
            "/api/test_questions/",
            {
                "test": 1,
                "question": "Question?",
                "question_type": "TEXT",
                "question_choices": [{"text": "answer", "is_correct": True}],
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(TestQuestion.objects.count(), 4)
        self.client.logout()

    def test_add_test_question_superuser(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[2])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.post(
            "/api/test_questions/",
            {
                "test": 1,
                "question": "Question?",
                "question_type": "TEXT",
                "question_choices": [{"text": "answer", "is_correct": True}],
            },
            format="json",
        )
        question = TestQuestion.objects.get(id=response.data["id"])
        self.assertEqual(question.test.id, 1)
        self.assertEqual(question.question_type, "TEXT")
        self.assertEqual(question.question, "Question?")
        self.assertEqual(question.is_true, None)
        self.assertEqual(question.question_choices.count(), 1)
        self.assertEqual(question.question_choices.first().text, "answer")

    def test_edit_test_question(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.patch(
            "/api/test_questions/1/",
            {
                "test": 1,
                "question": "Question?",
                "question_type": "TEXT",
                "question_choices": [{"id": 1, "text": "answer2", "is_correct": True}],
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        question = TestQuestion.objects.get(id=1)
        self.assertEqual(question.test.id, 1)
        self.assertEqual(question.question_type, "TEXT")
        self.assertEqual(question.question, "Question?")
        self.assertEqual(question.is_true, None)
        self.assertEqual(question.question_choices.count(), 1)
        self.assertEqual(question.question_choices.first().text, "answer2")

    def test_edit_test_question_no_permissions(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[1])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.patch(
            "/api/test_questions/1/",
            {
                "test": 1,
                "question": "Question?",
                "question_type": "TEXT",
                "question_choices": [{"id": 1, "text": "answer2", "is_correct": True}],
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.client.logout()

    def test_edit_test_question_superuser(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[2])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.patch(
            "/api/test_questions/1/",
            {
                "test": 1,
                "question": "Question?",
                "question_type": "TEXT",
                "question_choices": [{"id": 1, "text": "answer2", "is_correct": True}],
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        question = TestQuestion.objects.get(id=1)
        self.assertEqual(question.test.id, 1)
        self.assertEqual(question.question_type, "TEXT")
        self.assertEqual(question.question, "Question?")
        self.assertEqual(question.is_true, None)
        self.assertEqual(question.question_choices.count(), 1)
        self.assertEqual(question.question_choices.first().text, "answer2")

    def test_edit_test_question_single(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.patch(
            "/api/test_questions/3/",
            {
                "test": 1,
                "question": "Question?",
                "question_type": "SINGLE",
                "question_choices": [{"id": None, "text": "answer2", "is_correct": True}],
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        question = TestQuestion.objects.get(id=3)
        self.assertEqual(question.test.id, 1)
        self.assertEqual(question.question_type, "SINGLE")
        self.assertEqual(question.question, "Question?")
        self.assertEqual(question.is_true, None)
        self.assertEqual(question.question_choices.count(), 1)
        self.assertEqual(question.question_choices.first().text, "answer2")

    def test_edit_test_question_multiple(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.patch(
            "/api/test_questions/2/",
            {
                "test": 1,
                "question": "Question?",
                "question_type": "MULTIPLE",
                "question_choices": [
                    {"id": None, "text": "answer2", "is_correct": True},
                    {"id": 4, "text": "4", "is_correct": True},
                ],
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        question = TestQuestion.objects.get(id=2)
        self.assertEqual(question.test.id, 1)
        self.assertEqual(question.question_type, "MULTIPLE")
        self.assertEqual(question.question, "Question?")
        self.assertEqual(question.is_true, None)
        self.assertEqual(question.question_choices.count(), 2)
        self.assertEqual(question.question_choices.last().text, "answer2")
        self.assertEqual(question.question_choices.first().text, "4")

    def test_edit_test_question_single_no_correct_answer(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.patch(
            "/api/test_questions/3/",
            {
                "test": 1,
                "question": "Question?",
                "question_type": "SINGLE",
                "question_choices": [{"id": None, "text": "answer2", "is_correct": False}],
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data.serializer.is_valid())
        self.assertEqual(TestQuestion.objects.count(), 4)

    def test_edit_test_question_multiple_no_correct_answer(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.patch(
            "/api/test_questions/2/",
            {
                "test": 1,
                "question": "Question?",
                "question_type": "MULTIPLE",
                "question_choices": [{"id": None, "text": "answer2", "is_correct": False}],
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data.serializer.is_valid())
        self.assertEqual(TestQuestion.objects.count(), 4)

    def test_delete_test_question_normal(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        self.assertEqual(TestQuestion.objects.count(), 4)
        response = self.client.delete("/api/test_questions/1/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(TestQuestion.objects.count(), 3)
        self.client.logout()

    def test_delete_test_question_no_permissions(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[1])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        self.assertEqual(TestQuestion.objects.count(), 4)
        response = self.client.delete("/api/test_questions/1/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(TestQuestion.objects.count(), 4)
        self.client.logout()

    def test_delete_test_question_superuser(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[2])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        self.assertEqual(TestQuestion.objects.count(), 4)
        response = self.client.delete("/api/test_questions/1/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(TestQuestion.objects.count(), 3)
        self.client.logout()
