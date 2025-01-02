"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
// import * as XLSX from "xlsx";
// import { toast } from "sonner";
// import LoadingSkeleton from "./components/LoadingSkeleton";
import OverlapForm from "./components/OverlapForm";
import ManualForm from "./components/ManualForm";
import ExcelForm from "./components/ExcelForm";
import TestForm from "./components/TestForm";
import Result from "./components/Result";
import { ResultData } from "./types/types";

const SetFlowOptimizer = () => {
  // const [inputMethod, setInputMethod] = useState("overlap");
  // const [size, setSize] = useState(3);
  // const [costs, setCosts] = useState(Array(3).fill(Array(3).fill(0)));
  const [result, setResult] = useState<ResultData>({
    performancesName: [""],
    overlap_costs: [],
    total_costs: [],
    detail: [],
  });
  // const [performancesName, setPerformancesName] = useState(
  //   Array.from({ length: 3 }, (_, index) => `Performance ${index + 1}`)
  // );
  // const [performances, setPerformances] = useState<
  //   { name: string; performers: string[] }[]
  // >(Array(3).fill({ name: "", performers: [] }));
  const [isLoading, setIsLoading] = useState(false);

  // const handleReset = () => {
  //   setCosts(Array(size).fill(Array(size).fill(0)));
  //   setResult(null);
  //   setPerformancesName(
  //     Array.from({ length: size }, (_, index) => `Performance ${index + 1}`)
  //   );
  //   setPerformances(Array(size).fill({ name: "", performers: [] }));
  // };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>SetFlow Optimizer</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overlap">
            <TabsList className="mb-4">
              <TabsTrigger
                value="overlap"
                // onClick={() => setInputMethod("overlap")}
              >
                演目名と被り数
              </TabsTrigger>
              <TabsTrigger
                value="manual"
                // onClick={() => setInputMethod("manual")}
              >
                演目名と出演者
              </TabsTrigger>
              <TabsTrigger
                value="excel"
                // onClick={() => setInputMethod("excel")}
              >
                Excelアップロード
              </TabsTrigger>
              <TabsTrigger
                value="test"
                // onClick={() => setInputMethod("test")}
              >
                テスト
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overlap">
              <OverlapForm setIsLoading={setIsLoading} setResult={setResult} />
            </TabsContent>

            <TabsContent value="manual">
              <ManualForm setIsLoading={setIsLoading} setResult={setResult} />
            </TabsContent>

            <TabsContent value="excel">
              <ExcelForm setIsLoading={setIsLoading} setResult={setResult} />
            </TabsContent>

            <TabsContent value="test">
              <TestForm setIsLoading={setIsLoading} setResult={setResult} />
            </TabsContent>

            <Result isLoading={isLoading} result={result} />
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetFlowOptimizer;
