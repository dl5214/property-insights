'use client'

import { DataSourceInfo } from '@/lib/types'
import { useState } from 'react'

interface DataSourcesViewProps {
  sources: DataSourceInfo[]
}

export default function DataSourcesView({ sources }: DataSourcesViewProps) {
  const [expandedSource, setExpandedSource] = useState<string | null>(null)

  const getSourceColor = (source: string) => {
    if (source.includes('Zillow')) return 'bg-blue-100 text-blue-800 border-blue-200'
    if (source.includes('Redfin')) return 'bg-red-100 text-red-800 border-red-200'
    if (source.includes('Public')) return 'bg-green-100 text-green-800 border-green-200'
    return 'bg-gray-100 text-gray-800 border-gray-200'
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Data Sources</h3>
      <p className="text-gray-600 mb-4 text-sm">
        We fetched data from {sources.length} different sources. Click to expand and see details.
      </p>

      <div className="space-y-3">
        {sources.map((source, idx) => (
          <div key={idx} className="border-2 border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedSource(expandedSource === source.source ? null : source.source)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getSourceColor(source.source)}`}>
                  {source.source}
                </span>
                {source.last_updated && (
                  <span className="text-xs text-gray-500">
                    Updated: {source.last_updated}
                  </span>
                )}
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${expandedSource === source.source ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {expandedSource === source.source && (
              <div className="px-4 pb-4 border-t border-gray-200 bg-gray-50">
                <div className="grid md:grid-cols-2 gap-3 mt-3">
                  {source.price && (
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Price:</span>{' '}
                      <span className="text-gray-900">${source.price.toLocaleString()}</span>
                    </div>
                  )}
                  {source.bedrooms && (
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Bedrooms:</span>{' '}
                      <span className="text-gray-900">{source.bedrooms}</span>
                    </div>
                  )}
                  {source.bathrooms && (
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Bathrooms:</span>{' '}
                      <span className="text-gray-900">{source.bathrooms}</span>
                    </div>
                  )}
                  {source.square_feet && (
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Sq Ft:</span>{' '}
                      <span className="text-gray-900">{source.square_feet.toLocaleString()}</span>
                    </div>
                  )}
                  {source.year_built && (
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Year:</span>{' '}
                      <span className="text-gray-900">{source.year_built}</span>
                    </div>
                  )}
                  {source.property_type && (
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Type:</span>{' '}
                      <span className="text-gray-900">{source.property_type}</span>
                    </div>
                  )}
                </div>
                {source.description && (
                  <div className="mt-3 text-sm">
                    <span className="font-medium text-gray-700">Description:</span>
                    <p className="text-gray-600 mt-1">{source.description}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
