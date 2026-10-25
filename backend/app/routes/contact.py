"""Public partnership and parent inquiry endpoint."""
from flask import Blueprint, request
from marshmallow import Schema, ValidationError, fields, validate

from app.utils.responses import success_response, error_response

contact_bp = Blueprint('contact', __name__)


class ContactSchema(Schema):
    name = fields.String(required=True, validate=validate.Length(min=2, max=120))
    email = fields.Email(required=True)
    organization = fields.String(validate=validate.Length(max=160), load_default='')
    message = fields.String(required=True, validate=validate.Length(min=10, max=2000))


contact_schema = ContactSchema()


@contact_bp.route('/contact', methods=['POST'])
def contact():
    json_data = request.get_json() or {}
    try:
        data = contact_schema.load(json_data)
    except ValidationError as err:
        return error_response('Validation error', errors=err.messages, status_code=422)

    return success_response(
        data={'inquiry': {k: data[k] for k in ('name', 'email', 'organization')}},
        message='Thank you. The Alehu team will respond shortly.',
        status_code=201,
    )
