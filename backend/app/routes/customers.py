"""Customer management routes — full CRUD with JWT protection."""
from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from marshmallow import ValidationError

from app.schemas.customer_schema import CustomerSchema, CustomerCreateSchema, CustomerUpdateSchema
from app.services.customer_service import CustomerService
from app.utils.responses import success_response, error_response

customers_bp = Blueprint('customers', __name__)

customer_schema = CustomerSchema()
customers_schema = CustomerSchema(many=True)
customer_create_schema = CustomerCreateSchema()
customer_update_schema = CustomerUpdateSchema()


@customers_bp.route('', methods=['GET'])
@jwt_required()
def get_customers():
    """List all customers (paginated)."""
    result = CustomerService.get_all()
    return success_response(
        data={
            'customers': customers_schema.dump(result['items']),
            'pagination': {
                'page': result['page'],
                'per_page': result['per_page'],
                'total': result['total'],
                'pages': result['pages'],
            },
        },
        message='Customers retrieved successfully',
        status_code=200,
    )


@customers_bp.route('', methods=['POST'])
@jwt_required()
def create_customer():
    """Create a new customer."""
    json_data = request.get_json() or {}
    try:
        data = customer_create_schema.load(json_data)
    except ValidationError as err:
        return error_response('Validation error', errors=err.messages, status_code=422)

    try:
        customer = CustomerService.create(data)
    except ValidationError as err:
        return error_response('Validation error', errors=err.messages, status_code=422)

    return success_response(
        data={'customer': customer_schema.dump(customer)},
        message='Customer created successfully',
        status_code=201,
    )


@customers_bp.route('/<int:customer_id>', methods=['GET'])
@jwt_required()
def get_customer(customer_id: int):
    """Get a customer by ID."""
    customer = CustomerService.get_by_id(customer_id)
    if not customer:
        return error_response('Customer not found', status_code=404)

    return success_response(
        data={'customer': customer_schema.dump(customer)},
        message='Customer retrieved successfully',
        status_code=200,
    )


@customers_bp.route('/<int:customer_id>', methods=['PUT', 'PATCH'])
@jwt_required()
def update_customer(customer_id: int):
    """Update a customer by ID."""
    json_data = request.get_json() or {}
    try:
        data = customer_update_schema.load(json_data)
    except ValidationError as err:
        return error_response('Validation error', errors=err.messages, status_code=422)

    try:
        customer = CustomerService.update(customer_id, data)
    except ValidationError as err:
        return error_response('Validation error', errors=err.messages, status_code=422)

    if not customer:
        return error_response('Customer not found', status_code=404)

    return success_response(
        data={'customer': customer_schema.dump(customer)},
        message='Customer updated successfully',
        status_code=200,
    )


@customers_bp.route('/<int:customer_id>', methods=['DELETE'])
@jwt_required()
def delete_customer(customer_id: int):
    """Delete a customer by ID."""
    deleted = CustomerService.delete(customer_id)
    if not deleted:
        return error_response('Customer not found', status_code=404)

    return success_response(
        data=None,
        message='Customer deleted successfully',
        status_code=200,
    )
