"""Entry point for the Flask application."""
import sys
from app import create_app
from app.seed import seed_db

app = create_app()


@app.cli.command('seed-db')
def seed_command():
    """Seed initial sample data (roles, users, customers, devices)."""
    seed_db(app)


if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == '--seed':
        seed_db(app)
    else:
        app.run(host='127.0.0.1', port=5000, debug=True)
