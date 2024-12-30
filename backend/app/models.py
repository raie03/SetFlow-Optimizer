from pydantic import BaseModel
from typing import List

class OptimizationRequest(BaseModel):
    costs: List[List[int]]

class OptimizationResponse(BaseModel):
    tour: List[int]
    overlap_costs: List[int]
    total_costs: List[int]