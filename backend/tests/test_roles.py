"""Role and Permission endpoint tests."""
from app.extensions import db
from app.models.permission import Permission


def test_get_roles_admin(client, admin_user):
    """Test admin can list roles."""
    _, _, admin_headers = admin_user
    response = client.get('/api/roles', headers=admin_headers)
    assert response.status_code == 200

    data = response.get_json()
    assert data['success'] is True
    assert 'roles' in data['data']


def test_get_roles_forbidden_for_user(client, regular_user):
    """Test regular user cannot list roles."""
    _, _, user_headers = regular_user
    response = client.get('/api/roles', headers=user_headers)
    assert response.status_code == 403


def test_create_role(client, admin_user):
    """Test admin creates a new role."""
    _, _, admin_headers = admin_user
    payload = {'name': 'auditor', 'description': 'Audits system actions'}
    response = client.post('/api/roles', json=payload, headers=admin_headers)
    assert response.status_code == 201

    data = response.get_json()
    assert data['data']['role']['name'] == 'auditor'


def test_assign_permissions_to_role(client, admin_user, roles):
    """Test assigning permissions to a role."""
    _, _, admin_headers = admin_user

    # Create permissions
    p1 = Permission(name='audit:read', resource='audit', action='read')
    p2 = Permission(name='audit:export', resource='audit', action='export')
    db.session.add_all([p1, p2])
    db.session.commit()

    payload = {'permission_ids': [p1.id, p2.id]}
    role_id = roles['user'].id
    response = client.post(f'/api/roles/{role_id}/permissions', json=payload, headers=admin_headers)
    assert response.status_code == 200

    data = response.get_json()
    assert 'audit:read' in data['data']['role']['permissions']
    assert 'audit:export' in data['data']['role']['permissions']


def test_delete_role_with_assigned_users_fails(client, admin_user, regular_user, roles):
    """Test deleting a role that has assigned users returns 422."""
    _, _, admin_headers = admin_user
    role_id = roles['user'].id

    response = client.delete(f'/api/roles/{role_id}', headers=admin_headers)
    assert response.status_code == 422
    data = response.get_json()
    assert data['success'] is False


def test_permissions_crud(client, admin_user):
    """Test permission create, get, and delete endpoints."""
    _, _, admin_headers = admin_user

    # Create permission
    perm_payload = {
        'name': 'billing:manage',
        'description': 'Billing management',
        'resource': 'billing',
        'action': 'manage',
    }
    create_resp = client.post('/api/permissions', json=perm_payload, headers=admin_headers)
    assert create_resp.status_code == 201
    perm_id = create_resp.get_json()['data']['permission']['id']

    # Get single permission
    get_resp = client.get(f'/api/permissions/{perm_id}', headers=admin_headers)
    assert get_resp.status_code == 200
    assert get_resp.get_json()['data']['permission']['name'] == 'billing:manage'

    # Delete permission
    del_resp = client.delete(f'/api/permissions/{perm_id}', headers=admin_headers)
    assert del_resp.status_code == 200
