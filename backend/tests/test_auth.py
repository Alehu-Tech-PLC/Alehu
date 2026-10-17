"""Authentication endpoint tests."""
import json


def test_register_success(client, roles):
    """Test successful user registration."""
    payload = {
        'username': 'newuser',
        'email': 'newuser@example.com',
        'password': 'Password123!',
    }
    response = client.post('/api/auth/register', json=payload)
    assert response.status_code == 201

    data = response.get_json()
    assert data['success'] is True
    assert 'access_token' in data['data']
    assert 'refresh_token' in data['data']
    assert data['data']['user']['email'] == 'newuser@example.com'


def test_register_duplicate_email(client, regular_user):
    """Test registration fails with duplicate email."""
    user, _, _ = regular_user
    payload = {
        'username': 'otheruser',
        'email': user.email,
        'password': 'Password123!',
    }
    response = client.post('/api/auth/register', json=payload)
    assert response.status_code == 422
    data = response.get_json()
    assert data['success'] is False
    assert 'email' in data['errors']


def test_login_success(client, regular_user):
    """Test successful login with email and password."""
    user, _, _ = regular_user
    payload = {
        'email': user.email,
        'password': 'UserPass123!',
    }
    response = client.post('/api/auth/login', json=payload)
    assert response.status_code == 200

    data = response.get_json()
    assert data['success'] is True
    assert 'access_token' in data['data']
    assert 'refresh_token' in data['data']
    assert data['data']['user']['email'] == user.email


def test_login_invalid_password(client, regular_user):
    """Test login with wrong password returns 401."""
    user, _, _ = regular_user
    payload = {
        'email': user.email,
        'password': 'WrongPassword!',
    }
    response = client.post('/api/auth/login', json=payload)
    assert response.status_code == 401
    data = response.get_json()
    assert data['success'] is False


def test_login_nonexistent_email(client):
    """Test login with unknown email returns 401."""
    payload = {
        'email': 'ghost@example.com',
        'password': 'Password123!',
    }
    response = client.post('/api/auth/login', json=payload)
    assert response.status_code == 401
    data = response.get_json()
    assert data['success'] is False


def test_logout_revokes_token(client, regular_user):
    """Test logout adds token to blocklist and denies subsequent requests."""
    user, token, headers = regular_user

    # Request /api/auth/me should succeed
    me_resp = client.get('/api/auth/me', headers=headers)
    assert me_resp.status_code == 200

    # Logout
    logout_resp = client.post('/api/auth/logout', headers=headers)
    assert logout_resp.status_code == 200

    # Request /api/auth/me should now fail with 401 (token revoked)
    blocked_resp = client.get('/api/auth/me', headers=headers)
    assert blocked_resp.status_code == 401


def test_refresh_token(client, regular_user):
    """Test refreshing an access token using a refresh token."""
    user, _, _ = regular_user
    login_resp = client.post('/api/auth/login', json={
        'email': user.email,
        'password': 'UserPass123!',
    })
    refresh_token = login_resp.get_json()['data']['refresh_token']

    headers = {'Authorization': f'Bearer {refresh_token}'}
    response = client.post('/api/auth/refresh', headers=headers)
    assert response.status_code == 200

    data = response.get_json()
    assert data['success'] is True
    assert 'access_token' in data['data']
