"""Alert and telemetry endpoint tests."""


def test_health(client):
    response = client.get('/api/health')
    assert response.status_code == 200
    assert response.get_json()['data']['status'] == 'ok'


def test_contact_validation(client):
    response = client.post('/api/contact', json={'name': 'A', 'email': 'bad', 'message': 'short'})
    assert response.status_code == 422


def test_contact_success(client):
    response = client.post('/api/contact', json={
        'name': 'Hilina Parent',
        'email': 'parent@example.com',
        'organization': 'Sunshine Daycare',
        'message': 'We would like a school pilot for 40 children.',
    })
    assert response.status_code == 201


def test_create_and_acknowledge_alert(client, regular_user, sample_device):
    _, _, headers = regular_user
    payload = {
        'alert_type': 'sos',
        'severity': 'critical',
        'message': 'Silent SOS pressed on the wearable.',
        'device_id': sample_device.id,
        'customer_id': sample_device.customer_id,
    }
    created = client.post('/api/alerts', json=payload, headers=headers)
    assert created.status_code == 201
    alert_id = created.get_json()['data']['alert']['id']

    listed = client.get('/api/alerts?acknowledged=false', headers=headers)
    assert listed.status_code == 200
    assert listed.get_json()['data']['pagination']['total'] >= 1

    ack = client.post(f'/api/alerts/{alert_id}/acknowledge', headers=headers)
    assert ack.status_code == 200
    assert ack.get_json()['data']['alert']['acknowledged'] is True


def test_dashboard_summary(client, regular_user, sample_device):
    _, _, headers = regular_user
    response = client.get('/api/dashboard/summary', headers=headers)
    assert response.status_code == 200
    counts = response.get_json()['data']['counts']
    assert counts['devices'] >= 1


def test_ingest_telemetry_creates_alert(client, regular_user, sample_device):
    _, _, headers = regular_user
    response = client.post('/api/ingest/telemetry', json={
        'serial_number': sample_device.serial_number,
        'battery_level': 31,
        'last_latitude': 9.03,
        'last_longitude': 38.74,
        'alert_type': 'geofence',
        'severity': 'warning',
        'message': 'Child left the mapped safe zone.',
    }, headers=headers)
    assert response.status_code == 200
    body = response.get_json()
    assert body['data']['device']['battery_level'] == 31
    assert body['data']['alert']['alert_type'] == 'geofence'
