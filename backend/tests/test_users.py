"""User management endpoint tests."""


def test_get_users_admin_allowed(client, admin_user, regular_user):
    """Test admin can list users with pagination."""
    _, _, admin_headers = admin_user
    response = client.get('/api/users', headers=admin_headers)
    assert response.status_code == 200

    data = response.get_json()
    assert data['success'] is True
    assert 'users' in data['data']
    assert 'pagination' in data['data']
    assert data['data']['pagination']['total'] >= 2


def test_get_users_forbidden_for_regular_user(client, regular_user):
    """Test regular user cannot list users (403 Forbidden)."""
    _, _, user_headers = regular_user
    response = client.get('/api/users', headers=user_headers)
    assert response.status_code == 403

    data = response.get_json()
    assert data['success'] is False


def test_get_users_unauthenticated(client):
    """Test unauthenticated request returns 401."""
    response = client.get('/api/users')
    assert response.status_code == 401


def test_create_user_admin(client, admin_user, roles):
    """Test admin creates a new user."""
    _, _, admin_headers = admin_user
    payload = {
        'username': 'createdbyadmin',
        'email': 'admincreated@example.com',
        'password': 'Password123!',
        'role_id': roles['user'].id,
    }
    response = client.post('/api/users', json=payload, headers=admin_headers)
    assert response.status_code == 201

    data = response.get_json()
    assert data['success'] is True
    assert data['data']['user']['username'] == 'createdbyadmin'


def test_get_user_by_id(client, admin_user, regular_user):
    """Test fetching a user by ID."""
    reg_u, _, _ = regular_user
    _, _, admin_headers = admin_user

    response = client.get(f'/api/users/{reg_u.id}', headers=admin_headers)
    assert response.status_code == 200
    data = response.get_json()
    assert data['data']['user']['email'] == reg_u.email


def test_get_user_by_invalid_id(client, admin_user):
    """Test fetching a nonexistent user returns 404."""
    _, _, admin_headers = admin_user
    response = client.get('/api/users/99999', headers=admin_headers)
    assert response.status_code == 404


def test_update_user(client, admin_user, regular_user):
    """Test admin updates a user."""
    reg_u, _, _ = regular_user
    _, _, admin_headers = admin_user

    payload = {'username': 'updateduser'}
    response = client.put(f'/api/users/{reg_u.id}', json=payload, headers=admin_headers)
    assert response.status_code == 200

    data = response.get_json()
    assert data['data']['user']['username'] == 'updateduser'


def test_deactivate_user(client, admin_user, regular_user):
    """Test admin deactivates (soft deletes) a user."""
    reg_u, _, _ = regular_user
    _, _, admin_headers = admin_user

    response = client.delete(f'/api/users/{reg_u.id}', headers=admin_headers)
    assert response.status_code == 200

    data = response.get_json()
    assert data['data']['user']['is_active'] is False
