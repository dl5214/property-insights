'use client'

import { useState } from 'react'
import PropertyForm from '@/components/PropertyForm'
import InsightReport from '@/components/InsightReport'
import { PropertyAnalysis } from '@/lib/types'

export default function Home() {
  const [analysis, setAnalysis] = useState<PropertyAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAnalysisComplete = (result: PropertyAnalysis) => {
    setAnalysis(result)
    setIsLoading(false)
  }

  const handleAnalysisStart = () => {
    setIsLoading(true)
    setAnalysis(null)
  }

  const handleReset = () => {
    setAnalysis(null)
    setIsLoading(false)
  }

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Property Insights
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI-powered real estate analysis to help you make confident property decisions
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <PropertyForm 
              onAnalysisComplete={handleAnalysisComplete}
              onAnalysisStart={handleAnalysisStart}
              isLoading={isLoading}
            />
          </div>

          {/* Results */}
          <div className="space-y-6">
            {isLoading && (
              <div className="card">
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Analyzing property...</p>
                  </div>
                </div>
              </div>
            )}

            {analysis && !isLoading && (
              <>
                <InsightReport analysis={analysis} />
                <button
                  onClick={handleReset}
                  className="w-full py-3 px-6 border-2 border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
                >
                  Analyze Another Property
                </button>
              </>
            )}

            {!analysis && !isLoading && (
              <div className="card">
                <div className="text-center py-12 text-gray-500">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <p>Enter property information to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-gray-500">
          <p>Powered by local AI (Ollama) • Your data stays private</p>
        </div>
      </div>
    </main>
  )
}
