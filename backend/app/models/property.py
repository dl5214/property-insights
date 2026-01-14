"""Property data models"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, List, Any


class PropertyInput(BaseModel):
    """Input model for property analysis"""
    
    address: Optional[str] = Field(None, description="Property address")
    price: Optional[float] = Field(None, description="Property price", ge=0)
    bedrooms: Optional[int] = Field(None, description="Number of bedrooms", ge=0)
    bathrooms: Optional[float] = Field(None, description="Number of bathrooms", ge=0)
    square_feet: Optional[float] = Field(None, description="Square footage", ge=0)
    year_built: Optional[int] = Field(None, description="Year built", ge=1800, le=2030)
    description: Optional[str] = Field(None, description="Property description")
    additional_info: Optional[Dict[str, Any]] = Field(
        default_factory=dict, 
        description="Any additional information"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "address": "123 Main St, San Francisco, CA 94102",
                "price": 1200000,
                "bedrooms": 3,
                "bathrooms": 2.5,
                "square_feet": 1800,
                "year_built": 2005,
                "description": "Beautiful modern home in prime location with updated kitchen and bathrooms. Close to parks and public transportation.",
                "additional_info": {
                    "parking": "2-car garage",
                    "lot_size": "5000 sqft"
                }
            }
        }


class PropertySummary(BaseModel):
    """Structured property summary"""
    
    key_features: List[str] = Field(default_factory=list)
    property_type: Optional[str] = None
    condition: Optional[str] = None
    highlights: List[str] = Field(default_factory=list)
    concerns: List[str] = Field(default_factory=list)


class PropertyAnalysis(BaseModel):
    """Output model for property analysis"""
    
    property_summary: PropertySummary
    analysis: str = Field(description="Comprehensive analysis text")
    insights: List[str] = Field(
        default_factory=list,
        description="Key insights and recommendations"
    )
    confidence_score: float = Field(
        default=0.0,
        description="Confidence score of the analysis (0-1)",
        ge=0.0,
        le=1.0
    )
    raw_input: PropertyInput
    
    class Config:
        json_schema_extra = {
            "example": {
                "property_summary": {
                    "key_features": ["3 bedrooms", "2.5 bathrooms", "1800 sqft"],
                    "property_type": "Single Family Home",
                    "condition": "Well-maintained",
                    "highlights": ["Modern updates", "Prime location"],
                    "concerns": ["Price above market average"]
                },
                "analysis": "This property offers excellent value...",
                "insights": [
                    "Property is competitively priced for the area",
                    "Recent renovations add significant value",
                    "Good investment potential"
                ],
                "confidence_score": 0.85
            }
        }
