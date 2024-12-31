from fastapi import FastAPI, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from app.models import OptimizationOverlapRequest, OptimizationOverlapResponse, Performance, OptimizationManualRequest, OptimizationManualResponse
from app.optimizer import optimize_setlist, optimize_setlist_manual
from openpyxl import load_workbook
from typing import List
import io, os

app = FastAPI()

origins = ["http://localhost:3000",]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/optimize/overlap")
async def optimize_overlap(request: OptimizationOverlapRequest):
    try:
        print(request)
        performancesName, overlap_costs, total_costs = optimize_setlist(request.performancesName, request.costs)
        return OptimizationOverlapResponse(
            performancesName=performancesName,
            overlap_costs=overlap_costs,
            total_costs=total_costs
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/optimize/manual")
async def optimize_manual(request: OptimizationManualRequest):
    try:
        print(request)
        performancesName, overlap_costs, total_costs, detail = optimize_setlist_manual(request.performances)
        return OptimizationManualResponse(
            performancesName=performancesName,
            overlap_costs=overlap_costs,
            total_costs=total_costs,
            detail=detail
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# @app.post("/api/optimize/xlsx")