"""Ollama LLM integration service"""

import httpx
import json
from typing import Optional, Dict, Any
from app.config import settings


class LLMService:
    """Service for interacting with Ollama LLM"""
    
    def __init__(self):
        self.base_url = settings.ollama_host
        self.model = settings.ollama_model
        self.timeout = 120.0  # 2 minutes timeout for generation
    
    async def generate(
        self, 
        prompt: str, 
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None
    ) -> str:
        """
        Generate text using Ollama
        
        Args:
            prompt: The user prompt
            system_prompt: Optional system prompt
            temperature: Sampling temperature (0.0 to 1.0)
            max_tokens: Maximum tokens to generate
            
        Returns:
            Generated text response
        """
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                payload = {
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": temperature,
                    }
                }
                
                if system_prompt:
                    payload["system"] = system_prompt
                
                if max_tokens:
                    payload["options"]["num_predict"] = max_tokens
                
                response = await client.post(
                    f"{self.base_url}/api/generate",
                    json=payload
                )
                response.raise_for_status()
                
                result = response.json()
                return result.get("response", "")
                
        except httpx.TimeoutException:
            raise Exception(f"LLM request timed out after {self.timeout} seconds")
        except httpx.HTTPError as e:
            raise Exception(f"LLM request failed: {str(e)}")
        except Exception as e:
            raise Exception(f"Unexpected error in LLM service: {str(e)}")
    
    async def generate_structured(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.3
    ) -> Dict[str, Any]:
        """
        Generate structured JSON response
        
        Args:
            prompt: The user prompt
            system_prompt: Optional system prompt
            temperature: Lower temperature for more consistent structured output
            
        Returns:
            Parsed JSON response
        """
        response = await self.generate(
            prompt=prompt,
            system_prompt=system_prompt,
            temperature=temperature
        )
        
        try:
            # Try to extract JSON from response
            # Sometimes LLM adds extra text before/after JSON
            start = response.find('{')
            end = response.rfind('}') + 1
            if start != -1 and end > start:
                json_str = response[start:end]
                return json.loads(json_str)
            else:
                return json.loads(response)
        except json.JSONDecodeError:
            # If parsing fails, return raw response in a dict
            return {"raw_response": response}
    
    async def check_connection(self) -> bool:
        """
        Check if Ollama is running and accessible
        
        Returns:
            True if connection is successful
        """
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{self.base_url}/api/tags")
                return response.status_code == 200
        except Exception:
            return False
