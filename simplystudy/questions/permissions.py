from typing import Any

from rest_framework import permissions
from rest_framework.permissions import SAFE_METHODS
from rest_framework.request import Request
from rest_framework.views import APIView

from simplystudy.questions.models import QuestionSet


class OwnerPermissions(permissions.BasePermission):
    def has_object_permission(self, request: Request, view: APIView, obj: Any) -> bool:
        if request.user.is_superuser:
            return True

        if obj.owner == request.user:
            return True

        return False


class QuestionSetPermissions(permissions.BasePermission):
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
