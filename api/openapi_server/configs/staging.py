from dataclasses import dataclass
from production import ProductionHUUConfig

@dataclass(frozen=True)
class StagingHUUConfig(ProductionHUUConfig):
    FLASK_ENV: str = 'staging'
    ROOT_URL: str = 'dev.homeunite.us'