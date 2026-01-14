/**
 * Mock data for immediate display (before AI analysis completes)
 * This mirrors the backend mock_sources.py data structure
 */

import { DataSourceInfo } from './types'

export function get_property_data_from_sources(propertyId: string): DataSourceInfo[] {
  const sourcesMap: Record<string, DataSourceInfo[]> = {
    'prop_001': [
      {
        source: 'Zillow',
        price: 1250000,
        bedrooms: 3,
        bathrooms: 2.5,
        square_feet: 1800,
        year_built: 2005,
        property_type: 'Condo',
        description: 'Stunning modern condo in the heart of San Francisco.',
        last_updated: '2024-01-15'
      },
      {
        source: 'Redfin',
        price: 1295000,
        bedrooms: 3,
        bathrooms: 2.5,
        square_feet: 1850,
        year_built: 2005,
        property_type: 'Condominium',
        description: 'Modern 3BR/2.5BA condo in SOMA district.',
        last_updated: '2024-01-20'
      },
      {
        source: 'Public Records',
        price: 1180000,
        bedrooms: 3,
        bathrooms: 2.5,
        square_feet: 1822,
        year_built: 2005,
        property_type: 'Condominium',
        last_updated: '2023-12-01'
      }
    ],
    'prop_002': [
      {
        source: 'Zillow',
        price: 2800000,
        bedrooms: 5,
        bathrooms: 3.5,
        square_feet: 3200,
        year_built: 1998,
        property_type: 'Single Family',
        description: 'Gorgeous family home in Palo Alto with 5 bedrooms including finished attic space.',
        last_updated: '2024-01-10'
      },
      {
        source: 'Redfin',
        price: 2950000,
        bedrooms: 4,
        bathrooms: 3.5,
        square_feet: 3150,
        year_built: 1998,
        property_type: 'Single Family Residential',
        description: 'Spacious 4 bedroom home in prestigious Palo Alto neighborhood.',
        last_updated: '2024-01-19'
      },
      {
        source: 'Public Records',
        price: 2650000,
        bedrooms: 4,
        bathrooms: 3,
        square_feet: 3180,
        year_built: 1998,
        property_type: 'Residential',
        last_updated: '2023-11-15'
      }
    ],
    'prop_003': [
      {
        source: 'Zillow',
        price: 875000,
        bedrooms: 4,
        bathrooms: 2,
        square_feet: 2100,
        year_built: 1925,
        property_type: 'Victorian',
        description: 'Charming Victorian home with original details.',
        last_updated: '2023-11-20'
      },
      {
        source: 'Redfin',
        price: 925000,
        bedrooms: 4,
        bathrooms: 2,
        square_feet: 2050,
        year_built: 1924,
        property_type: 'Single Family Residential',
        last_updated: '2024-01-14'
      },
      {
        source: 'Public Records',
        price: 780000,
        bedrooms: 4,
        bathrooms: 2,
        square_feet: 2075,
        year_built: 1925,
        property_type: 'Residential',
        last_updated: '2023-10-01'
      }
    ],
    'prop_004': [
      {
        source: 'Zillow',
        price: 1450000,
        bedrooms: 4,
        bathrooms: 3,
        square_feet: 2620,
        year_built: 2010,
        property_type: 'Single Family',
        description: 'Beautiful ranch-style home with open floor plan.',
        last_updated: '2024-01-12'
      },
      {
        source: 'Redfin',
        price: 1480000,
        bedrooms: 4,
        bathrooms: 3,
        square_feet: 2650,
        year_built: 2010,
        property_type: 'Single Family Residential',
        description: 'Modern ranch home with 4BR/3BA.',
        last_updated: '2024-01-21'
      },
      {
        source: 'Public Records',
        price: 1320000,
        bedrooms: 4,
        bathrooms: 3,
        square_feet: 2680,
        year_built: 2010,
        property_type: 'Residential',
        last_updated: '2023-12-05'
      }
    ],
    'prop_005': [
      {
        source: 'Zillow',
        price: 1650000,
        bedrooms: 3,
        bathrooms: 2.5,
        square_feet: 2400,
        year_built: 1915,
        property_type: 'Craftsman',
        description: 'Classic Berkeley craftsman with modern updates.',
        last_updated: '2024-01-18'
      },
      {
        source: 'Redfin',
        price: 1695000,
        bedrooms: 3,
        bathrooms: 2.5,
        square_feet: 2380,
        year_built: 1916,
        property_type: 'Single Family Residential',
        description: 'Renovated craftsman home with period details intact.',
        last_updated: '2024-01-17'
      },
      {
        source: 'Public Records',
        price: 1450000,
        bedrooms: 3,
        bathrooms: 2,
        square_feet: 2375,
        year_built: 1915,
        property_type: 'Residential',
        last_updated: '2023-11-20'
      }
    ]
  }

  return sourcesMap[propertyId] || []
}
