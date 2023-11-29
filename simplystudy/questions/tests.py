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
)
from simplystudy.users.models import User

SAMPLE_USERS = [
    User(username="first_user", password="password", email="1st@1st.pl"),
    User(username="second_user", password="password", email="2nd@2nd.pl"),
    User(username="admin", password="password", email="admin@admin.pl", is_superuser=True),
]

SAMPLE_COURSES = [
    Course(
        name="Course1",
        description="Desc1",
        university="University1",
        owner=SAMPLE_USERS[0],
    ),
    Course(
        name="Course2",
        description="Desc2",
        university="University2",
        owner=SAMPLE_USERS[1],
    ),
]

SAMPLE_QUESTION_SETS = [
    QuestionSet(
        name="QS1",
        description="Desc1",
        course=SAMPLE_COURSES[0],
        owner=SAMPLE_USERS[0],
    ),
    QuestionSet(
        name="QS2",
        description="Desc2",
        course=SAMPLE_COURSES[1],
        owner=SAMPLE_USERS[1],
    ),
]

SAMPLE_QUESTIONS = [
    Question(
        content="Question 1?",
        answer="Answer1.",
        question_set=SAMPLE_QUESTION_SETS[0],
    ),
    Question(
        content="Question 2?",
        answer="Answer2.",
        question_set=SAMPLE_QUESTION_SETS[1],
    ),
]

SAMPLE_TESTS = [
    Test(name=f"Test for {SAMPLE_QUESTION_SETS[0].name}", question_set=SAMPLE_QUESTION_SETS[0]),
]

SAMPLE_TEST_QUESTIONS = [
    TestQuestion(
        test=SAMPLE_TESTS[0],
        question_type="TEXT",
        question=f"Sample Text answer question for {SAMPLE_QUESTION_SETS[0].name}",
    ),
    TestQuestion(
        test=SAMPLE_TESTS[0],
        question_type="MULTIPLE",
        question=f"Sample Multiple choice question for {SAMPLE_QUESTION_SETS[0].name}",
    ),
    TestQuestion(
        test=SAMPLE_TESTS[0],
        question_type="SINGLE",
        question=f"Sample Single choice question for {SAMPLE_QUESTION_SETS[0].name}",
    ),
    TestQuestion(
        test=SAMPLE_TESTS[0],
        question_type="TF",
        question=f"Sample True or false question for {SAMPLE_QUESTION_SETS[0].name}",
        is_true=False,
    ),
]

SAMPLE_TEST_QUESTION_ANSWERS = [
    TestQuestionAnswer(question=SAMPLE_TEST_QUESTIONS[0], text="Answer1"),
    TestQuestionAnswer(question=SAMPLE_TEST_QUESTIONS[1], text="Choice 1", is_correct=True),
    TestQuestionAnswer(question=SAMPLE_TEST_QUESTIONS[1], text="Choice 2", is_correct=True),
    TestQuestionAnswer(question=SAMPLE_TEST_QUESTIONS[2], text="Choice 1", is_correct=False),
    TestQuestionAnswer(question=SAMPLE_TEST_QUESTIONS[2], text="Choice 2", is_correct=True),
]


def load_sample_data():
    for user in SAMPLE_USERS:
        user.set_password("password")
        user.save()
    for course in SAMPLE_COURSES:
        course.save()
    for question_set in SAMPLE_QUESTION_SETS:
        question_set.save()
    for question in SAMPLE_QUESTIONS:
        question.save()
    for test in SAMPLE_TESTS:
        test.save()
    for test_question in SAMPLE_TEST_QUESTIONS:
        test_question.save()
    for test_question_answer in SAMPLE_TEST_QUESTION_ANSWERS:
        test_question_answer.save()


