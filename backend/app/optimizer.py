import numpy as np
from typing import List
from app.models import Performance

def optimize_setlist(performancesName: List[str], costs: List[List[int]]):
    INF = 1 << 30
    n = len(costs)
    
    # Initialize DP table and route tracking
    dp = [[INF] * n for _ in range(1 << n)]
    route = [[INF] * n for _ in range(1 << n)]
    dp[0][0] = 0
    route[0][0] = 0
    
    # Dynamic programming
    for i in range(1 << n):
        for j in range(n):
            if ((i & (1 << j)) == 0) and (i != 0):
                continue
                
            for k in range(n):
                if ((i & (1 << k)) == 0) and (costs[j][k] < INF):
                    v = (i | (1 << k))
                    if dp[v][k] > dp[i][j] + costs[j][k]:
                        route[v][k] = j
                    dp[v][k] = min(dp[v][k], dp[i][j] + costs[j][k])
    
    # Reconstruct the optimal route
    tour = [0] * (n + 1)
    perfName = [""] * (n + 1)
    cost = [0] * n
    pos = 0
    b = (1 << n) - 1
    
    tour[0] = 0
    perfName[0] = performancesName[0]
    for i in range(n):
        tour[i + 1] = route[b][pos]
        perfName[i + 1] = performancesName[route[b][pos]]
        # print(tour)
        cost[i] = dp[b][pos]
        b = b ^ (1 << pos)
        pos = tour[i + 1]
    
    # Calculate overlap costs
    overlap_costs = []
    prev_cost = 0
    # for c in cost:
    #     print(c, prev_cost)
    #     overlap_costs.append(c - prev_cost)
    #     prev_cost = c
    for i in range(n-1, -1, -1):
        print(cost[i], prev_cost)
        overlap_costs.append(cost[i] - prev_cost)
        prev_cost = cost[i]
    
    print(perfName[:-1][::-1])
    print(tour[:-1][::-1])
    
    return perfName[:-1][::-1], overlap_costs, cost[::-1]

def calculate_costs(performances: List[Performance]):
    n = len(performances)
    costs = [[0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            if i != j:
                overlap = len(set(performances[i].performers or []) & set(performances[j].performers or []))
                costs[i][j] = overlap  # Higher overlap means higher cost
    return costs

def optimize_setlist_manual(performances: List[Performance]):
    performancesName = [p.name for p in performances]
    costs = calculate_costs(performances)
    print(performancesName)
    perfName, overlap_costs, cost = optimize_setlist(performancesName, costs)

    detail = []
    n = len(performances)
    # tour = [performancesName.index(name) for name in perfName[::-1]]
    tour = [performancesName.index(name) for name in perfName]

    for i in range(len(tour) - 1):
        current_members = set(performances[tour[i]].performers or [])
        next_members = set(performances[tour[i + 1]].performers or [])
        overlapping_members = current_members & next_members
        detail.append({
            'from': performances[tour[i]].name,
            'to': performances[tour[i + 1]].name,
            'overlapping_members': list(overlapping_members)
        })

    return perfName, overlap_costs, cost, detail