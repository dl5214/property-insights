'use client'

interface InsightsViewProps {
  insights: string[]
}

export default function InsightsView({ insights }: InsightsViewProps) {
  if (insights.length === 0) return null

  return (
    <div className="bg-gradient-to-br from-primary-50 to-indigo-50 rounded-2xl shadow-lg p-6 border-2 border-primary-200">
      <div className="flex items-center space-x-2 mb-4">
        <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <h3 className="text-2xl font-bold text-gray-900">Key Insights & Recommendations</h3>
      </div>
      
      <div className="space-y-3">
        {insights.map((insight, idx) => (
          <div
            key={idx}
            className="flex items-start p-4 bg-white rounded-lg border-2 border-primary-200 hover:border-primary-400 transition-colors"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-0.5">
              {idx + 1}
            </div>
            <p className="text-gray-800 leading-relaxed flex-1">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
