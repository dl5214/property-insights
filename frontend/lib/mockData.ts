/**
 * Mock data for immediate display (before AI analysis completes)
 */

import { DataSourceInfo } from './types'

export function get_property_data_from_sources(propertyId: string): DataSourceInfo[] {
  // This mirrors the backend mock data structure
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
        bathrooms: 2,
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
    ]
  }

  return sourcesMap[propertyId] || []
}
