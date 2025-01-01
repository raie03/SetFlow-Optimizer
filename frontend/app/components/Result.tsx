import React from "react";
import LoadingSkeleton from "./LoadingSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PerformanceDetail, ResultData } from "../types/types";

const Result = ({
  isLoading,
  result,
}: {
  isLoading: boolean;
  result: ResultData;
}) => {
  return (
    <div>
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        result && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Optimal Setlist:</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Overlap Cost</TableHead>
                  <TableHead>Total Cost</TableHead>
                  {/* {result.detail && <TableHead>Detail</TableHead>} */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.performancesName.map(
                  (performance: string, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{performance}</TableCell>
                      <TableCell>{result.overlap_costs[index]}</TableCell>
                      <TableCell>{result.total_costs[index]}</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        )
      )}
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        result?.detail! && (
          <div className="mt-3">
            <h3 className="font-semibold mb-2">Overlap Detail</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From → To</TableHead>
                  <TableHead>Overlaping Members</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.detail.map(
                  (detail: PerformanceDetail, index: number) => (
                    <TableRow key={index}>
                      <TableCell>
                        {detail.from_performance} → {detail.to_performance}
                      </TableCell>
                      <TableCell className="w-auto">
                        {detail.overlapping_members.join(", ")}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        )
      )}
    </div>
  );
};

export default Result;
