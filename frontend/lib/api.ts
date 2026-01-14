/**
 * API client for Property Insights backend
 */

import axios, { AxiosError } from 'axios'
import { PropertyInput, PropertyAnalysis, ApiError } from './types'

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
   * Analyze property information
   */
  static async analyzeProperty(data: PropertyInput): Promise<PropertyAnalysis> {
    try {
      const response = await apiClient.post<PropertyAnalysis>(
        '/api/property/analyze',
        data
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

  /**
   * Check property service health
   */
  static async checkPropertyServiceHealth(): Promise<{
    service: string
    status: string
    llm_available: boolean
  }> {
    const response = await apiClient.get('/api/property/health')
    return response.data
  }
}
