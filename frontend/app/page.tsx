"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SetFlowOptimizer = () => {
  const [size, setSize] = useState(3);
  const [costs, setCosts] = useState(Array(3).fill(Array(3).fill(0)));
  const [result, setResult]: any = useState(null);

  // console.log(costs);

  const handleSizeChange = (e: any) => {
    const newSize = parseInt(e.target.value) || 3;
    setSize(newSize);
    setCosts(Array(newSize).fill(Array(newSize).fill(0)));
  };

  const handleCostChange = (row: any, col: any, value: any) => {
    // const newCosts = costs.map((r, i) =>
    //   i === row
    //     ? r.map((c: any, j: any) => (j === col ? parseInt(value) || 0 : c))
    //     : r
    // );
    // setCosts(newCosts);
    const newValue = parseInt(value.toString()) || 0;
    const updatedCosts = costs.map((r, i) =>
      r.map((c: any, j: any) => {
        if ((i === row && j === col) || (i === col && j === row)) {
          // 対称な位置 (row:col と col:row) を更新
          return newValue;
        }
        return c; // 他の要素はそのまま
      })
    );

    setCosts(updatedCosts);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ costs }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>SetFlow Optimizer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Number of Performances:
              <Input
                type="number"
                min="2"
                max="16"
                value={size}
                onChange={handleSizeChange}
                className="mt-1"
              />
            </label>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From / To</TableHead>
                  {[...Array(size)].map((_, i) => (
                    <TableHead key={i}>Performance {i + 1}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(size)].map((_, row) => (
                  <TableRow key={row}>
                    <TableCell>Performance {row + 1}</TableCell>
                    {[...Array(size)].map((_, col) => (
                      <TableCell key={col}>
                        {row === col ? (
                          // <Card className="text-left">
                          //   <CardContent className="">0</CardContent>
                          // </Card>
                          <div className="mx-3">0</div>
                        ) : (
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={costs[row][col]}
                            onChange={(e) =>
                              handleCostChange(row, col, e.target.value)
                            }
                            className="w-16"
                          />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Button onClick={handleSubmit} className="mt-4">
            Optimize Setlist
          </Button>

          {result && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Optimal Setlist:</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Overlap Cost</TableHead>
                    <TableHead>Total Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.tour.map((performance: any, index: any) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>Performance {performance + 1}</TableCell>
                      <TableCell>{result.overlap_costs[index]}</TableCell>
                      <TableCell>{result.total_costs[index]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SetFlowOptimizer;
