from pydantic import BaseModel
from typing import List

class OptimizationRequest(BaseModel):
    performancesName: List[str]
    costs: List[List[int]]

class OptimizationResponse(BaseModel):
    performancesName: List[str]
    overlap_costs: List[int]
    total_costs: List[int]