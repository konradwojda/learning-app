from typing import Any

from rest_framework import permissions
from rest_framework.permissions import SAFE_METHODS
from rest_framework.request import Request
from rest_framework.views import APIView

from simplystudy.questions.models import QuestionSet, Test


class OwnerPermissions(permissions.BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        if request.method == "POST":
            if request.user.is_superuser:
                return True

            if request.data.get("owner") == request.user.username:
                return True

            return False

        return True

    def has_object_permission(self, request: Request, view: APIView, obj: Any) -> bool:
        if request.user.is_superuser:
            return True

        if obj.owner == request.user:
            return True

        return False


class QuestionSetPermissions(permissions.BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        if request.method == "POST":
            if request.user.is_superuser:
                return True

            if request.data.get("owner") == request.user.username:
                return True

            return False

        return True

    def has_object_permission(self, request: Request, view: APIView, obj: Any) -> bool:
        if request.method in SAFE_METHODS and obj.is_private is False:
            return True
        else:
            if request.user.is_superuser:
                return True

            if obj.owner == request.user:
                return True

        return False


class QuestionPermissions(permissions.BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        if request.user.is_superuser:
            return True
        if request.data.get("question_set"):
            question_set = QuestionSet.objects.get(id=int(request.data["question_set"]))
            return question_set.owner == request.user
        return True

    def has_object_permission(self, request: Request, view: APIView, obj: Any) -> bool:
        if obj.question_set.owner == request.user:
            return True
        if request.user.is_superuser:
            return True
        return False


class UserResourcePremissions(permissions.BasePermission):
    def has_object_permission(self, request: Request, view: APIView, obj: Any) -> bool:
        if request.user.is_superuser:
            return True
        if obj.user == request.user:
            return True
        return False

    def has_permission(self, request: Request, view: APIView) -> bool:
        if request.user.is_superuser:
            return True
        if request.method == "POST" and request.data.get("user") != request.user.username:
            return False
        return True


class TestPermissions(permissions.BasePermission):
    def has_object_permission(self, request: Request, view: Any, obj: Any) -> bool:
        if request.method in SAFE_METHODS and obj.question_set.is_private is False:
            return True
        else:
            if request.user.is_superuser:
                return True
            if obj.question_set.owner == request.user:
                return True
        return False

    def has_permission(self, request: Request, view: APIView) -> bool:
        if request.user.is_superuser:
            return True
        if request.method == "POST":
            question_set = QuestionSet.objects.get(id=int(request.data["question_set"]))
            if question_set.owner != request.user:
                return False
        return True


class TestQuestionPermissions(permissions.BasePermission):
    def has_object_permission(self, request: Request, view: APIView, obj: Any) -> bool:
        if request.method in SAFE_METHODS and obj.test.question_set.is_private is False:
            return True
        else:
            if request.user.is_superuser:
                return True
            if obj.test.question_set.owner == request.user:
                return True
        return False

    def has_permission(self, request: Request, view: APIView) -> bool:
        if request.user.is_superuser:
            return True
        if request.method == "POST":
            test = Test.objects.get(id=int(request.data["test"]))
            if test.question_set.owner != request.user:
                return False
        return True
