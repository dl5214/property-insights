'use client'

import { ConflictResolution } from '@/lib/types'

interface ConflictResolutionViewProps {
  resolution: ConflictResolution
}

export default function ConflictResolutionView({ resolution }: ConflictResolutionViewProps) {
  const conflictingFields = resolution.field_analyses.filter(fa => fa.conflicts)
  const hasConflicts = conflictingFields.length > 0

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">

      {resolution.conflict_summary && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded text-sm text-amber-900">
          {resolution.conflict_summary}
        </div>
      )}

      {hasConflicts ? (
        <div className="space-y-3">
          {conflictingFields.map((field, idx) => (
            <div key={idx} className="border border-amber-200 rounded-lg p-3 bg-amber-50">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900 capitalize text-sm mb-1">
                    {field.field_name.replace('_', ' ')}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-600">Conflicting values:</span>
                    <div className="flex flex-wrap gap-1">
                      {field.values.map((val, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-white border border-amber-300 rounded text-xs font-medium text-gray-900"
                        >
                          {typeof val === 'number' && field.field_name === 'price' 
                            ? `$${val.toLocaleString()}`
                            : val}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-600">
                    {(field.confidence * 100).toFixed(0)}% confidence
                  </div>
                </div>
              </div>

              <div className="mb-2 p-2 bg-white rounded border border-green-200">
                <div className="text-xs font-semibold text-green-700">AI Recommended</div>
                <div className="text-lg font-bold text-gray-900">
                  {typeof field.recommended_value === 'number' && field.field_name === 'price'
                    ? `$${field.recommended_value.toLocaleString()}`
                    : field.recommended_value}
                </div>
              </div>

              <div className="text-xs text-gray-700">
                <span className="font-semibold">Reasoning:</span> {field.reasoning}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <svg className="w-16 h-16 text-green-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600 font-medium">No major conflicts detected</p>
          <p className="text-sm text-gray-500 mt-1">Data sources are consistent</p>
        </div>
      )}

      {resolution.missing_fields.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Missing Information</h4>
          <div className="flex flex-wrap gap-2">
            {resolution.missing_fields.map((field, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-700"
              >
                {field.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
