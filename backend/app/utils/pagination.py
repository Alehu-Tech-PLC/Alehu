"""
Pagination helper — wraps SQLAlchemy queries and returns
items plus metadata for consistent list endpoint responses.
"""
from flask import request


def paginate_query(query, page: int = None, per_page: int = None) -> dict:
    """
    Execute a paginated SQLAlchemy query.

    Args:
        query: A SQLAlchemy Query or Select object.
        page: Page number (1-indexed). Defaults to `page` query param or 1.
        per_page: Items per page. Defaults to `per_page` query param or 10.

    Returns:
        dict with keys: items, page, per_page, total, pages
    """
    if page is None:
        try:
            page = int(request.args.get('page', 1))
        except (ValueError, TypeError):
            page = 1

    if per_page is None:
        try:
            per_page = int(request.args.get('per_page', 10))
        except (ValueError, TypeError):
            per_page = 10

    # Clamp values to sane limits
    page = max(1, page)
    per_page = max(1, min(per_page, 100))

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    return {
        'items': pagination.items,
        'page': pagination.page,
        'per_page': pagination.per_page,
        'total': pagination.total,
        'pages': pagination.pages,
    }
