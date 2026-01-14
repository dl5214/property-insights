'use client'

import { useEffect } from 'react'
import { PropertySearchResult, PropertyAnalysis } from '@/lib/types'
import { PropertyApiClient } from '@/lib/api'
import DataSourcesView from './DataSourcesView'
import ConflictResolutionView from './ConflictResolutionView'
import InsightsView from './InsightsView'

interface AnalysisReportProps {
  property: PropertySearchResult
  analysis: PropertyAnalysis | null
  isAnalyzing: boolean
  onAnalysisStart: () => void
  onAnalysisComplete: (analysis: PropertyAnalysis) => void
}

export default function AnalysisReport({
  property,
  analysis,
  isAnalyzing,
  onAnalysisStart,
  onAnalysisComplete
}: AnalysisReportProps) {
  
  useEffect(() => {
    if (!analysis && !isAnalyzing) {
      startAnalysis()
    }
  }, [property.id])

  const startAnalysis = async () => {
    onAnalysisStart()
    
    try {
      const result = await PropertyApiClient.analyzeProperty(property.id)
      onAnalysisComplete(result)
    } catch (err) {
      console.error('Analysis failed:', err)
      onAnalysisComplete(null as any)
    }
  }

  if (isAnalyzing) {
    return (
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-6"></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Analyzing Property...</h3>
              <p className="text-gray-600 mb-6">
                Fetching data from multiple sources and resolving conflicts
              </p>
              <div className="space-y-3 text-sm text-gray-500">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"></div>
                  <span>Querying Zillow, Redfin, and Public Records</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse animation-delay-200"></div>
                  <span>Identifying data conflicts and inconsistencies</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse animation-delay-400"></div>
                  <span>Generating AI-powered insights</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-gray-600">Failed to analyze property. Please try again.</p>
          </div>
        </div>
      </div>
    )
  }

  const confidenceColor = 
    analysis.confidence_score >= 0.8 ? 'text-green-600' :
    analysis.confidence_score >= 0.6 ? 'text-yellow-600' :
    'text-red-600'

  const confidenceBg = 
    analysis.confidence_score >= 0.8 ? 'bg-green-600' :
    analysis.confidence_score >= 0.6 ? 'bg-yellow-600' :
    'bg-red-600'

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Property Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{analysis.address}</h2>
              <p className="text-gray-600">Property ID: {analysis.property_id}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Data Confidence</div>
              <div className={`text-3xl font-bold ${confidenceColor}`}>
                {(analysis.confidence_score * 100).toFixed(0)}%
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${confidenceBg}`}
                style={{ width: `${analysis.confidence_score * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Data Sources */}
        <DataSourcesView sources={analysis.data_sources} />

        {/* Conflict Resolution */}
        <ConflictResolutionView resolution={analysis.conflict_resolution} />

        {/* Unified Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Unified Property Summary</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {analysis.property_summary.price && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Price</div>
                <div className="text-2xl font-bold text-gray-900">
                  ${analysis.property_summary.price.toLocaleString()}
                </div>
              </div>
            )}
            
            {analysis.property_summary.bedrooms && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Bedrooms</div>
                <div className="text-2xl font-bold text-gray-900">
                  {analysis.property_summary.bedrooms}
                </div>
              </div>
            )}
            
            {analysis.property_summary.bathrooms && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Bathrooms</div>
                <div className="text-2xl font-bold text-gray-900">
                  {analysis.property_summary.bathrooms}
                </div>
              </div>
            )}
            
            {analysis.property_summary.square_feet && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Square Feet</div>
                <div className="text-2xl font-bold text-gray-900">
                  {analysis.property_summary.square_feet.toLocaleString()}
                </div>
              </div>
            )}
            
            {analysis.property_summary.year_built && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Year Built</div>
                <div className="text-2xl font-bold text-gray-900">
                  {analysis.property_summary.year_built}
                </div>
              </div>
            )}
            
            {analysis.property_summary.property_type && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Type</div>
                <div className="text-xl font-bold text-gray-900">
                  {analysis.property_summary.property_type}
                </div>
              </div>
            )}
          </div>

          {analysis.property_summary.highlights.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">✨ Highlights</h4>
              <ul className="space-y-1">
                {analysis.property_summary.highlights.map((highlight, idx) => (
                  <li key={idx} className="text-green-700 text-sm flex items-start">
                    <span className="mr-2">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.property_summary.concerns.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">⚠️ Concerns</h4>
              <ul className="space-y-1">
                {analysis.property_summary.concerns.map((concern, idx) => (
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
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Comprehensive Analysis</h3>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{analysis.analysis}</p>
          </div>
        </div>

        {/* Insights */}
        <InsightsView insights={analysis.insights} />
      </div>
    </div>
  )
}
