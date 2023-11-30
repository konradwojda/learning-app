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
