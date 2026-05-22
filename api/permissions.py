"""
permissions.py — Portfolio API
================================
Custom DRF permission classes.
"""

from rest_framework.permissions import BasePermission


class IsAdminOrReadOnly(BasePermission):
    """
    Allow read access to everyone (GET, HEAD, OPTIONS).
    Allow write access only to admin/staff users.
    """
    SAFE_METHODS = ('GET', 'HEAD', 'OPTIONS')

    def has_permission(self, request, view):
        if request.method in self.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff


class IsSafeMethodOrAdmin(BasePermission):
    """
    Allow GET requests to everyone.
    Block all other methods unless user is admin.
    """
    def has_permission(self, request, view):
        if request.method == 'GET':
            return True
        return request.user and request.user.is_staff