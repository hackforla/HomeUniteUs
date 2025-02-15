import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from loguru import logger
from app.core.logging import setup_logging
from app.core.config import Settings
import json
import uuid
import re
import io
import sys


@pytest.fixture(autouse=True)
def setup_test_logging():
    """Setup and cleanup for logging tests"""
    logger.remove()
    yield
    logger.remove()


@pytest.fixture
def test_app():
    """Fixture for creating test FastAPI app"""
    app = FastAPI()
    
    @app.get("/test")
    async def test_endpoint():
        logger.info("Test endpoint called")
        return {"message": "test"}
    
    return app


def test_logging_setup_development():
    """Test that logging is properly configured in development environment"""
    stdout = io.StringIO()
    sys.stdout = stdout
    
    settings = Settings(
        HUU_ENVIRONMENT="development",
        LOG_LEVEL="DEBUG"
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
        LOG_LEVEL="INFO"
    )
    
    setup_logging(settings)
    test_message = "Test production message"
    logger.info(test_message)
    
    # Reset stdout
    sys.stdout = sys.__stdout__
    output = stdout.getvalue()
    
    # Check if message was logged
    assert test_message in output
    assert "|" in output  # Check format separator
    assert "INFO" in output


def test_development_format():
    """Test that development environment has correct format"""
    stdout = io.StringIO()
    sys.stdout = stdout
    
    settings = Settings(
        HUU_ENVIRONMENT="development",
        LOG_LEVEL="INFO"
    )
    
    setup_logging(settings)
    logger.info("Test message")
    
    sys.stdout = sys.__stdout__
    output = stdout.getvalue()
    
    assert "\x1b[37m" in output 
    assert "\x1b[32m" in output 
    assert "\x1b[36m" in output  
    assert "test_development_format" in output  
    assert "|" in output


def test_logging_level_respect():
    """Test that logging respects set log levels"""
    stdout = io.StringIO()
    sys.stdout = stdout
    
    settings = Settings(
        HUU_ENVIRONMENT="development",
        LOG_LEVEL="INFO"
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
        LOG_LEVEL="ERROR"
    )
    
    setup_logging(settings)
    error_message = "Test error message"
    logger.error(error_message)
    
    sys.stdout = sys.__stdout__
    output = stdout.getvalue()
    
    assert error_message in output
    assert "ERROR" in output


def test_development_format():
    """Test that development environment has correct format"""
    stdout = io.StringIO()
    sys.stdout = stdout
    
    settings = Settings(
        HUU_ENVIRONMENT="development",
        LOG_LEVEL="INFO"
    )
    
    setup_logging(settings)
    logger.info("Test message")
    
    sys.stdout = sys.__stdout__
    output = stdout.getvalue()
    
    assert "\x1b[37m" in output 
    assert "\x1b[32m" in output  
    assert "\x1b[36m" in output  
    assert "test_development_format" in output  
    assert "|" in output