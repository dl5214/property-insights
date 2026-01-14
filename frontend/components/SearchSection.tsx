'use client'

import { useState, useEffect } from 'react'
import { PropertySearchResult } from '@/lib/types'
import { PropertyApiClient } from '@/lib/api'

interface SearchSectionProps {
  onPropertySelect: (property: PropertySearchResult) => void
}

export default function SearchSection({ onPropertySelect }: SearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [properties, setProperties] = useState<PropertySearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load initial properties
    loadProperties('')
  }, [])

  const loadProperties = async (query: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const results = await PropertyApiClient.searchProperties(query)
      setProperties(results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load properties')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadProperties(searchQuery)
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Get Reliable Property Insights
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Search for any property to see how we integrate scattered data from multiple sources 
            and resolve conflicts using AI.
          </p>
        </div>

        {/* Search Box */}
        <form onSubmit={handleSearch} className="mb-12">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by address, city, or zip code..."
              className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading properties...</p>
          </div>
        )}

        {/* Property Cards */}
        {!isLoading && properties.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {searchQuery ? 'Search Results' : 'Available Properties'}
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {properties.map((property) => (
                <button
                  key={property.id}
                  onClick={() => onPropertySelect(property)}
                  className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-primary-500 hover:shadow-lg transition-all text-left group"
                >
                  <div className="mb-3 rounded-lg overflow-hidden bg-gray-100">
                    {property.image_url ? (
                      <img
                        src={property.image_url}
                        alt={property.address}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-40 flex items-center justify-center bg-gray-200"><svg class="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg></div>'
                        }}
                      />
                    ) : (
                      <div className="w-full h-40 flex items-center justify-center bg-gray-200">
                        <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                      {property.address}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {property.city}, {property.state} {property.zip}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center text-primary-600 text-sm font-medium">
                    <span>Analyze property</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {!isLoading && searchQuery && properties.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-gray-600">No properties found matching "{searchQuery}"</p>
            <button
              onClick={() => {
                setSearchQuery('')
                loadProperties('')
              }}
              className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
