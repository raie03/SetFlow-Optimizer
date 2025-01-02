"use client";

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
import React, { useState } from "react";
import { toast } from "sonner";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
import { PerformanceData, ResultData } from "../types/types";

// const testSchema = z.object({
//   testNumPerformances: z.number().min(2).max(20),
//   testNumPerformers: z.number().min(2).max(500),
// });

const TestForm = ({
  setIsLoading,
  setResult,
}: {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setResult: React.Dispatch<React.SetStateAction<ResultData>>;
}) => {
  const [performances, setPerformances] = useState<PerformanceData[]>(
    Array(3).fill({ name: "", performers: [] })
  );
  const [testNumPerformances, setTestNumPerformances] = useState(3);
  const [testNumPerformers, setTestNumPerformers] = useState(6);

  //   const {
  //     register,
  //     handleSubmit,
  //     watch,
  //     setValue,
  //     getValues,
  //     formState: { errors },
  //   } = useForm({
  //     resolver: zodResolver(testSchema),
  //     defaultValues: {
  //       testNumPerformances: 3,
  //       testNumPerformers: 6,
  //     },
  //   });

  const generateRandomTestCase = () => {
    const performancesData = [];
    // console.log(testNumPerformances, testNumPerformers);
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

  const handleTestSubmit = () => {
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
        success: () => "処理が完了しました",
        error: "処理中にエラーが発生しました",
        position: "top-center",
      }
    );
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">
        Number of Performances:
        <Input
          type="number"
          min={2}
          max={20}
          value={testNumPerformances}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTestNumPerformances(
              e.target.value === ""
                ? 2
                : Math.max(2, Math.min(20, parseInt(e.target.value) || 2))
            )
          }
          className="mt-1"
        />
      </label>
      <label className="block text-sm font-medium mb-2">
        Number of Performers:
        <Input
          type="number"
          min={2}
          max={500}
          value={testNumPerformers}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTestNumPerformers(
              e.target.value === ""
                ? 2
                : Math.max(2, Math.min(500, parseInt(e.target.value) || 2))
            )
          }
          className="mt-1"
        />
      </label>

      <Button className="mt-4" onClick={generateRandomTestCase}>
        Generate Random Test Case
      </Button>

      <Button className="mt-4 mx-1" onClick={handleTestSubmit}>
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
  );
};

export default TestForm;
