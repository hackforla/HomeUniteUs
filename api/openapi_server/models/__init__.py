# coding: utf-8

# flake8: noqa
from __future__ import absolute_import
import pathlib 

def version():
    '''
    Return the current head database version, using the 
    alembic migration scripts. This requires us to bundle
    the migration scripts with the API.
    '''
    from alembic.config import Config
    from alembic.script import ScriptDirectory
    
    alembic_config_path = pathlib.Path(__file__).parent.parent.parent.resolve() / 'alembic.ini'
    if not alembic_config_path.exists():
        raise FileNotFoundError("Could not locate alembic.ini. Was this file moved or inproperly bundled?")
    
    script = ScriptDirectory.from_config(Config(alembic_config_path))
    if not script:
        raise ValueError("Alembic configuration file is not properly formatted. Could not locate migration scripts.")
    
    version = script.get_heads()
    if not version:
        raise ValueError("Could not locate database version from alembic migration scripts. Check script for error.")
    if len(version) != 1:
        raise ValueError("Multiple head versions available! We should maintain a linear database history.")
    
    return version[0]
