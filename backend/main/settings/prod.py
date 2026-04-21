from .base import *

DEBUG = config("DEBUG", default=False, cast=bool)
 
DATABASES = { 
    "default": { 
        "ENGINE": "django.db.backends.postgresql_psycopg2", 
        "NAME": config("SQL_DATABASE"), 
        "USER": config("SQL_USER"), 
        "PASSWORD": config("SQL_PASSWORD"), 
        "HOST": config("SQL_HOST"), 
        "PORT": config("SQL_PORT"), 
        "ATOMIC_REQUESTS": True, 
    } 
} 
