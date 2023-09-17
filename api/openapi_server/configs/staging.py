from dataclasses import dataclass

from .production import ProductionHUUConfig

@dataclass(frozen=True)
class StagingHUUConfig(ProductionHUUConfig):
    ROOT_URL: str = 'dev.homeunite.us'