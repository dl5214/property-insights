/**
 * Type definitions for Property Insights
 */

export interface PropertyInput {
  address?: string
  price?: number
  bedrooms?: number
  bathrooms?: number
  square_feet?: number
  year_built?: number
  description?: string
  additional_info?: Record<string, any>
}

export interface PropertySummary {
  key_features: string[]
  property_type?: string
  condition?: string
  highlights: string[]
  concerns: string[]
}

export interface PropertyAnalysis {
  property_summary: PropertySummary
  analysis: string
  insights: string[]
  confidence_score: number
  raw_input: PropertyInput
}

export interface ApiError {
  detail: string
}
