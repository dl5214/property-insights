"""Property data models"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, List, Any


class PropertySearchResult(BaseModel):
    """Property search result"""
    
    id: str
    address: str
    city: str
    state: str
    zip: str
    image_url: Optional[str] = None


class DataSourceInfo(BaseModel):
    """Information from a single data source"""
    
    source: str
    price: Optional[float] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[float] = None
    square_feet: Optional[float] = None
    year_built: Optional[int] = None
    lot_size: Optional[float] = None
    property_type: Optional[str] = None
    description: Optional[str] = None
    last_updated: Optional[str] = None
    raw_data: Dict[str, Any] = Field(default_factory=dict)


class FieldAnalysis(BaseModel):
    """Analysis of a specific field across sources"""
    
    field_name: str
    values: List[Any]  # Different values from different sources
    conflicts: bool
    recommended_value: Any
    confidence: float  # 0-1
    reasoning: str


class ConflictResolution(BaseModel):
    """Resolution of data conflicts"""
    
    field_analyses: List[FieldAnalysis]
    overall_confidence: float
    missing_fields: List[str]
    conflict_summary: str


class PropertySummary(BaseModel):
    """Unified property summary after conflict resolution"""
    
    price: Optional[float] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[float] = None
    square_feet: Optional[float] = None
    year_built: Optional[int] = None
    lot_size: Optional[float] = None
    property_type: Optional[str] = None
    key_features: List[str] = Field(default_factory=list)
    condition: Optional[str] = None
    highlights: List[str] = Field(default_factory=list)
    concerns: List[str] = Field(default_factory=list)


class PropertyAnalysis(BaseModel):
    """Complete property analysis from multiple sources"""
    
    property_id: str
    address: str
    
    # Raw data from sources
    data_sources: List[DataSourceInfo]
    
    # Conflict resolution
    conflict_resolution: ConflictResolution
    
    # Unified summary
    property_summary: PropertySummary
    
    # AI-generated insights
    analysis: str = Field(description="Comprehensive analysis text")
    insights: List[str] = Field(
        default_factory=list,
        description="Key insights and recommendations"
    )
    
    confidence_score: float = Field(
        default=0.0,
        description="Overall confidence score (0-1)",
        ge=0.0,
        le=1.0
    )
