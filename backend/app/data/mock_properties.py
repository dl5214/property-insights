"""
Mock property database
In a real system, this would be replaced with actual database queries
"""

from typing import List, Dict, Any, Optional

# Mock property database with basic info
PROPERTIES = [
    {
        "id": "prop_001",
        "address": "123 Market Street, San Francisco, CA 94102",
        "city": "San Francisco",
        "state": "CA",
        "zip": "94102",
        "image_url": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop"
    },
    {
        "id": "prop_002", 
        "address": "456 Oak Avenue, Palo Alto, CA 94301",
        "city": "Palo Alto",
        "state": "CA",
        "zip": "94301",
        "image_url": "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop"
    },
    {
        "id": "prop_003",
        "address": "789 Pine Street, Oakland, CA 94607",
        "city": "Oakland",
        "state": "CA",
        "zip": "94607",
        "image_url": "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop"
    },
    {
        "id": "prop_004",
        "address": "321 Elm Drive, San Jose, CA 95112",
        "city": "San Jose",
        "state": "CA",
        "zip": "95112",
        "image_url": "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=400&h=300&fit=crop"
    },
    {
        "id": "prop_005",
        "address": "654 Maple Court, Berkeley, CA 94704",
        "city": "Berkeley",
        "state": "CA",
        "zip": "94704",
        "image_url": "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop"
    }
]


def search_properties(query: str) -> List[Dict[str, Any]]:
    """
    Search properties by address, city, or zip code
    
    Args:
        query: Search query string
        
    Returns:
        List of matching properties
    """
    if not query or len(query.strip()) < 2:
        return PROPERTIES[:5]  # Return first 5 if no query
    
    query_lower = query.lower().strip()
    results = []
    
    for prop in PROPERTIES:
        if (query_lower in prop["address"].lower() or
            query_lower in prop["city"].lower() or
            query_lower in prop["zip"]):
            results.append(prop)
    
    return results


def get_property_by_id(property_id: str) -> Optional[Dict[str, Any]]:
    """
    Get property by ID
    
    Args:
        property_id: Property ID
        
    Returns:
        Property dict or None if not found
    """
    for prop in PROPERTIES:
        if prop["id"] == property_id:
            return prop
    return None
