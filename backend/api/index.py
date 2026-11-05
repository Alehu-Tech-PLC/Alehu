"""
Vercel serverless entry point for the Flask app.
Vercel looks for `app` (WSGI callable) in this file.
"""
import sys
import os

# Make sure the backend root is on the path so `from app import create_app` works
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app  # noqa: E402

app = create_app('production')
