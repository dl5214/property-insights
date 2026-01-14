'use client'

import { PropertyAnalysis } from '@/lib/types'

interface InsightReportProps {
  analysis: PropertyAnalysis
}

export default function InsightReport({ analysis }: InsightReportProps) {
  const { property_summary, analysis: analysisText, insights, confidence_score } = analysis

  return (
    <div className="space-y-6">
      {/* Confidence Score */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Analysis Confidence</h3>
          <span className="text-2xl font-bold text-primary-600">
            {(confidence_score * 100).toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{ width: `${confidence_score * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Based on completeness of provided information
        </p>
      </div>

      {/* Property Summary */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">Property Summary</h3>
        
        {property_summary.property_type && (
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
              {property_summary.property_type}
            </span>
          </div>
        )}

        {property_summary.key_features.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Features</h4>
            <div className="flex flex-wrap gap-2">
              {property_summary.key_features.map((feature, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {property_summary.condition && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Condition</h4>
            <p className="text-gray-600">{property_summary.condition}</p>
          </div>
        )}

        {property_summary.highlights.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">✨ Highlights</h4>
            <ul className="space-y-1">
              {property_summary.highlights.map((highlight, idx) => (
                <li key={idx} className="text-green-700 text-sm flex items-start">
                  <span className="mr-2">•</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {property_summary.concerns.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">⚠️ Concerns</h4>
            <ul className="space-y-1">
              {property_summary.concerns.map((concern, idx) => (
                <li key={idx} className="text-amber-700 text-sm flex items-start">
                  <span className="mr-2">•</span>
                  <span>{concern}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Comprehensive Analysis */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">Comprehensive Analysis</h3>
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 whitespace-pre-line">{analysisText}</p>
        </div>
      </div>

      {/* Key Insights */}
      {insights.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Key Insights & Recommendations</h3>
          <div className="space-y-3">
            {insights.map((insight, idx) => (
              <div
                key={idx}
                className="flex items-start p-3 bg-blue-50 rounded-lg border border-blue-100"
              >
                <div className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-gray-700 text-sm">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
