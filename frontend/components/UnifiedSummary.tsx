'use client'

import { useState } from 'react'
import { PropertySummary } from '@/lib/types'
import ReactMarkdown from 'react-markdown'

interface UnifiedSummaryProps {
  summary: PropertySummary
  confidence: number
  analysis: string
  insights: string[]
  showInsights: boolean
  onToggleInsights: () => void
}

interface UnifiedSummaryState {
  showAnalysis: boolean
}

export default function UnifiedSummary({
  summary,
  confidence,
  analysis,
  insights,
  showInsights,
  onToggleInsights
}: UnifiedSummaryProps) {
  const [showAnalysis, setShowAnalysis] = useState(false)
  
  const confidenceColor = 
    confidence >= 0.8 ? 'text-green-600' :
    confidence >= 0.6 ? 'text-yellow-600' :
    'text-red-600'

  const confidenceBg = 
    confidence >= 0.8 ? 'bg-green-600' :
    confidence >= 0.6 ? 'bg-yellow-600' :
    'bg-red-600'

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg border-2 border-primary-200 p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Property Analysis</h3>
          <p className="text-gray-600">AI-unified summary from multiple sources</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600 mb-1">Confidence</div>
          <div className={`text-3xl font-bold ${confidenceColor}`}>
            {(confidence * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {summary.price && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-600 mb-1">Price</div>
            <div className="text-xl font-bold text-gray-900">
              ${(summary.price / 1000).toFixed(0)}K
            </div>
          </div>
        )}
        
        {summary.bedrooms && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-600 mb-1">Bedrooms</div>
            <div className="text-xl font-bold text-gray-900">{summary.bedrooms}</div>
          </div>
        )}
        
        {summary.bathrooms && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-600 mb-1">Bathrooms</div>
            <div className="text-xl font-bold text-gray-900">{summary.bathrooms}</div>
          </div>
        )}
        
        {summary.square_feet && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-600 mb-1">Sq Ft</div>
            <div className="text-xl font-bold text-gray-900">
              {summary.square_feet.toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {/* Property Type & Year */}
      {(summary.property_type || summary.year_built) && (
        <div className="flex flex-wrap gap-3 mb-6">
          {summary.property_type && (
            <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
              {summary.property_type}
            </span>
          )}
          {summary.year_built && (
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
              Built {summary.year_built}
            </span>
          )}
        </div>
      )}

      {/* Highlights & Concerns */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {summary.highlights.length > 0 && (
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h4 className="font-semibold text-green-900 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Highlights
            </h4>
            <ul className="space-y-1">
              {summary.highlights.map((highlight, idx) => (
                <li key={idx} className="text-green-800 text-sm flex items-start">
                  <span className="mr-2">•</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {summary.concerns.length > 0 && (
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <h4 className="font-semibold text-amber-900 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Things to Verify
            </h4>
            <ul className="space-y-1">
              {summary.concerns.map((concern, idx) => (
                <li key={idx} className="text-amber-800 text-sm flex items-start">
                  <span className="mr-2">•</span>
                  <span>{concern}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Detailed Analysis - Collapsible */}
      <div className="mb-4">
        <button
          onClick={() => setShowAnalysis(!showAnalysis)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-semibold text-gray-900">Detailed Analysis</span>
          </div>
          <svg
            className={`w-5 h-5 text-gray-600 transition-transform ${showAnalysis ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showAnalysis && (
          <div className="mt-3 bg-white rounded-lg p-4 border border-gray-200">
            <div className="prose prose-sm max-w-none text-gray-700">
              <ReactMarkdown>{analysis}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Key Insights - Collapsible */}
      {insights.length > 0 && (
        <div>
          <button
            onClick={onToggleInsights}
            className="w-full flex items-center justify-between p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="font-semibold text-primary-900">
                {insights.length} Key Recommendations
              </span>
            </div>
            <svg
              className={`w-5 h-5 text-primary-600 transition-transform ${showInsights ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showInsights && (
            <div className="mt-3 space-y-2">
              {insights.map((insight, idx) => (
                <div
                  key={idx}
                  className="flex items-start p-3 bg-white rounded-lg border border-primary-200"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-gray-700 text-sm">{insight}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
