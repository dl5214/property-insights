'use client'

import { useState } from 'react'
import SearchSection from '@/components/SearchSection'
import AnalysisReport from '@/components/AnalysisReport'
import { PropertySearchResult, PropertyAnalysis } from '@/lib/types'

export default function Home() {
  const [selectedProperty, setSelectedProperty] = useState<PropertySearchResult | null>(null)
  const [analysis, setAnalysis] = useState<PropertyAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handlePropertySelect = (property: PropertySearchResult) => {
    setSelectedProperty(property)
    setAnalysis(null)
    setIsAnalyzing(false)
  }

  const handleAnalysisComplete = (result: PropertyAnalysis) => {
    setAnalysis(result)
    setIsAnalyzing(false)
  }

  const handleAnalysisStart = () => {
    setIsAnalyzing(true)
    setAnalysis(null)
  }

  const handleBackToSearch = () => {
    setSelectedProperty(null)
    setAnalysis(null)
    setIsAnalyzing(false)
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Property Insights</h1>
                <p className="text-sm text-gray-500">AI-Powered Data Integration</p>
              </div>
            </div>
            {(selectedProperty || analysis) && (
              <button
                onClick={handleBackToSearch}
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Search</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      {!selectedProperty && !analysis ? (
        <SearchSection onPropertySelect={handlePropertySelect} />
      ) : (
        <AnalysisReport
          property={selectedProperty!}
          analysis={analysis}
          isAnalyzing={isAnalyzing}
          onAnalysisStart={handleAnalysisStart}
          onAnalysisComplete={handleAnalysisComplete}
        />
      )}

      {/* Footer */}
      <div className="bg-gray-50 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p className="mb-2">
              <strong>Powered by local AI (Ollama)</strong> • Your data stays private
            </p>
            <p className="text-xs">
              This system integrates data from multiple sources, identifies conflicts, and uses AI to provide reliable property insights.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
