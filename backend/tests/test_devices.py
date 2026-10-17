"""Device endpoint tests."""


def test_get_devices_authenticated(client, regular_user, sample_device):
    """Test authenticated user can list devices."""
    _, _, headers = regular_user
    response = client.get('/api/devices', headers=headers)
    assert response.status_code == 200

    data = response.get_json()
    assert data['success'] is True
    assert 'devices' in data['data']
    assert len(data['data']['devices']) >= 1


def test_get_devices_unauthenticated(client):
    """Test unauthenticated request returns 401."""
    response = client.get('/api/devices')
    assert response.status_code == 401


def test_create_device_success(client, regular_user, sample_customer):
    """Test creating a device."""
    _, _, headers = regular_user
    payload = {
        'name': 'Edge Firewall',
        'serial_number': 'FW-DELTA-101',
        'device_type': 'Firewall',
        'status': 'active',
        'customer_id': sample_customer.id,
    }
    response = client.post('/api/devices', json=payload, headers=headers)
    assert response.status_code == 201

    data = response.get_json()
    assert data['success'] is True
    assert data['data']['device']['serial_number'] == 'FW-DELTA-101'


def test_create_device_duplicate_serial(client, regular_user, sample_device):
    """Test duplicate device serial returns 422."""
    _, _, headers = regular_user
    payload = {
        'name': 'Another Device',
        'serial_number': sample_device.serial_number,
    }
    response = client.post('/api/devices', json=payload, headers=headers)
    assert response.status_code == 422
    data = response.get_json()
    assert data['success'] is False


def test_get_device_by_id(client, regular_user, sample_device):
    """Test getting single device by ID."""
    _, _, headers = regular_user
    response = client.get(f'/api/devices/{sample_device.id}', headers=headers)
    assert response.status_code == 200
    data = response.get_json()
    assert data['data']['device']['id'] == sample_device.id


def test_get_device_not_found(client, regular_user):
    """Test getting nonexistent device returns 404."""
    _, _, headers = regular_user
    response = client.get('/api/devices/99999', headers=headers)
    assert response.status_code == 404


def test_update_device(client, regular_user, sample_device):
    """Test updating device."""
    _, _, headers = regular_user
    payload = {'status': 'maintenance'}
    response = client.put(f'/api/devices/{sample_device.id}', json=payload, headers=headers)
    assert response.status_code == 200
    data = response.get_json()
    assert data['data']['device']['status'] == 'maintenance'


def test_delete_device(client, regular_user, sample_device):
    """Test deleting device."""
    _, _, headers = regular_user
    response = client.delete(f'/api/devices/{sample_device.id}', headers=headers)
    assert response.status_code == 200

    # Ensure it's deleted
    get_resp = client.get(f'/api/devices/{sample_device.id}', headers=headers)
    assert get_resp.status_code == 404
