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
  >([]);

  // console.log(performancesName);

  // console.log(costs);

  const handleSizeChange = (e: any) => {
    const newSize = parseInt(e.target.value) || 3;
    setSize(newSize);
    setCosts(Array(newSize).fill(Array(newSize).fill(0)));
    setPerformancesName(
      Array.from({ length: newSize }, (_, index) => `Performance ${index + 1}`)
    );
  };

  const handlePerformancesNameChange = (e: any, row: any) => {
    const newPerformancesName = [...performancesName];
    newPerformancesName[row] = e.target.value;
    setPerformancesName(newPerformancesName);
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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/overlap`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            performancesName: performancesName,
            costs: costs,
          }),
        }
      );

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const addPerformance = () => {
    setPerformances([...performances, { name: "", performers: [] }]);
  };

  const addMember = (index: number) => {
    const updatedPerformances = [...performances];
    updatedPerformances[index].performers.push("");
    setPerformances(updatedPerformances);
  };

  const updatePerformanceName = (index: number, value: string) => {
    const updatedPerformances = [...performances];
    updatedPerformances[index].name = value;
    setPerformances(updatedPerformances);
  };

  const updateMemberName = (
    performanceIndex: number,
    memberIndex: number,
    value: string
  ) => {
    const updatedPerformances = [...performances];
    updatedPerformances[performanceIndex].performers[memberIndex] = value;
    setPerformances(updatedPerformances);
  };

  const handleManualSubmit = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/manual`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            performances,
          }),
        }
      );

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    }
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
            </TabsList>

            <TabsContent value="overlap">
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

              <Button onClick={handleSubmit} className="mt-4">
                Optimize Setlist
              </Button>
            </TabsContent>
            <TabsContent value="manual">
              <div className="p4 mb-4 border p-4 rounded">
                <h1 className="text-xl font-bold mb-4">
                  Dynamic Performance Form
                </h1>

                <Button
                  className="px-4 py-2 rounded mb-4"
                  onClick={addPerformance}
                >
                  Add Performance
                </Button>

                {performances.map((performance, performanceIndex) => (
                  <div
                    key={performanceIndex}
                    className="mb-4 border p-4 rounded shadow"
                  >
                    <Input
                      type="text"
                      placeholder={`Performance ${performanceIndex + 1} Name`}
                      value={performance.name}
                      onChange={(e) =>
                        updatePerformanceName(performanceIndex, e.target.value)
                      }
                      className="border px-2 py-1 rounded w-full mb-2"
                    />

                    <Button
                      className="px-4 py-2 rounded mb-2"
                      onClick={() => addMember(performanceIndex)}
                    >
                      Add Member
                    </Button>

                    {performance.performers.map((member, memberIndex) => (
                      <Input
                        key={memberIndex}
                        type="text"
                        placeholder={`Member ${memberIndex + 1}`}
                        value={member}
                        onChange={(e) =>
                          updateMemberName(
                            performanceIndex,
                            memberIndex,
                            e.target.value
                          )
                        }
                        className="border px-2 py-1 rounded w-full mb-2"
                      />
                    ))}
                  </div>
                ))}

                <Button
                  className="px-4 py-2 rounded"
                  onClick={handleManualSubmit}
                >
                  Optimize Setlist
                </Button>
              </div>
            </TabsContent>

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
            )}
            {result?.detail! && (
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
            )}
          </Tabs>
        </CardContent>
      </Card>

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
                        onChange={(e) => handlePerformancesNameChange(e, row)}
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
          )}
          {result?.detail! && (
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
          )}
        </CardContent>
      </Card>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>SetFlow Optimizer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Dynamic Performance Form</h1>

            <Button className="px-4 py-2 rounded mb-4" onClick={addPerformance}>
              Add Performance
            </Button>

            {performances.map((performance, performanceIndex) => (
              <div
                key={performanceIndex}
                className="mb-4 border p-4 rounded shadow"
              >
                <Input
                  type="text"
                  placeholder={`Performance ${performanceIndex + 1} Name`}
                  value={performance.name}
                  onChange={(e) =>
                    updatePerformanceName(performanceIndex, e.target.value)
                  }
                  className="border px-2 py-1 rounded w-full mb-2"
                />

                <Button
                  className="px-4 py-2 rounded mb-2"
                  onClick={() => addMember(performanceIndex)}
                >
                  Add Member
                </Button>

                {performance.performers.map((member, memberIndex) => (
                  <Input
                    key={memberIndex}
                    type="text"
                    placeholder={`Member ${memberIndex + 1}`}
                    value={member}
                    onChange={(e) =>
                      updateMemberName(
                        performanceIndex,
                        memberIndex,
                        e.target.value
                      )
                    }
                    className="border px-2 py-1 rounded w-full mb-2"
                  />
                ))}
              </div>
            ))}

            <Button className="px-4 py-2 rounded" onClick={handleManualSubmit}>
              Optimize Setlist
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetFlowOptimizer;
