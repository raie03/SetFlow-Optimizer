import sys

def optimize_setlist(costs):
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
            # Skip if current performance hasn't been done yet (except initial state)
            if ((i & (1 << j)) == 0) and (i != 0):
                continue
                
            for k in range(n):
                # Check if performance k hasn't been done yet
                if ((i & (1 << k)) == 0) and (costs[j][k] < INF):
                    v = (i | (1 << k))
                    if dp[v][k] > dp[i][j] + costs[j][k]:
                        route[v][k] = j
                    dp[v][k] = min(dp[v][k], dp[i][j] + costs[j][k])
    
    # Reconstruct the optimal route
    tour = [0] * (n + 1)
    cost = [0] * n
    pos = 0
    b = (1 << n) - 1
    
    tour[0] = 0
    for i in range(n):
        tour[i + 1] = route[b][pos]
        cost[i] = dp[b][pos]
        b = b ^ (1 << pos)  # XOR operation
        pos = tour[i + 1]
    
    # Print results
    print(f"演目: {1} 被り: {1} 総コスト: {1}")
    
    prev_cost = 0
    for i in range(n-1, -1, -1):
        overlap = cost[i] - prev_cost
        print(f"演目: {tour[i] + 1} 被り: {overlap} 総コスト: {cost[i]}")
        prev_cost = cost[i]
    
    final_cost = dp[(1 << n) - 1][0]
    if final_cost == INF:
        print(-1)
    else:
        print("result")
        print(final_cost)
    
    return tour[:-1][::-1], cost  # Return reversed tour (excluding last element) and costs

# Example usage
costs = [
    [0, 5, 9, 6, 7, 3, 2, 4, 8, 6, 1, 2, 4, 5, 6, 7],
    [5, 0, 8, 7, 5, 4, 3, 2, 6, 5, 2, 1, 4, 7, 8, 9],
    [9, 8, 0, 6, 5, 7, 8, 3, 4, 5, 2, 6, 9, 7, 5, 4],
    [6, 7, 6, 0, 4, 3, 5, 7, 8, 6, 4, 3, 2, 1, 6, 7],
    [7, 5, 5, 4, 0, 6, 5, 3, 4, 6, 5, 3, 2, 6, 8, 7],
    [3, 4, 7, 3, 6, 0, 2, 3, 4, 5, 7, 6, 3, 2, 1, 4],
    [2, 3, 8, 5, 5, 2, 0, 6, 7, 8, 4, 3, 2, 1, 5, 6],
    [4, 2, 3, 7, 3, 3, 6, 0, 5, 4, 3, 2, 1, 4, 6, 8],
    [8, 6, 4, 8, 4, 4, 7, 5, 0, 6, 5, 4, 3, 7, 8, 9],
    [6, 5, 5, 6, 6, 5, 8, 4, 6, 0, 7, 5, 4, 6, 8, 5],
    [1, 2, 2, 4, 5, 7, 4, 3, 5, 7, 0, 2, 4, 3, 5, 6],
    [2, 1, 6, 3, 3, 6, 3, 2, 4, 5, 2, 0, 5, 6, 4, 3],
    [4, 4, 9, 2, 2, 3, 2, 1, 3, 4, 4, 5, 0, 6, 8, 7],
    [5, 7, 7, 1, 6, 2, 1, 4, 7, 6, 3, 6, 6, 0, 8, 5],
    [6, 8, 5, 6, 8, 1, 5, 6, 8, 8, 5, 4, 8, 8, 0, 6],
    [7, 9, 4, 7, 7, 4, 6, 8, 9, 5, 6, 3, 7, 5, 6, 0],
]

# Run the optimization
optimal_tour, optimal_costs = optimize_setlist(costs)