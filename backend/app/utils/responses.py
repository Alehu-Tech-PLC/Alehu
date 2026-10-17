"""
Response helpers — all API responses go through these functions
to guarantee a consistent JSON envelope format.
"""
from flask import jsonify


def success_response(data=None, message: str = 'Success', status_code: int = 200):
    """
    Build a standardized success response.

    Returns:
        {"success": true, "data": <payload>, "message": "<string>"}
    """
    return jsonify({
        'success': True,
        'data': data,
        'message': message,
    }), status_code


def error_response(message: str = 'An error occurred', errors=None, status_code: int = 400):
    """
    Build a standardized error response.

    Returns:
        {"success": false, "message": "<error>", "errors": <details or null>}
    """
    return jsonify({
        'success': False,
        'message': message,
        'errors': errors,
    }), status_code
