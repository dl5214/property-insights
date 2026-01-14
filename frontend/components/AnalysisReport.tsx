'use client'

import { useEffect, useState } from 'react'
import { PropertySearchResult, PropertyAnalysis, DataSourceInfo } from '@/lib/types'
import { PropertyApiClient } from '@/lib/api'
import { get_property_data_from_sources } from '@/lib/mockData'
import UnifiedSummary from './UnifiedSummary'
import DataSourcesView from './DataSourcesView'
import ConflictResolutionView from './ConflictResolutionView'

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
  const [rawSources, setRawSources] = useState<DataSourceInfo[]>([])
  const [showRawData, setShowRawData] = useState(false)
  const [showConflicts, setShowConflicts] = useState(false)
  const [showInsights, setShowInsights] = useState(false)
  
  useEffect(() => {
    // Immediately show raw data
    const sources = get_property_data_from_sources(property.id)
    setRawSources(sources)
    
    // Start AI analysis in background
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

  const conflictCount = analysis?.conflict_resolution.field_analyses.filter(fa => fa.conflicts).length || 0

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Property Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{property.address}</h2>
          <p className="text-sm text-gray-600">{property.city}, {property.state} {property.zip}</p>
        </div>

        {/* Unified Summary - THE MAIN PRODUCT */}
        {analysis ? (
          <UnifiedSummary 
            summary={analysis.property_summary}
            confidence={analysis.confidence_score}
            analysis={analysis.analysis}
            insights={analysis.insights}
            showInsights={showInsights}
            onToggleInsights={() => setShowInsights(!showInsights)}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              <h3 className="text-lg font-semibold text-gray-900">Generating AI Analysis...</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Integrating data from {rawSources.length} sources and resolving conflicts
            </p>
          </div>
        )}

        {/* Expandable Sections - Details for those who want to dig deeper */}
        <div className="space-y-3">
          {/* Raw Data Sources */}
          <button
            onClick={() => setShowRawData(!showRawData)}
            className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:border-primary-300 transition-colors text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-semibold text-gray-900">Raw Data from {rawSources.length} Sources</span>
                <span className="text-xs text-gray-500">(Click to {showRawData ? 'hide' : 'view'})</span>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${showRawData ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          
          {showRawData && rawSources.length > 0 && (
            <div className="pl-4">
              <DataSourcesView sources={rawSources} />
            </div>
          )}

          {/* Conflict Resolution */}
          {analysis && (
            <>
              <button
                onClick={() => setShowConflicts(!showConflicts)}
                className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:border-primary-300 transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="font-semibold text-gray-900">How AI Resolved Conflicts</span>
                    {conflictCount > 0 && (
                      <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                        {conflictCount} conflict{conflictCount > 1 ? 's' : ''}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">(Click to {showConflicts ? 'hide' : 'view'})</span>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${showConflicts ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {showConflicts && (
                <div className="pl-4">
                  <ConflictResolutionView resolution={analysis.conflict_resolution} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
