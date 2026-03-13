import time
from typing import Any, Dict, Optional
import logging

logger = logging.getLogger(__name__)

class TTLCache:
    def __init__(self, ttl_seconds: int):
        self.ttl = ttl_seconds
        self.cache: Dict[str, Dict[str, Any]] = {}

    def get(self, key: str) -> Optional[Any]:
        if key in self.cache:
            entry = self.cache[key]
            if time.time() - entry['timestamp'] < self.ttl:
                logger.debug(f"Cache hit for key: {key}")
                return entry['data']
            else:
                logger.debug(f"Cache expired for key: {key}")
                del self.cache[key]
        return None

    def set(self, key: str, data: Any):
        self.cache[key] = {
            'data': data,
            'timestamp': time.time()
        }

# Cache instances
# 1. Geocoder: 24 hours (86400s) - City boundaries rarely change
geocoder_cache = TTLCache(ttl_seconds=86400)

# 2. Open-Meteo: 10 minutes (600s) - Weather updates frequently
weather_cache = TTLCache(ttl_seconds=600)

# 3. OSM Data: 1 hour (3600s) - Building/park data updates slowly
osm_cache = TTLCache(ttl_seconds=3600)
