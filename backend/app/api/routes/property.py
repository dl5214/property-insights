"""Property analysis API routes"""

from fastapi import APIRouter, HTTPException, status, Query
from typing import List
from app.models.property import PropertyAnalysis, PropertySearchResult
from app.services.property_service import PropertyService
from app.data import search_properties

router = APIRouter()


@router.get(
    "/search",
    response_model=List[PropertySearchResult],
    status_code=status.HTTP_200_OK,
    summary="Search for properties",
    description="Search properties by address, city, or zip code"
)
async def search_for_properties(
    q: str = Query("", description="Search query (address, city, or zip)")
):
    """
    Search for properties in the database.
    
    Returns a list of properties matching the search query.
    """
    try:
        results = search_properties(q)
        return [PropertySearchResult(**prop) for prop in results]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get(
    "/{property_id}/analyze",
    response_model=PropertyAnalysis,
    status_code=status.HTTP_200_OK,
    summary="Analyze property from multiple sources",
    description="Fetch data from multiple sources, resolve conflicts, and generate comprehensive analysis"
)
async def analyze_property(property_id: str):
    """
    Analyze property information from multiple data sources.
    
    This endpoint:
    1. Fetches data from multiple sources (Zillow, Redfin, Public Records)
    2. Identifies conflicts and inconsistencies
    3. Uses AI to resolve conflicts and determine reliable values
    4. Generates comprehensive analysis with data quality assessment
    5. Provides actionable insights and recommendations
    """
    
    try:
        service = PropertyService()
        result = await service.analyze_property(property_id)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@router.get("/health")
async def health_check():
    """Check if property service and LLM are available"""
    
    from app.services.llm_service import LLMService
    
    llm_service = LLMService()
    is_connected = await llm_service.check_connection()
    
    return {
        "service": "property",
        "status": "healthy" if is_connected else "degraded",
        "llm_available": is_connected
    }
