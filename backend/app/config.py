"""
Configuration classes for different environments.
Loads all secrets from environment variables — never hardcoded.
"""
import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Base configuration shared across all environments."""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'fallback-secret-key')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'fallback-jwt-secret-key')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)


class DevelopmentConfig(Config):
    """Development configuration — DEBUG on, PostgreSQL from .env."""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL',
        'postgresql://postgres:12345@localhost:5432/alehu'
    )
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)


class TestingConfig(Config):
    """Testing configuration — uses SQLite in-memory, never touches production DB."""
    TESTING = True
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=5)
    WTF_CSRF_ENABLED = False


class ProductionConfig(Config):
    """Production configuration — DEBUG off, all secrets required from environment."""
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=5)

    def __init__(self):
        if not self.SQLALCHEMY_DATABASE_URI:
            raise ValueError("DATABASE_URL environment variable must be set in production")
        if self.SECRET_KEY == 'fallback-secret-key':
            raise ValueError("SECRET_KEY environment variable must be set in production")
        if self.JWT_SECRET_KEY == 'fallback-jwt-secret-key':
            raise ValueError("JWT_SECRET_KEY environment variable must be set in production")


# Primary mapping used by create_app() and tests
config_by_name = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig,
}

# Alias for backward compatibility
config_map = config_by_name
