"""Public health and readiness endpoints."""
from flask import Blueprint
from app.utils.responses import success_response

health_bp = Blueprint('health', __name__)


@health_bp.route('/health', methods=['GET'])
def health():
    """Lightweight liveness check for the frontend and ops tooling."""
    return success_response(
        data={'status': 'ok', 'service': 'alehu-api'},
        message='Alehu API is healthy',
        status_code=200,
    )
