"""Property analysis API routes"""

from fastapi import APIRouter, HTTPException, status
from app.models.property import PropertyInput, PropertyAnalysis
from app.services.property_service import PropertyService

router = APIRouter()


@router.post(
    "/analyze",
    response_model=PropertyAnalysis,
    status_code=status.HTTP_200_OK,
    summary="Analyze property information",
    description="Submit property information and receive comprehensive AI-powered analysis"
)
async def analyze_property(property_data: PropertyInput):
    """
    Analyze property information and generate insights.
    
    This endpoint:
    1. Extracts and structures property information
    2. Generates comprehensive analysis using AI
    3. Provides actionable insights and recommendations
    4. Returns confidence score based on data completeness
    """
    
    if not any([
        property_data.address,
        property_data.price,
        property_data.description
    ]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide at least one of: address, price, or description"
        )
    
    try:
        service = PropertyService()
        result = await service.analyze_property(property_data)
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