class GetDataTests(APITestCase):
    """Testy sprawdzające poprawność danych zwracanych przez API oraz odpowiednich uprawnień."""

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

    def test_question_set_view_not_authorized(self) -> None:
        response = self.client.get("/api/question_sets/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_questions_view_list_user(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.get("/api/questions/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertListEqual(
            response.data,
            [
                {
                    "id": 1,
                    "content": "Question 1?",
                    "answer": "Answer1.",
                    "image": None,
                    "question_set": 1,
                },
            ],
        )

    def test_questions_view_list_superuser(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[2])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.get("/api/questions/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertListEqual(
            response.data,
            [
                {
                    "id": 1,
                    "content": "Question 1?",
                    "answer": "Answer1.",
                    "image": None,
                    "question_set": 1,
                },
                {
                    "id": 2,
                    "content": "Question 2?",
                    "answer": "Answer2.",
                    "image": None,
                    "question_set": 2,
                },
            ],
        )

    def test_questions_view_object(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.get("/api/questions/1/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertDictEqual(
            response.data,
            {
                "id": 1,
                "content": "Question 1?",
                "answer": "Answer1.",
                "image": None,
                "question_set": 1,
            },
        )

    def test_questions_view_object_no_permission(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[1])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.get("/api/questions/1/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_questions_view_object_superuser(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[2])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.get("/api/questions/1/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertDictEqual(
            response.data,
            {
                "id": 1,
                "content": "Question 1?",
                "answer": "Answer1.",
                "image": None,
                "question_set": 1,
            },
        )

    def test_question_set_view_first_user(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.get("/api/question_sets/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data,
            [
                {
                    "id": 1,
                    "name": "QS1",
                    "description": "Desc1",
                    "owner": "first_user",
                    "course": {
                        "id": 1,
                        "name": "Course1",
                        "university": "University1",
                        "description": "Desc1",
                        "owner": "first_user",
                    },
                    "questions": [
                        {
                            "id": 1,
                            "content": "Question 1?",
                            "answer": "Answer1.",
                            "image": None,
                            "question_set": 1,
                        }
                    ],
                    "is_private": True,
                }
            ],
        )
        self.client.logout()

    def test_question_set_view_second_user(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[1])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.get("/api/question_sets/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data,
            [
                {
                    "id": 2,
                    "name": "QS2",
                    "description": "Desc2",
                    "owner": "second_user",
                    "course": {
                        "id": 2,
                        "name": "Course2",
                        "university": "University2",
                        "description": "Desc2",
                        "owner": "second_user",
                    },
                    "questions": [
                        {
                            "id": 2,
                            "content": "Question 2?",
                            "answer": "Answer2.",
                            "image": None,
                            "question_set": 2,
                        }
                    ],
                    "is_private": True,
                }
            ],
        )
        self.client.logout()

    def test_question_set_view_public(self) -> None:
        question_set = QuestionSet.objects.get(id=2)
        question_set.is_private = False
        question_set.save()
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.get("/api/question_sets/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertListEqual(
            response.data,
            [
                {
                    "id": 1,
                    "name": "QS1",
                    "description": "Desc1",
                    "owner": "first_user",
                    "course": {
                        "id": 1,
                        "name": "Course1",
                        "university": "University1",
                        "description": "Desc1",
                        "owner": "first_user",
                    },
                    "questions": [
                        {
                            "id": 1,
                            "content": "Question 1?",
                            "answer": "Answer1.",
                            "image": None,
                            "question_set": 1,
                        }
                    ],
                    "is_private": True,
                },
                {
                    "id": 2,
                    "name": "QS2",
                    "description": "Desc2",
                    "owner": "second_user",
                    "course": {
                        "id": 2,
                        "name": "Course2",
                        "university": "University2",
                        "description": "Desc2",
                        "owner": "second_user",
                    },
                    "questions": [
                        {
                            "id": 2,
                            "content": "Question 2?",
                            "answer": "Answer2.",
                            "image": None,
                            "question_set": 2,
                        }
                    ],
                    "is_private": False,
                },
            ],
        )
        self.client.logout()

    def test_question_set_view_filter(self) -> None:
        question_set = QuestionSet.objects.get(id=2)
        question_set.is_private = False
        question_set.save()
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.get("/api/question_sets/?username=second_user")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertListEqual(
            response.data,
            [
                {
                    "id": 2,
                    "name": "QS2",
                    "description": "Desc2",
                    "owner": "second_user",
                    "course": {
                        "id": 2,
                        "name": "Course2",
                        "university": "University2",
                        "description": "Desc2",
                        "owner": "second_user",
                    },
                    "questions": [
                        {
                            "id": 2,
                            "content": "Question 2?",
                            "answer": "Answer2.",
                            "image": None,
                            "question_set": 2,
                        }
                    ],
                    "is_private": False,
                },
            ],
        )
        self.client.logout()

    def test_question_set_view_superuser(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[2])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.get("/api/question_sets/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertListEqual(
            response.data,
            [
                {
                    "id": 1,
                    "name": "QS1",
                    "description": "Desc1",
                    "owner": "first_user",
                    "course": {
                        "id": 1,
                        "name": "Course1",
                        "university": "University1",
                        "description": "Desc1",
                        "owner": "first_user",
                    },
                    "questions": [
                        {
                            "id": 1,
                            "content": "Question 1?",
                            "answer": "Answer1.",
                            "image": None,
                            "question_set": 1,
                        }
                    ],
                    "is_private": True,
                },
                {
                    "id": 2,
                    "name": "QS2",
                    "description": "Desc2",
                    "owner": "second_user",
                    "course": {
                        "id": 2,
                        "name": "Course2",
                        "university": "University2",
                        "description": "Desc2",
                        "owner": "second_user",
                    },
                    "questions": [
                        {
                            "id": 2,
                            "content": "Question 2?",
                            "answer": "Answer2.",
                            "image": None,
                            "question_set": 2,
                        }
                    ],
                    "is_private": True,
                },
            ],
        )
        self.client.logout()

    def test_question_set_view_details(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.get("/api/question_sets/1/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertDictEqual(
            response.data,
            {
                "id": 1,
                "name": "QS1",
                "description": "Desc1",
                "owner": "first_user",
                "course": {
                    "id": 1,
                    "name": "Course1",
                    "university": "University1",
                    "description": "Desc1",
                    "owner": "first_user",
                },
                "questions": [
                    {
                        "id": 1,
                        "content": "Question 1?",
                        "answer": "Answer1.",
                        "image": None,
                        "question_set": 1,
                    }
                ],
                "is_private": True,
            },
        )
        self.client.logout()

    def test_question_set_view_details_superuser(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[2])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.get("/api/question_sets/1/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertDictEqual(
            response.data,
            {
                "id": 1,
                "name": "QS1",
                "description": "Desc1",
                "owner": "first_user",
                "course": {
                    "id": 1,
                    "name": "Course1",
                    "university": "University1",
                    "description": "Desc1",
                    "owner": "first_user",
                },
                "questions": [
                    {
                        "id": 1,
                        "content": "Question 1?",
                        "answer": "Answer1.",
                        "image": None,
                        "question_set": 1,
                    }
                ],
                "is_private": True,
            },
        )
        self.client.logout()

    def test_question_set_view_details_no_permissions(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.get("/api/question_sets/2/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.client.logout()

    def test_public_question_sets_view_empty(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.get("/api/public_question_sets/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["results"])
        self.client.logout()

    def test_public_question_sets_view(self) -> None:
        question_set = QuestionSet.objects.get(id=2)
        question_set.is_private = False
        question_set.save()
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.get("/api/public_question_sets/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertListEqual(
            response.data["results"],
            [
                {
                    "id": 2,
                    "name": "QS2",
                    "description": "Desc2",
                    "owner": "second_user",
                    "course": {
                        "id": 2,
                        "name": "Course2",
                        "university": "University2",
                        "description": "Desc2",
                        "owner": "second_user",
                    },
                    "questions": [
                        {
                            "id": 2,
                            "content": "Question 2?",
                            "answer": "Answer2.",
                            "image": None,
                            "question_set": 2,
                        }
                    ],
                    "is_private": False,
                },
            ],
        )
        self.client.logout()

    def test_course_view_not_authorized(self) -> None:
        response = self.client.get("/api/courses/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_course_view_list(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.get("/api/courses/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertListEqual(
            response.data,
            [
                {
                    "id": 1,
                    "name": "Course1",
                    "university": "University1",
                    "description": "Desc1",
                    "owner": "first_user",
                },
            ],
        )
        self.client.logout()

    def test_course_view_object_permissions(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.get("/api/courses/1/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertDictEqual(
            response.data,
            {
                "id": 1,
                "name": "Course1",
                "university": "University1",
                "description": "Desc1",
                "owner": "first_user",
            },
        )
        self.client.logout()

    def test_course_view_object_permissions_superuser(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[2])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.get("/api/courses/1/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertDictEqual(
            response.data,
            {
                "id": 1,
                "name": "Course1",
                "university": "University1",
                "description": "Desc1",
                "owner": "first_user",
            },
        )
        self.client.logout()

    def test_course_view_object_permissions_not_permitted(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[0])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.get("/api/courses/2/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.client.logout()

    def test_course_view_filter(self) -> None:
        token = Token.objects.get(user=SAMPLE_USERS[1])
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)
        response = self.client.get("/api/courses/?username=second_user")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertListEqual(
            response.data,
            [
                {
                    "id": 2,
                    "name": "Course2",
                    "university": "University2",
                    "description": "Desc2",
                    "owner": "second_user",
                },
            ],
        )
        self.client.logout()
