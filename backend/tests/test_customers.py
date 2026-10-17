"""Customer endpoint tests."""


def test_get_customers_authenticated(client, regular_user, sample_customer):
    """Test authenticated user can list customers."""
    _, _, headers = regular_user
    response = client.get('/api/customers', headers=headers)
    assert response.status_code == 200

    data = response.get_json()
    assert data['success'] is True
    assert 'customers' in data['data']
    assert len(data['data']['customers']) >= 1


def test_get_customers_unauthenticated(client):
    """Test unauthenticated request returns 401."""
    response = client.get('/api/customers')
    assert response.status_code == 401


def test_create_customer_success(client, regular_user):
    """Test creating a customer."""
    _, _, headers = regular_user
    payload = {
        'name': 'Gamma Logistics',
        'email': 'gamma@example.com',
        'phone': '123-111-2222',
        'address': '789 Industrial Rd',
    }
    response = client.post('/api/customers', json=payload, headers=headers)
    assert response.status_code == 201

    data = response.get_json()
    assert data['success'] is True
    assert data['data']['customer']['name'] == 'Gamma Logistics'
    assert data['data']['customer']['email'] == 'gamma@example.com'


def test_create_customer_duplicate_email(client, regular_user, sample_customer):
    """Test duplicate customer email returns 422."""
    _, _, headers = regular_user
    payload = {
        'name': 'Duplicate Corp',
        'email': sample_customer.email,
    }
    response = client.post('/api/customers', json=payload, headers=headers)
    assert response.status_code == 422
    data = response.get_json()
    assert data['success'] is False


def test_create_customer_missing_name(client, regular_user):
    """Test missing required field returns 422."""
    _, _, headers = regular_user
    payload = {'email': 'noname@example.com'}
    response = client.post('/api/customers', json=payload, headers=headers)
    assert response.status_code == 422


def test_get_customer_by_id(client, regular_user, sample_customer):
    """Test getting single customer by ID."""
    _, _, headers = regular_user
    response = client.get(f'/api/customers/{sample_customer.id}', headers=headers)
    assert response.status_code == 200
    data = response.get_json()
    assert data['data']['customer']['id'] == sample_customer.id


def test_get_customer_not_found(client, regular_user):
    """Test getting nonexistent customer returns 404."""
    _, _, headers = regular_user
    response = client.get('/api/customers/99999', headers=headers)
    assert response.status_code == 404


def test_update_customer(client, regular_user, sample_customer):
    """Test updating customer."""
    _, _, headers = regular_user
    payload = {'phone': '999-888-7777'}
    response = client.put(f'/api/customers/{sample_customer.id}', json=payload, headers=headers)
    assert response.status_code == 200
    data = response.get_json()
    assert data['data']['customer']['phone'] == '999-888-7777'


def test_delete_customer(client, regular_user, sample_customer):
    """Test deleting customer."""
    _, _, headers = regular_user
    response = client.delete(f'/api/customers/{sample_customer.id}', headers=headers)
    assert response.status_code == 200

    # Ensure it's deleted
    get_resp = client.get(f'/api/customers/{sample_customer.id}', headers=headers)
    assert get_resp.status_code == 404
