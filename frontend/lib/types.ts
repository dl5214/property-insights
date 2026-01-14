/**
 * Type definitions for Property Insights
 */

export interface PropertySearchResult {
  id: string
  address: string
  city: string
  state: string
  zip: string
  image_url?: string
}

export interface DataSourceInfo {
  source: string
  price?: number
  bedrooms?: number
  bathrooms?: number
  square_feet?: number
  year_built?: number
  lot_size?: number
  property_type?: string
  description?: string
  last_updated?: string
  raw_data?: Record<string, any>
}

export interface FieldAnalysis {
  field_name: string
  values: any[]
  conflicts: boolean
  recommended_value: any
  confidence: number
  reasoning: string
}

export interface ConflictResolution {
  field_analyses: FieldAnalysis[]
  overall_confidence: number
  missing_fields: string[]
  conflict_summary: string
}

export interface PropertySummary {
  price?: number
  bedrooms?: number
  bathrooms?: number
  square_feet?: number
  year_built?: number
  lot_size?: number
  property_type?: string
  key_features: string[]
  condition?: string
  highlights: string[]
  concerns: string[]
}

export interface PropertyAnalysis {
  property_id: string
  address: string
  data_sources: DataSourceInfo[]
  conflict_resolution: ConflictResolution
  property_summary: PropertySummary
  analysis: string
  insights: string[]
  confidence_score: number
}

export interface ApiError {
  detail: string
}
