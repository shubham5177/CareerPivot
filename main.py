import os
import sys

SERVICE_DIRECTORY = os.path.join(os.path.dirname(__file__), "ml-service")
sys.path.insert(0, SERVICE_DIRECTORY)

from app.main import app
