
import pytest
from loguru import logger
from app.core.logging import setup_logging
from app.core.config import Settings
import io
import sys


@pytest.fixture(autouse=True)
def setup_test_logging():
    """Setup and cleanup for logging tests"""
    logger.remove()
    yield
    logger.remove()


def test_logging_setup_development():
    """Test that logging is properly configured in development environment"""
    stdout = io.StringIO()
    sys.stdout = stdout
    
    settings = Settings(
        HUU_ENVIRONMENT="development",
        LOG_LEVEL="DEBUG",
        COGNITO_CLIENT_ID="test_client_id",
        COGNITO_CLIENT_SECRET="test_client_secret",
        COGNITO_REGION="us-east-1",
        COGNITO_REDIRECT_URI="http://test.com",
        COGNITO_USER_POOL_ID="test_pool_id",
        COGNITO_ACCESS_ID="test_access_id",
        COGNITO_ACCESS_KEY="test_access_key",
        ROOT_URL="http://test.com",
        DATABASE_URL="sqlite:///test.db"
    )
    
    setup_logging(settings)
    test_message = "Test debug message"
    logger.debug(test_message)
    
    sys.stdout = sys.__stdout__
    output = stdout.getvalue()
    
    assert test_message in output
    assert "DEBUG" in output


def test_logging_setup_production():
    """Test that logging is properly configured in production environment"""
    stdout = io.StringIO()
    sys.stdout = stdout
    
    settings = Settings(
        HUU_ENVIRONMENT="production",
        LOG_LEVEL="INFO",
        COGNITO_CLIENT_ID="test_client_id",
        COGNITO_CLIENT_SECRET="test_client_secret",
        COGNITO_REGION="us-east-1",
        COGNITO_REDIRECT_URI="http://test.com",
        COGNITO_USER_POOL_ID="test_pool_id",
        COGNITO_ACCESS_ID="test_access_id",
        COGNITO_ACCESS_KEY="test_access_key",
        ROOT_URL="http://test.com",
        DATABASE_URL="sqlite:///test.db"
    )
    
    setup_logging(settings)
    test_message = "Test production message"
    logger.info(test_message)
    
    sys.stdout = sys.__stdout__
    output = stdout.getvalue()
    
    assert test_message in output
    assert "|" in output 
    assert "INFO" in output


def test_development_logging_format():
    """Test that development environment has correct format"""
    stdout = io.StringIO()
    sys.stdout = stdout
    
    settings = Settings(
        HUU_ENVIRONMENT="development",
        LOG_LEVEL="INFO",
        COGNITO_CLIENT_ID="test_client_id",
        COGNITO_CLIENT_SECRET="test_client_secret",
        COGNITO_REGION="us-east-1",
        COGNITO_REDIRECT_URI="http://test.com",
        COGNITO_USER_POOL_ID="test_pool_id",
        COGNITO_ACCESS_ID="test_access_id",
        COGNITO_ACCESS_KEY="test_access_key",
        ROOT_URL="http://test.com",
        DATABASE_URL="sqlite:///test.db"
    )
    
    setup_logging(settings)
    logger.info("Test message")
    
    sys.stdout = sys.__stdout__
    output = stdout.getvalue()
    
    assert "\x1b[37m" in output 
    assert "\x1b[32m" in output 
    assert "\x1b[36m" in output  
    assert "test_development_logging_format" in output  
    assert "|" in output


def test_logging_level_respect():
    """Test that logging respects set log levels"""
    stdout = io.StringIO()
    sys.stdout = stdout
    
    settings = Settings(
        HUU_ENVIRONMENT="development",
        LOG_LEVEL="INFO",
        COGNITO_CLIENT_ID="test_client_id",
        COGNITO_CLIENT_SECRET="test_client_secret",
        COGNITO_REGION="us-east-1",
        COGNITO_REDIRECT_URI="http://test.com",
        COGNITO_USER_POOL_ID="test_pool_id",
        COGNITO_ACCESS_ID="test_access_id",
        COGNITO_ACCESS_KEY="test_access_key",
        ROOT_URL="http://test.com",
        DATABASE_URL="sqlite:///test.db"
    )
    
    setup_logging(settings)
    
    logger.debug("Debug message")
    logger.info("Info message")
    
    sys.stdout = sys.__stdout__
    output = stdout.getvalue()
    
    assert "Debug message" not in output
    assert "Info message" in output


def test_error_logging():
    """Test error logging functionality"""
    stdout = io.StringIO()
    sys.stdout = stdout
    
    settings = Settings(
        HUU_ENVIRONMENT="development",
        LOG_LEVEL="ERROR",
        COGNITO_CLIENT_ID="test_client_id",
        COGNITO_CLIENT_SECRET="test_client_secret",
        COGNITO_REGION="us-east-1",
        COGNITO_REDIRECT_URI="http://test.com",
        COGNITO_USER_POOL_ID="test_pool_id",
        COGNITO_ACCESS_ID="test_access_id",
        COGNITO_ACCESS_KEY="test_access_key",
        ROOT_URL="http://test.com",
        DATABASE_URL="sqlite:///test.db"
    )
    
    setup_logging(settings)
    error_message = "Test error message"
    logger.error(error_message)
    
    sys.stdout = sys.__stdout__
    output = stdout.getvalue()
    
    assert error_message in output
    assert "ERROR" in output