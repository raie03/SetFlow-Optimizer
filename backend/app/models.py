from pydantic import BaseModel
from typing import List, Optional

class OptimizationOverlapRequest(BaseModel):
    performancesName: List[str]
    costs: List[List[int]]

class OptimizationOverlapResponse(BaseModel):
    performancesName: List[str]
    overlap_costs: List[int]
    total_costs: List[int]

class Performance(BaseModel):
    name: str
    performers: Optional[List[str]] = None

class OptimizationManualRequest(BaseModel):
    performances: List[Performance]

class OptimizationManualResponse(BaseModel):
    performancesName: List[str]
    overlap_costs: List[int]
    total_costs: List[int]
    detail: List[dict]