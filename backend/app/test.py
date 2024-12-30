from optimizer import optimize_setlist_manual
from typing import List
from models import OptimizationManualRequest, Performance


# performances_test = [
#         Performance(name="Performance 1", performers=["Alice", "Bob"]),
#         Performance(name="Performance 2", performers=["Bob", "Charlie"]),
#         Performance(name="Performance 3", performers=["Alice", "Charlie"]),
#     ]

performances_test = [
        Performance(name="Performance 1", performers=["Alice", "Bob", "Charlie"]),
        Performance(name="Performance 2", performers=["Alice", "Eve", "Grace"]),
        Performance(name="Performance 3", performers=["Bob", "Grace", "Frank"]),
        Performance(name="Performance 4", performers=["Charlie", "Eve", "Mallory"]),
        Performance(name="Performance 5", performers=["Frank", "Mallory", "Oscar"]),
        Performance(name="Performance 6", performers=["Alice", "Oscar", "Trent"]),
        Performance(name="Performance 7", performers=["Bob", "Charlie", "Eve"]),
    ]


# request = OptimizationManualRequest(performances=performances_test)

response = optimize_setlist_manual(performances_test)
print("result")
print(response)