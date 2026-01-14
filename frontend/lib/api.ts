/**
 * API client for Property Insights backend
 */

import axios, { AxiosError } from 'axios'
import { PropertySearchResult, PropertyAnalysis, ApiError } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 120000, // 2 minutes for LLM generation
  headers: {
    'Content-Type': 'application/json',
  },
})

export class PropertyApiClient {
  /**
   * Search for properties
   */
  static async searchProperties(query: string): Promise<PropertySearchResult[]> {
    try {
      const response = await apiClient.get<PropertySearchResult[]>(
        '/api/property/search',
        { params: { q: query } }
      )
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiError>
        throw new Error(
          axiosError.response?.data?.detail || 
          'Failed to search properties. Please try again.'
        )
      }
      throw error
    }
  }

  /**
   * Analyze property by ID
   */
  static async analyzeProperty(propertyId: string): Promise<PropertyAnalysis> {
    try {
      const response = await apiClient.get<PropertyAnalysis>(
        `/api/property/${propertyId}/analyze`
      )
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiError>
        throw new Error(
          axiosError.response?.data?.detail || 
          'Failed to analyze property. Please try again.'
        )
      }
      throw error
    }
  }

  /**
   * Check API health
   */
  static async checkHealth(): Promise<boolean> {
    try {
      const response = await apiClient.get('/health')
      return response.status === 200
    } catch {
      return false
    }
  }
}
