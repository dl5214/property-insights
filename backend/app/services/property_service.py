"""Property analysis service with multi-source data integration"""

from typing import Dict, Any, List, Tuple
from app.models.property import (
    PropertyAnalysis,
    DataSourceInfo,
    FieldAnalysis,
    ConflictResolution,
    PropertySummary
)
from app.services.llm_service import LLMService
from app.data import get_property_data_from_sources, get_property_by_id


class PropertyService:
    """Service for analyzing property information from multiple sources"""
    
    def __init__(self):
        self.llm_service = LLMService()
    
    def _extract_field_values(self, sources: List[Dict[str, Any]], field: str) -> List[Tuple[str, Any]]:
        """Extract all values for a field from different sources"""
        values = []
        for source in sources:
            if field in source and source[field] is not None:
                values.append((source['source'], source[field]))
        return values
    
    def _format_sources_for_llm(self, sources: List[Dict[str, Any]]) -> str:
        """Format multiple data sources for LLM prompt"""
        formatted = []
        
        for source in sources:
            source_text = [f"SOURCE: {source.get('source', 'Unknown')}"]
            
            if source.get('price'):
                source_text.append(f"  Price: ${source['price']:,.0f}")
            else:
                source_text.append(f"  Price: [MISSING]")
            
            if source.get('bedrooms'):
                source_text.append(f"  Bedrooms: {source['bedrooms']}")
            else:
                source_text.append(f"  Bedrooms: [MISSING]")
            
            if source.get('bathrooms'):
                source_text.append(f"  Bathrooms: {source['bathrooms']}")
            else:
                source_text.append(f"  Bathrooms: [MISSING]")
            
            if source.get('square_feet'):
                source_text.append(f"  Square Feet: {source['square_feet']:,.0f}")
            else:
                source_text.append(f"  Square Feet: [MISSING]")
            
            if source.get('year_built'):
                source_text.append(f"  Year Built: {source['year_built']}")
            else:
                source_text.append(f"  Year Built: [MISSING]")
            
            if source.get('lot_size'):
                source_text.append(f"  Lot Size: {source['lot_size']:,.0f} sqft")
            else:
                source_text.append(f"  Lot Size: [MISSING]")
            
            if source.get('property_type'):
                source_text.append(f"  Property Type: {source['property_type']}")
            
            if source.get('description'):
                source_text.append(f"  Description: {source['description']}")
            
            if source.get('last_updated'):
                source_text.append(f"  Last Updated: {source['last_updated']}")
            
            formatted.append('\n'.join(source_text))
        
        return '\n\n'.join(formatted)
    
    async def _resolve_conflicts_with_llm(
        self, 
        sources: List[Dict[str, Any]],
        address: str
    ) -> ConflictResolution:
        """Use LLM to analyze conflicts and recommend values"""
        
        sources_text = self._format_sources_for_llm(sources)
        
        prompt = f"""You are analyzing property data from multiple sources for: {address}

The data has inconsistencies, conflicts, and missing information. Your task is to:
1. Identify all conflicts (where sources disagree)
2. Determine the most reliable value for each field with reasoning
3. List missing critical information
4. Provide an overall assessment

DATA FROM SOURCES:
{sources_text}

Provide a JSON response with this structure:
{{
    "field_analyses": [
        {{
            "field_name": "price",
            "values": [1250000, 1295000, 1180000],
            "conflicts": true,
            "recommended_value": 1295000,
            "confidence": 0.85,
            "reasoning": "Redfin data is most recent (2024-01-20) and typically more accurate. Zillow slightly lower, public records are tax assessments which are usually conservative."
        }}
    ],
    "missing_fields": ["lot_size"],
    "conflict_summary": "Brief summary of major conflicts and concerns",
    "overall_confidence": 0.75
}}

Analyze ALL key fields: price, bedrooms, bathrooms, square_feet, year_built, lot_size, property_type."""

        try:
            result = await self.llm_service.generate_structured(
                prompt=prompt,
                temperature=0.3
            )
            
            # Parse field analyses
            field_analyses = []
            for fa in result.get('field_analyses', []):
                field_analyses.append(FieldAnalysis(
                    field_name=fa.get('field_name', ''),
                    values=fa.get('values', []),
                    conflicts=fa.get('conflicts', False),
                    recommended_value=fa.get('recommended_value'),
                    confidence=fa.get('confidence', 0.5),
                    reasoning=fa.get('reasoning', '')
                ))
            
            return ConflictResolution(
                field_analyses=field_analyses,
                overall_confidence=result.get('overall_confidence', 0.5),
                missing_fields=result.get('missing_fields', []),
                conflict_summary=result.get('conflict_summary', '')
            )
            
        except Exception as e:
            # Fallback: basic conflict detection
            return self._basic_conflict_resolution(sources)
    
    def _basic_conflict_resolution(self, sources: List[Dict[str, Any]]) -> ConflictResolution:
        """Fallback conflict resolution without LLM"""
        
        field_analyses = []
        missing_fields = []
        
        # Check key fields
        for field in ['price', 'bedrooms', 'bathrooms', 'square_feet', 'year_built']:
            values = self._extract_field_values(sources, field)
            
            if not values:
                missing_fields.append(field)
                continue
            
            unique_values = list(set([v[1] for v in values]))
            has_conflict = len(unique_values) > 1
            
            # Simple strategy: pick most common value, or most recent
            recommended = unique_values[0] if unique_values else None
            
            field_analyses.append(FieldAnalysis(
                field_name=field,
                values=unique_values,
                conflicts=has_conflict,
                recommended_value=recommended,
                confidence=0.6 if has_conflict else 0.9,
                reasoning="Fallback resolution: using most recent source"
            ))
        
        return ConflictResolution(
            field_analyses=field_analyses,
            overall_confidence=0.6,
            missing_fields=missing_fields,
            conflict_summary="Basic conflict detection applied (LLM analysis failed)"
        )
    
    async def _generate_unified_summary(
        self,
        conflict_resolution: ConflictResolution,
        sources: List[Dict[str, Any]],
        address: str
    ) -> PropertySummary:
        """Generate unified property summary with LLM"""
        
        # Extract recommended values
        recommended_data = {}
        for fa in conflict_resolution.field_analyses:
            if fa.recommended_value is not None:
                recommended_data[fa.field_name] = fa.recommended_value
        
        # Combine all descriptions
        descriptions = [s.get('description', '') for s in sources if s.get('description')]
        combined_description = ' | '.join(descriptions)
        
        sources_text = self._format_sources_for_llm(sources)
        conflicts_text = conflict_resolution.conflict_summary
        
        prompt = f"""Based on the analyzed property data for {address}, create a unified summary.

RESOLVED DATA:
{recommended_data}

ORIGINAL SOURCES:
{sources_text}

CONFLICTS IDENTIFIED:
{conflicts_text}

Provide a JSON response:
{{
    "key_features": ["list of main confirmed features"],
    "property_type": "final property type",
    "condition": "estimated condition based on descriptions and age",
    "highlights": ["strengths and positive aspects"],
    "concerns": ["data quality issues, conflicts, missing info, property concerns"]
}}

Be critical about data quality. Flag conflicts and missing information as concerns."""

        try:
            result = await self.llm_service.generate_structured(
                prompt=prompt,
                temperature=0.4
            )
            
            return PropertySummary(
                price=recommended_data.get('price'),
                bedrooms=recommended_data.get('bedrooms'),
                bathrooms=recommended_data.get('bathrooms'),
                square_feet=recommended_data.get('square_feet'),
                year_built=recommended_data.get('year_built'),
                lot_size=recommended_data.get('lot_size'),
                property_type=result.get('property_type'),
                key_features=result.get('key_features', []),
                condition=result.get('condition'),
                highlights=result.get('highlights', []),
                concerns=result.get('concerns', [])
            )
            
        except Exception:
            # Fallback summary
            return PropertySummary(
                price=recommended_data.get('price'),
                bedrooms=recommended_data.get('bedrooms'),
                bathrooms=recommended_data.get('bathrooms'),
                square_feet=recommended_data.get('square_feet'),
                year_built=recommended_data.get('year_built'),
                property_type=sources[0].get('property_type') if sources else None,
                key_features=[],
                concerns=["Unable to generate detailed summary"]
            )
    
    async def _generate_comprehensive_analysis(
        self,
        property_summary: PropertySummary,
        conflict_resolution: ConflictResolution,
        address: str
    ) -> str:
        """Generate comprehensive analysis including data quality assessment"""
        
        system_prompt = """You are a real estate analyst specializing in data quality and property evaluation.
Focus on:
- Assessing data reliability and conflicts
- Property value and market positioning  
- Critical missing information
- Recommendations for further investigation
- Overall property assessment

Be transparent about data quality issues."""

        prompt = f"""Provide a comprehensive analysis for this property: {address}

UNIFIED PROPERTY DATA:
- Price: ${property_summary.price:,.0f}" if property_summary.price else "[DATA CONFLICT]"}
- Bedrooms: {property_summary.bedrooms or "[MISSING]"}
- Bathrooms: {property_summary.bathrooms or "[MISSING]"}
- Square Feet: {property_summary.square_feet or "[MISSING]"}
- Year Built: {property_summary.year_built or "[MISSING]"}
- Type: {property_summary.property_type or "[MISSING]"}

DATA QUALITY:
- Overall Confidence: {conflict_resolution.overall_confidence:.0%}
- Conflicts Found: {len([fa for fa in conflict_resolution.field_analyses if fa.conflicts])}
- Missing Fields: {', '.join(conflict_resolution.missing_fields) if conflict_resolution.missing_fields else 'None'}
- Conflict Summary: {conflict_resolution.conflict_summary}

Your analysis should:
1. Assess the reliability of the available data
2. Evaluate the property based on confirmed information
3. Highlight what's missing and why it matters
4. Provide actionable recommendations
5. Give an honest assessment of whether there's enough good data to make a decision

Write 3-4 clear paragraphs."""

        try:
            analysis = await self.llm_service.generate(
                prompt=prompt,
                system_prompt=system_prompt,
                temperature=0.7
            )
            return analysis
        except Exception as e:
            return f"Error generating analysis: {str(e)}"
    
    async def _generate_insights(
        self,
        property_summary: PropertySummary,
        conflict_resolution: ConflictResolution,
        analysis: str
    ) -> List[str]:
        """Generate key actionable insights"""
        
        prompt = f"""Based on this property analysis, provide 4-6 key actionable insights.

PROPERTY SUMMARY:
Price: {property_summary.price}
Type: {property_summary.property_type}
Confidence: {conflict_resolution.overall_confidence:.0%}

ANALYSIS:
{analysis}

Provide ONLY a JSON array of insights:
["insight 1", "insight 2", "insight 3", ...]

Focus on:
- Data verification steps needed
- Critical missing information to obtain
- Property evaluation recommendations  
- Risk factors to investigate"""

        try:
            result = await self.llm_service.generate(
                prompt=prompt,
                temperature=0.5
            )
            
            # Parse JSON array
            import json
            start = result.find('[')
            end = result.rfind(']') + 1
            if start != -1 and end > start:
                json_str = result[start:end]
                insights = json.loads(json_str)
                return insights if isinstance(insights, list) else []
            
            # Fallback: split by lines
            lines = [line.strip() for line in result.split('\n') if line.strip()]
            return [line.lstrip('•-*123456789. ') for line in lines if line][:6]
            
        except Exception:
            return [
                "Verify conflicting data points with additional sources",
                "Obtain missing critical information before making decisions",
                "Schedule professional property inspection"
            ]
    
    async def analyze_property(self, property_id: str) -> PropertyAnalysis:
        """
        Analyze property from multiple data sources
        
        Args:
            property_id: Property ID
            
        Returns:
            Complete property analysis with conflict resolution
        """
        
        # Check LLM connection
        is_connected = await self.llm_service.check_connection()
        if not is_connected:
            raise Exception(
                "Cannot connect to Ollama. Please ensure Ollama is running."
            )
        
        # Get property basic info
        property_info = get_property_by_id(property_id)
        if not property_info:
            raise Exception(f"Property not found: {property_id}")
        
        address = property_info['address']
        
        # Fetch data from multiple sources
        raw_sources = get_property_data_from_sources(property_id)
        if not raw_sources:
            raise Exception(f"No data available for property: {property_id}")
        
        # Convert to DataSourceInfo models
        data_sources = [
            DataSourceInfo(**source, raw_data=source)
            for source in raw_sources
        ]
        
        # Resolve conflicts using LLM
        conflict_resolution = await self._resolve_conflicts_with_llm(raw_sources, address)
        
        # Generate unified summary
        property_summary = await self._generate_unified_summary(
            conflict_resolution, raw_sources, address
        )
        
        # Generate comprehensive analysis
        analysis = await self._generate_comprehensive_analysis(
            property_summary, conflict_resolution, address
        )
        
        # Generate insights
        insights = await self._generate_insights(
            property_summary, conflict_resolution, analysis
        )
        
        # Calculate confidence score
        confidence_score = conflict_resolution.overall_confidence
        
        return PropertyAnalysis(
            property_id=property_id,
            address=address,
            data_sources=data_sources,
            conflict_resolution=conflict_resolution,
            property_summary=property_summary,
            analysis=analysis,
            insights=insights,
            confidence_score=confidence_score
        )
