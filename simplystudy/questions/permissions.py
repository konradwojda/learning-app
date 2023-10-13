from typing import Any

from rest_framework import permissions
from rest_framework.request import Request
from rest_framework.views import APIView


class OwnerPermissions(permissions.BasePermission):
    def has_object_permission(self, request: Request, view: APIView, obj: Any) -> bool:
        if request.user.is_superuser:
            return True

        if obj.owner == request.user:
            return True

        return False
