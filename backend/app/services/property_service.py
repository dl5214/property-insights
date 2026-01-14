"""Property analysis service"""

from typing import Dict, Any, List
from app.models.property import PropertyInput, PropertyAnalysis, PropertySummary
from app.services.llm_service import LLMService


class PropertyService:
    """Service for analyzing property information"""
    
    def __init__(self):
        self.llm_service = LLMService()
    
    def _build_property_context(self, property_data: PropertyInput) -> str:
        """Build a formatted context string from property data"""
        context_parts = []
        
        if property_data.address:
            context_parts.append(f"Address: {property_data.address}")
        
        if property_data.price:
            context_parts.append(f"Price: ${property_data.price:,.2f}")
        
        if property_data.bedrooms:
            context_parts.append(f"Bedrooms: {property_data.bedrooms}")
        
        if property_data.bathrooms:
            context_parts.append(f"Bathrooms: {property_data.bathrooms}")
        
        if property_data.square_feet:
            context_parts.append(f"Square Feet: {property_data.square_feet:,.0f}")
        
        if property_data.year_built:
            context_parts.append(f"Year Built: {property_data.year_built}")
        
        if property_data.description:
            context_parts.append(f"\nDescription:\n{property_data.description}")
        
        if property_data.additional_info:
            context_parts.append("\nAdditional Information:")
            for key, value in property_data.additional_info.items():
                context_parts.append(f"- {key}: {value}")
        
        return "\n".join(context_parts)
    
    async def _extract_structured_info(self, property_data: PropertyInput) -> PropertySummary:
        """Extract structured information from property data"""
        
        context = self._build_property_context(property_data)
        
        prompt = f"""Based on the following property information, extract and organize the key details:

{context}

Please provide a JSON response with the following structure:
{{
    "key_features": ["list of main features like bedroom/bath count, size, etc."],
    "property_type": "type of property (e.g., Single Family, Condo, Townhouse)",
    "condition": "estimated condition (e.g., Well-maintained, Needs updates, New construction)",
    "highlights": ["positive aspects and selling points"],
    "concerns": ["potential concerns or areas to investigate"]
}}

Focus on being objective and identifying both positives and areas that need attention."""

        try:
            result = await self.llm_service.generate_structured(
                prompt=prompt,
                temperature=0.3
            )
            
            return PropertySummary(
                key_features=result.get("key_features", []),
                property_type=result.get("property_type"),
                condition=result.get("condition"),
                highlights=result.get("highlights", []),
                concerns=result.get("concerns", [])
            )
        except Exception as e:
            # Return basic summary if structured extraction fails
            return PropertySummary(
                key_features=[],
                highlights=["Unable to extract detailed analysis"],
                concerns=[f"Analysis error: {str(e)}"]
            )
    
    async def _generate_comprehensive_analysis(self, property_data: PropertyInput) -> str:
        """Generate comprehensive property analysis"""
        
        context = self._build_property_context(property_data)
        
        system_prompt = """You are a knowledgeable real estate analyst helping buyers make informed decisions. 
Provide clear, objective analysis focusing on:
- Property value and pricing
- Location and neighborhood factors
- Property condition and features
- Potential concerns or red flags
- Investment perspective

Be honest and balanced in your assessment."""

        prompt = f"""Please provide a comprehensive analysis of this property:

{context}

Your analysis should help a potential buyer understand:
1. What this property offers
2. Whether the price seems reasonable
3. Key factors to consider
4. Any concerns or questions to investigate further
5. Overall recommendation

Provide a well-structured analysis in clear paragraphs."""

        try:
            analysis = await self.llm_service.generate(
                prompt=prompt,
                system_prompt=system_prompt,
                temperature=0.7
            )
            return analysis
        except Exception as e:
            return f"Error generating analysis: {str(e)}"
    
    async def _generate_insights(self, property_data: PropertyInput, analysis: str) -> List[str]:
        """Generate key insights and recommendations"""
        
        context = self._build_property_context(property_data)
        
        prompt = f"""Based on this property information and analysis, provide 3-5 key actionable insights:

Property:
{context}

Analysis:
{analysis}

Provide ONLY a JSON array of insight strings, like:
["insight 1", "insight 2", "insight 3"]

Focus on actionable recommendations and important considerations for the buyer."""

        try:
            result = await self.llm_service.generate(
                prompt=prompt,
                temperature=0.5
            )
            
            # Try to parse as JSON array
            import json
            start = result.find('[')
            end = result.rfind(']') + 1
            if start != -1 and end > start:
                json_str = result[start:end]
                insights = json.loads(json_str)
                return insights if isinstance(insights, list) else []
            
            # Fallback: split by newlines and clean up
            lines = [line.strip() for line in result.split('\n') if line.strip()]
            insights = [line.lstrip('•-*123456789. ') for line in lines if line]
            return insights[:5]  # Limit to 5 insights
            
        except Exception:
            return ["Consider researching local market conditions", "Schedule a professional inspection"]
    
    def _calculate_confidence_score(self, property_data: PropertyInput) -> float:
        """Calculate confidence score based on available data"""
        
        total_fields = 7
        filled_fields = 0
        
        if property_data.address:
            filled_fields += 1
        if property_data.price is not None:
            filled_fields += 1
        if property_data.bedrooms is not None:
            filled_fields += 1
        if property_data.bathrooms is not None:
            filled_fields += 1
        if property_data.square_feet is not None:
            filled_fields += 1
        if property_data.year_built is not None:
            filled_fields += 1
        if property_data.description:
            filled_fields += 1
        
        base_score = filled_fields / total_fields
        
        # Boost score if description is substantial
        if property_data.description and len(property_data.description) > 100:
            base_score = min(1.0, base_score + 0.1)
        
        return round(base_score, 2)
    
    async def analyze_property(self, property_data: PropertyInput) -> PropertyAnalysis:
        """
        Analyze property information and generate comprehensive insights
        
        Args:
            property_data: Input property information
            
        Returns:
            Complete property analysis
        """
        
        # Check LLM connection
        is_connected = await self.llm_service.check_connection()
        if not is_connected:
            raise Exception(
                "Cannot connect to Ollama. Please ensure Ollama is running "
                "(check with 'ollama list' and 'ollama run llama3.2:latest')"
            )
        
        # Extract structured information
        property_summary = await self._extract_structured_info(property_data)
        
        # Generate comprehensive analysis
        analysis = await self._generate_comprehensive_analysis(property_data)
        
        # Generate actionable insights
        insights = await self._generate_insights(property_data, analysis)
        
        # Calculate confidence score
        confidence_score = self._calculate_confidence_score(property_data)
        
        return PropertyAnalysis(
            property_summary=property_summary,
            analysis=analysis,
            insights=insights,
            confidence_score=confidence_score,
            raw_input=property_data
        )
