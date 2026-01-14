"""
Mock data sources simulating real estate platforms
Each source has intentional inconsistencies, missing data, and conflicts
"""

from typing import Dict, Any, List, Optional
import random


def get_zillow_data(property_id: str) -> Dict[str, Any]:
    """
    Simulate Zillow API response
    Known issues: Sometimes outdated prices, may have extra bedrooms from finished basements
    """
    data_map = {
        "prop_001": {
            "source": "Zillow",
            "price": 1250000,
            "bedrooms": 3,
            "bathrooms": 2.5,
            "square_feet": 1800,
            "year_built": 2005,
            "lot_size": None,  # Missing
            "property_type": "Condo",
            "description": "Stunning modern condo in the heart of San Francisco. Recently renovated kitchen with stainless steel appliances. Walking distance to tech companies and BART.",
            "last_updated": "2024-01-15"
        },
        "prop_002": {
            "source": "Zillow",
            "price": 2800000,
            "bedrooms": 5,  # Conflict: counted finished attic
            "bathrooms": 3.5,
            "square_feet": 3200,
            "year_built": 1998,
            "lot_size": 8500,
            "property_type": "Single Family",
            "description": "Gorgeous family home in Palo Alto with 5 bedrooms including finished attic space. Top-rated schools nearby.",
            "last_updated": "2024-01-10"
        },
        "prop_003": {
            "source": "Zillow",
            "price": 875000,  # Outdated price
            "bedrooms": 4,
            "bathrooms": 2,
            "square_feet": 2100,
            "year_built": 1925,
            "lot_size": 4500,
            "property_type": "Victorian",
            "description": "Charming Victorian home with original details. Hardwood floors throughout. Large backyard perfect for entertaining.",
            "last_updated": "2023-11-20"  # Old data
        },
        "prop_004": {
            "source": "Zillow",
            "price": 1450000,
            "bedrooms": 4,
            "bathrooms": 3,
            "square_feet": 2620,  # Slightly different measurement
            "year_built": 2010,
            "lot_size": 7200,
            "property_type": "Single Family",
            "description": "Beautiful ranch-style home with open floor plan. Energy efficient with solar panels.",
            "last_updated": "2024-01-12"
        },
        "prop_005": {
            "source": "Zillow",
            "price": 1650000,
            "bedrooms": 3,
            "bathrooms": 2.5,
            "square_feet": 2400,
            "year_built": 1915,
            "lot_size": None,
            "property_type": "Craftsman",
            "description": "Classic Berkeley craftsman with modern updates. Original built-ins and crown molding preserved.",
            "last_updated": "2024-01-18"
        }
    }
    return data_map.get(property_id, {})


def get_redfin_data(property_id: str) -> Dict[str, Any]:
    """
    Simulate Redfin API response
    Known issues: More accurate prices but sometimes missing details
    """
    data_map = {
        "prop_001": {
            "source": "Redfin",
            "price": 1295000,  # More recent/accurate price
            "bedrooms": 3,
            "bathrooms": 2.5,
            "square_feet": 1850,  # Slight difference in measurement
            "year_built": 2005,
            "lot_size": None,
            "property_type": "Condominium",
            "description": "Modern 3BR/2.5BA condo in SOMA district. Updated kitchen, in-unit laundry. HOA includes gym and rooftop deck.",
            "days_on_market": 12,
            "last_updated": "2024-01-20"
        },
        "prop_002": {
            "source": "Redfin",
            "price": 2950000,
            "bedrooms": 4,  # More accurate: doesn't count attic
            "bathrooms": 3.5,
            "square_feet": 3150,
            "year_built": 1998,
            "lot_size": 8500,
            "property_type": "Single Family Residential",
            "description": "Spacious 4 bedroom home in prestigious Palo Alto neighborhood. Close to Stanford and excellent schools.",
            "days_on_market": 8,
            "last_updated": "2024-01-19"
        },
        "prop_003": {
            "source": "Redfin",
            "price": 925000,  # More recent price
            "bedrooms": 4,
            "bathrooms": 2,
            "square_feet": 2050,
            "year_built": 1924,  # Conflict in year
            "lot_size": 4800,  # Conflict in lot size
            "property_type": "Single Family Residential",
            "description": None,  # Missing description
            "days_on_market": 25,
            "last_updated": "2024-01-14"
        },
        "prop_004": {
            "source": "Redfin",
            "price": 1480000,
            "bedrooms": 4,
            "bathrooms": 3,
            "square_feet": 2650,  # Now has square feet
            "year_built": 2010,
            "lot_size": 7200,
            "property_type": "Single Family Residential",
            "description": "Modern ranch home with 4BR/3BA. Open concept living with high ceilings.",
            "days_on_market": 5,
            "last_updated": "2024-01-21"
        },
        "prop_005": {
            "source": "Redfin",
            "price": 1695000,
            "bedrooms": 3,
            "bathrooms": 2.5,
            "square_feet": 2380,  # Slightly different measurement
            "year_built": 1916,  # Slight conflict
            "lot_size": 5000,
            "property_type": "Single Family Residential",
            "description": "Renovated craftsman home with period details intact. Updated kitchen and baths.",
            "days_on_market": 18,
            "last_updated": "2024-01-17"
        }
    }
    return data_map.get(property_id, {})


