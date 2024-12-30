import numpy as np
from typing import List

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
    perf = [""] * (n + 1)
    cost = [0] * n
    pos = 0
    b = (1 << n) - 1
    
    tour[0] = 0
    perf[0] = performancesName[0]
    for i in range(n):
        tour[i + 1] = route[b][pos]
        perf[i + 1] = performancesName[route[b][pos]]
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
    
    print(perf[:-1][::-1])
    print(tour[:-1][::-1])
    
    return perf[:-1][::-1], overlap_costs, cost[::-1]