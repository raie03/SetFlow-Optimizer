from fastapi import FastAPI, HTTPException
from app.models import OptimizationRequest, OptimizationResponse
from app.optimizer import optimize_setlist

app = FastAPI()

@app.post("/api/optimize")
async def optimize(request: OptimizationRequest):
    try:
        tour, overlap_costs, total_costs = optimize_setlist(request.costs)
        return OptimizationResponse(
            tour=tour,
            overlap_costs=overlap_costs,
            total_costs=total_costs
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))