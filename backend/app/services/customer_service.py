"""CustomerService — business logic for customer management."""
from marshmallow import ValidationError

from app.extensions import db
from app.models.customer import Customer
from app.models.user import User
from app.utils.pagination import paginate_query


class CustomerService:
    @staticmethod
    def get_all(page: int = None, per_page: int = None) -> dict:
        """Fetch a paginated list of customers."""
        query = Customer.query.order_by(Customer.id.asc())
        return paginate_query(query, page=page, per_page=per_page)

    @staticmethod
    def get_by_id(customer_id: int) -> Customer:
        """Fetch a single customer by primary key."""
        return db.session.get(Customer, customer_id)

    @staticmethod
    def create(data: dict) -> Customer:
        """Create a new customer."""
        email = data.get('email', '').strip().lower()
        if Customer.query.filter_by(email=email).first():
            raise ValidationError({'email': ['Customer with this email already exists.']})

        user_id = data.get('user_id')
        if user_id is not None:
            user = db.session.get(User, user_id)
            if not user:
                raise ValidationError({'user_id': [f'User with id {user_id} does not exist.']})

        customer = Customer(
            name=data['name'].strip(),
            email=email,
            phone=data.get('phone'),
            address=data.get('address'),
            user_id=user_id,
        )

        db.session.add(customer)
        db.session.commit()
        return customer

    @staticmethod
    def update(customer_id: int, data: dict) -> Customer:
        """Update an existing customer."""
        customer = db.session.get(Customer, customer_id)
        if not customer:
            return None

        if 'email' in data and data['email']:
            new_email = data['email'].strip().lower()
            if new_email != customer.email:
                existing = Customer.query.filter_by(email=new_email).first()
                if existing and existing.id != customer.id:
                    raise ValidationError({'email': ['Customer with this email already exists.']})
                customer.email = new_email

        if 'name' in data and data['name']:
            customer.name = data['name'].strip()

        if 'phone' in data:
            customer.phone = data['phone']

        if 'address' in data:
            customer.address = data['address']

        if 'user_id' in data:
            user_id = data['user_id']
            if user_id is not None:
                user = db.session.get(User, user_id)
                if not user:
                    raise ValidationError({'user_id': [f'User with id {user_id} does not exist.']})
            customer.user_id = user_id

        db.session.commit()
        return customer

    @staticmethod
    def delete(customer_id: int) -> bool:
        """Delete a customer record."""
        customer = db.session.get(Customer, customer_id)
        if not customer:
            return False

        db.session.delete(customer)
        db.session.commit()
        return True