def get_public_records_data(property_id: str) -> Dict[str, Any]:
    """
    Simulate public records/county assessor data
    Known issues: Tax assessment data may be outdated, no descriptions
    """
    data_map = {
        "prop_001": {
            "source": "Public Records",
            "assessed_value": 1180000,  # Tax assessment (usually lower)
            "bedrooms": 3,
            "bathrooms": 2.5,  # Full bathroom count
            "square_feet": 1822,
            "year_built": 2005,
            "lot_size": None,  # N/A for condos
            "property_type": "Condominium",
            "last_sale_price": 950000,
            "last_sale_date": "2018-06-15",
            "tax_amount": 14750,
            "description": None  # Public records don't have descriptions
        },
        "prop_002": {
            "source": "Public Records",
            "assessed_value": 2650000,
            "bedrooms": 4,
            "bathrooms": 3,  # May not count all half baths accurately
            "square_feet": 3180,
            "year_built": 1998,
            "lot_size": 8520,
            "property_type": "Residential",
            "last_sale_price": 1850000,
            "last_sale_date": "2012-03-22",
            "tax_amount": 33125,
            "description": None
        },
        "prop_003": {
            "source": "Public Records",
            "assessed_value": 780000,  # Lower tax assessment
            "bedrooms": 4,
            "bathrooms": 2,
            "square_feet": 2075,
            "year_built": 1925,  # Original records
            "lot_size": 4650,
            "property_type": "Residential",
            "last_sale_price": 615000,
            "last_sale_date": "2015-09-10",
            "tax_amount": 9750,
            "description": None
        },
        "prop_004": {
            "source": "Public Records",
            "assessed_value": 1320000,
            "bedrooms": 4,
            "bathrooms": 3,
            "square_feet": 2680,
            "year_built": 2010,
            "lot_size": 7150,
            "property_type": "Residential",
            "last_sale_price": 1150000,
            "last_sale_date": "2019-11-05",
            "tax_amount": 16500,
            "description": None
        },
        "prop_005": {
            "source": "Public Records",
            "assessed_value": 1450000,
            "bedrooms": 3,
            "bathrooms": 2,
            "square_feet": 2375,
            "year_built": 1915,  # Original build year
            "lot_size": 4950,
            "property_type": "Residential",
            "last_sale_price": 1200000,
            "last_sale_date": "2020-02-14",
            "tax_amount": 18125,
            "description": None
        }
    }
    return data_map.get(property_id, {})


def get_property_data_from_sources(property_id: str) -> List[Dict[str, Any]]:
    """
    Fetch property data from all mock sources
    
    Args:
        property_id: Property ID
        
    Returns:
        List of data from different sources
    """
    sources = [
        get_zillow_data(property_id),
        get_redfin_data(property_id),
        get_public_records_data(property_id)
    ]
    
    # Filter out empty responses
    return [s for s in sources if s]
