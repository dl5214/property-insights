"""Mock data module"""

from .mock_properties import search_properties, get_property_by_id, PROPERTIES
from .mock_sources import get_property_data_from_sources

__all__ = [
    "search_properties",
    "get_property_by_id", 
    "PROPERTIES",
    "get_property_data_from_sources"
]
