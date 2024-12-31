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
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import LoadingSkeleton from "./components/LoadingSkeleton";

const SetFlowOptimizer = () => {
  const [inputMethod, setInputMethod] = useState("overlap");
  const [size, setSize] = useState(3);
  const [costs, setCosts] = useState(Array(3).fill(Array(3).fill(0)));
  const [result, setResult]: any = useState(null);
  const [performancesName, setPerformancesName] = useState(
    Array.from({ length: 3 }, (_, index) => `Performance ${index + 1}`)
  );
  const [performances, setPerformances] = useState<
    { name: string; performers: string[] }[]
  >(Array(3).fill({ name: "", performers: [] }));
  const [isLoadedExcelData, setIsLoadedExcelData] = useState(false);
  const [testNumPerformances, setTestNumPerformances] = useState(3);
  const [testNumPerformers, setTestNumPerformers] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = () => {
    setCosts(Array(size).fill(Array(size).fill(0)));
    setResult(null);
    setPerformancesName(
      Array.from({ length: size }, (_, index) => `Performance ${index + 1}`)
    );
    setPerformances(Array(size).fill({ name: "", performers: [] }));
  };

  const handleSizeChange = (e: any) => {
    const newSize = parseInt(e.target.value) || 3;
    setSize(newSize);
    setCosts(Array(newSize).fill(Array(newSize).fill(0)));
    setPerformancesName(
      Array.from({ length: newSize }, (_, index) => `Performance ${index + 1}`)
    );
    // setPerformances(
    //   Array.from({ length: newSize }, (_, index) => {name:"", performers: []})
    // )
    setPerformances(Array(newSize).fill({ name: "", performers: [] }));
  };

  const handlePerformancesNameChange = (e: any, row: any) => {
    const newPerformancesName = [...performancesName];
    newPerformancesName[row] = e.target.value;
    setPerformancesName(newPerformancesName);

    const updatedPerformances = performances.map((performance, i) => {
      if (i === row) {
        return { name: e.target.value, performers: performance.performers };
      }
      return { name: performance.name, performers: performance.performers };
    });
    setPerformances(updatedPerformances);
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

  const handleSubmit = () => {
    setIsLoading(true);
    toast.promise(
      // Promise を返す非同期処理
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/overlap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          performancesName: performancesName,
          costs: costs,
        }),
      }).then(async (response) => {
        const data = await response.json();
        setIsLoading(false);
        setResult(data);
        return data; // このreturnは成功メッセージのために使われます
      }),
      {
        loading: "処理を実行中...",
        success: (data) => "処理が完了しました",
        error: "処理中にエラーが発生しました",
        position: "top-center",
      }
    );
  };

  const updateMemberName2 = (e: any, performanceIndex: number) => {
    const updatedPerformances = performances.map((performance, index) => {
      if (index === performanceIndex) {
        return {
          name: performance.name,
          performers: e.target.value.split(","),
        };
      }
      return { name: performance.name, performers: performance.performers };
    });
    console.log(updatedPerformances);
    setPerformances(updatedPerformances);
  };

  const handleManualSubmit = () => {
    setIsLoading(true);
    toast.promise(
      // Promise を返す非同期処理
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/manual`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          performances,
        }),
      }).then(async (response) => {
        const data = await response.json();
        setIsLoading(false);
        setResult(data);
        return data; // このreturnは成功メッセージのために使われます
      }),
      {
        loading: "処理を実行中...",
        success: (data) => "処理が完了しました",
        error: "処理中にエラーが発生しました",
        position: "top-center",
      }
    );
  };

  // Excelファイルを処理する関数
  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const performancesData = jsonData.map((row: any) => ({
        name: row.performance_name, // A列
        performers: row.performers?.split(",") || [], // B列をカンマで分割
      }));
      // console.log(performancesData);
      setPerformances(performancesData);
      setIsLoadedExcelData(true);
    };
    reader.readAsBinaryString(file);
  };

  const generateRandomTestCase = () => {
    const performancesData = [];
    const members = Array.from(
      { length: testNumPerformers },
      (_, i) => `member${i + 1}`
    );

    for (let i = 0; i < testNumPerformances; i++) {
      // 各演目に参加するメンバーをランダムに選択
      const selectedMembers = [...members]
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * (members.length - 1)) + 1);

      const performanceData = {
        name: `Performance ${i + 1}`,
        performers: selectedMembers,
      };

      performancesData.push(performanceData);
    }
    setPerformances(performancesData);
    // return performancesData;
  };

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
                onClick={() => setInputMethod("overlap")}
              >
                演目名と被り数
              </TabsTrigger>
              <TabsTrigger
                value="manual"
                onClick={() => setInputMethod("manual")}
              >
                演目名と出演者
              </TabsTrigger>
              <TabsTrigger
                value="excel"
                onClick={() => setInputMethod("excel")}
              >
                Excelアップロード
              </TabsTrigger>
              <TabsTrigger value="test" onClick={() => setInputMethod("test")}>
                テスト
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overlap">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Number of Performances:
                  <Input
                    type="number"
                    min="2"
                    max="20"
                    value={size}
                    onChange={handleSizeChange}
                    className="mt-1"
                  />
                </label>
                <Button onClick={handleSubmit} className="mt-4">
                  Optimize Setlist
                </Button>
                <Button onClick={handleReset} className="mx-1">
                  Reset
                </Button>
              </div>

              {/* 演目の被り人数の入力欄 */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>From / To</TableHead>
                      {[...Array(size)].map((_, i) => (
                        <TableHead key={i} className="w-auto">
                          {performancesName[i]}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...Array(size)].map((_, row) => (
                      <TableRow key={row}>
                        <TableCell>
                          <Input
                            type="text"
                            // placeholder={`Performance ${row + 1}`}
                            value={performancesName[row]}
                            placeholder={performancesName[row]}
                            onChange={(e) =>
                              handlePerformancesNameChange(e, row)
                            }
                            className="w-auto"
                          />
                        </TableCell>
                        {[...Array(size)].map((_, col) => (
                          <TableCell key={col}>
                            {row === col ? (
                              // <Card className="text-left">
                              //   <CardContent className="">0</CardContent>
                              // </Card>
                              <div className="mx-3.5">-</div>
                            ) : (
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                value={costs[row][col]}
                                onChange={(e) =>
                                  handleCostChange(row, col, e.target.value)
                                }
                                className="w-auto"
                              />
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* <Button onClick={handleSubmit} className="mt-4">
                Optimize Setlist
              </Button> */}
            </TabsContent>
            <TabsContent value="manual">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Number of Performances:
                  <Input
                    type="number"
                    min="2"
                    max="20"
                    value={size}
                    onChange={handleSizeChange}
                    className="mt-1"
                  />
                </label>
                <Button className="mt-4" onClick={handleManualSubmit}>
                  Optimize Setlist
                </Button>
                <Button onClick={handleReset} className="mx-1">
                  Reset
                </Button>
              </div>

              {/* 演目名と出演者の入力欄 */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Performance Name</TableHead>
                      <TableHead>Performers</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {performances.map((performance, row) => (
                      <TableRow key={row}>
                        <TableCell>
                          <Input
                            type="text"
                            // placeholder={`Performance ${row + 1}`}
                            value={performance.name}
                            placeholder={`Performance ${row + 1} Name`}
                            onChange={(e) =>
                              handlePerformancesNameChange(e, row)
                            }
                            className="w-full"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="text"
                            value={performance.performers}
                            placeholder="Member Name"
                            onChange={(e) => updateMemberName2(e, row)}
                            className="w-full"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {/* <Button
                  className="px-4 py-2 rounded"
                  onClick={handleManualSubmit}
                >
                  Optimize Setlist
                </Button> */}
              </div>
            </TabsContent>

            <TabsContent value="excel">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Import Excel File:
                  <Input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleExcelUpload}
                    className="mt-1"
                  />
                  <Button className="mt-6" onClick={handleManualSubmit}>
                    Optimize Setlist
                  </Button>
                </label>
              </div>

              <div className="overflow-x-auto">
                <h3 className="mt-3 mx-5">Preview</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Performance Name</TableHead>
                      <TableHead>Performers</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {performances.map((performance, row) => (
                      <TableRow key={row}>
                        <TableCell>
                          {/* <Input
                              type="text"
                              // placeholder={`Performance ${row + 1}`}
                              value={performance.name}
                              placeholder={`Performance ${row + 1} Name`}
                              onChange={(e) =>
                                handlePerformancesNameChange(e, row)
                              }
                              className="w-full overflow-auto"
                            /> */}
                          <div className="mx-3.5 w-full overflow-auto">
                            {performance.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          {/* <Input
                              type="text"
                              min="0"
                              max="100"
                              value={performance.performers}
                              placeholder="Member Name"
                              onChange={(e) => updateMemberName2(e, row)}
                              className="w-full overflow-auto"
                            /> */}
                          <div className="mx-3.5 w-full overflow-auto">
                            {performance.performers.join(",")}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="test">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Number of Performances:
                  <Input
                    type="number"
                    min="2"
                    max="20"
                    value={testNumPerformances}
                    onChange={(e: any) =>
                      setTestNumPerformances(e.target.value)
                    }
                    className="mt-1"
                  />
                </label>
                <label className="block text-sm font-medium mb-2">
                  Number of Performers:
                  <Input
                    type="number"
                    min="2"
                    max="500"
                    value={testNumPerformers}
                    onChange={(e: any) => setTestNumPerformers(e.target.value)}
                    className="mt-1"
                  />
                </label>
                <Button className="mt-4" onClick={generateRandomTestCase}>
                  Generate Random Test Case
                </Button>
                <Button className="mt-4 mx-1" onClick={handleManualSubmit}>
                  Optimize Setlist
                </Button>
                <div className="overflow-x-auto">
                  <h3 className="mt-3 mx-5">Preview</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Performance Name</TableHead>
                        <TableHead>Performers</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {performances.map((performance, row) => (
                        <TableRow key={row}>
                          <TableCell>
                            <div className="mx-3.5 w-full overflow-auto">
                              {performance.name}
                            </div>
                          </TableCell>
                          <TableCell>
                            {/* <Input
                              type="text"
                              min="0"
                              max="100"
                              value={performance.performers}
                              placeholder="Member Name"
                              onChange={(e) => updateMemberName2(e, row)}
                              className="w-full overflow-auto"
                            /> */}
                            <div className="mx-3.5 w-full overflow-auto">
                              {performance.performers.join(",")}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              result && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">
                    Optimal Setlist:
                  </h3>
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
                        (performance: any, index: any) => (
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
                      {result.detail.map((detail: any, index: any) => (
                        <TableRow key={index}>
                          <TableCell>
                            {detail.from_performance} → {detail.to_performance}
                          </TableCell>
                          <TableCell className="w-auto">
                            {detail.overlapping_members.join(", ")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetFlowOptimizer;
