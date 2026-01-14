'use client'

import { useState, FormEvent } from 'react'
import { PropertyInput, PropertyAnalysis } from '@/lib/types'
import { PropertyApiClient } from '@/lib/api'

interface PropertyFormProps {
  onAnalysisComplete: (analysis: PropertyAnalysis) => void
  onAnalysisStart: () => void
  isLoading: boolean
}

export default function PropertyForm({ 
  onAnalysisComplete, 
  onAnalysisStart,
  isLoading 
}: PropertyFormProps) {
  const [formData, setFormData] = useState<PropertyInput>({
    address: '',
    price: undefined,
    bedrooms: undefined,
    bathrooms: undefined,
    square_feet: undefined,
    year_built: undefined,
    description: '',
  })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    onAnalysisStart()

    try {
      // Filter out empty values
      const cleanData: PropertyInput = {}
      if (formData.address) cleanData.address = formData.address
      if (formData.price) cleanData.price = formData.price
      if (formData.bedrooms) cleanData.bedrooms = formData.bedrooms
      if (formData.bathrooms) cleanData.bathrooms = formData.bathrooms
      if (formData.square_feet) cleanData.square_feet = formData.square_feet
      if (formData.year_built) cleanData.year_built = formData.year_built
      if (formData.description) cleanData.description = formData.description

      const result = await PropertyApiClient.analyzeProperty(cleanData)
      onAnalysisComplete(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      onAnalysisComplete(null as any)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? undefined : 
              ['price', 'bedrooms', 'bathrooms', 'square_feet', 'year_built'].includes(name)
                ? Number(value)
                : value
    }))
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Property Information</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Address */}
        <div>
          <label htmlFor="address" className="label">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address || ''}
            onChange={handleChange}
            className="input-field"
            placeholder="123 Main St, City, State"
            disabled={isLoading}
          />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="label">
            Price ($)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price || ''}
            onChange={handleChange}
            className="input-field"
            placeholder="500000"
            min="0"
            disabled={isLoading}
          />
        </div>

        {/* Bedrooms & Bathrooms */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="bedrooms" className="label">
              Bedrooms
            </label>
            <input
              type="number"
              id="bedrooms"
              name="bedrooms"
              value={formData.bedrooms || ''}
              onChange={handleChange}
              className="input-field"
              placeholder="3"
              min="0"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="bathrooms" className="label">
              Bathrooms
            </label>
            <input
              type="number"
              id="bathrooms"
              name="bathrooms"
              value={formData.bathrooms || ''}
              onChange={handleChange}
              className="input-field"
              placeholder="2"
              min="0"
              step="0.5"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Square Feet & Year Built */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="square_feet" className="label">
              Square Feet
            </label>
            <input
              type="number"
              id="square_feet"
              name="square_feet"
              value={formData.square_feet || ''}
              onChange={handleChange}
              className="input-field"
              placeholder="1800"
              min="0"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="year_built" className="label">
              Year Built
            </label>
            <input
              type="number"
              id="year_built"
              name="year_built"
              value={formData.year_built || ''}
              onChange={handleChange}
              className="input-field"
              placeholder="2005"
              min="1800"
              max="2030"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            className="input-field min-h-[120px] resize-y"
            placeholder="Beautiful modern home with updated kitchen and bathrooms. Close to parks and public transportation..."
            disabled={isLoading}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Property'}
        </button>

        <p className="text-xs text-gray-500 text-center">
          Provide at least one field to get started. More information = better insights!
        </p>
      </form>
    </div>
  )
}
