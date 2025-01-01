"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";

// スキーマ定義
const overlapSchema = z.object({
  performancesName: z.array(
    z.string().min(1, "Performance name cannot be empty")
  ),
  costs: z.array(z.array(z.number().min(0).max(500))),
});

interface OverlapValues {
  performancesName: string[];
  costs: number[][];
}

export default function OverlapForm({
  setIsLoading,
  setResult,
}: {
  setIsLoading: any;
  setResult: any;
}) {
  const [size, setSize] = useState(3); // 初期サイズ
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<OverlapValues>({
    resolver: zodResolver(overlapSchema),
    defaultValues: {
      performancesName: ["Perdormance 1", "Perdormance 2", "Perdormance 3"],
      costs: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
    },
  });

  const costsData = watch("costs");
  const performancesNameData = watch("performancesName");

  const handleCostChange = (row: number, col: number, value: number) => {
    // 現在の値を更新
    setValue(`costs.${row}.${col}`, value, { shouldValidate: true });
    // 対称の値も更新
    setValue(`costs.${col}.${row}`, value, { shouldValidate: true });
  };

  //   const handlePerformancesNameChange = (e: any, row: number) => {
  //     const updatedPerformancesName: string[] = [
  //       ...getValues("performancesName"),
  //     ];
  //     updatedPerformancesName[row] = e.target.value;
  //     setValue("performancesName", updatedPerformancesName, {
  //       shouldValidate: true,
  //     });
  //   };

  const handleSizeChange = (e: any) => {
    const value = e.target.value;
    // 空文字の場合は0を設定し、それ以外は通常通り数値を処理
    const newSize =
      value === "" ? 2 : Math.max(2, Math.min(20, parseInt(value) || 2));
    setSize(newSize);

    // `costs`の更新
    const currentCosts = getValues("costs");
    const updatedCosts = Array.from({ length: newSize }, (_, row) =>
      Array.from({ length: newSize }, (_, col) =>
        row < currentCosts.length && col < currentCosts.length
          ? currentCosts[row][col]
          : 0
      )
    );
    console.log(getValues("costs"));
    setValue("costs", updatedCosts, { shouldValidate: true });

    // `performancesName`の更新
    const currentPerformancesName: string[] = getValues("performancesName");
    const updatedPerformancesName = currentPerformancesName.slice(0, newSize);
    while (updatedPerformancesName.length < newSize) {
      updatedPerformancesName.push(
        `Performance ${updatedPerformancesName.length + 1}`
      );
    }
    console.log(updatedPerformancesName);
    setValue("performancesName", updatedPerformancesName, {
      shouldValidate: true,
    });
    console.log(getValues("performancesName"));
  };

  const handleReset = () => {
    const updatedCosts = Array(size).fill(Array(size).fill(0));
    setValue("costs", updatedCosts, { shouldValidate: true });

    const updatedPerformancesName = Array.from(
      { length: size },
      (_, index) => `Performance ${index + 1}`
    );
    setValue("performancesName", updatedPerformancesName, {
      shouldValidate: true,
    });
  };

  const handleOverlapSubmit = (data: OverlapValues) => {
    setIsLoading(true);
    toast.promise(
      // Promise を返す非同期処理
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/overlap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          performancesName: data.performancesName,
          costs: data.costs,
        }),
      }).then(async (response) => {
        const perfData = await response.json();
        setIsLoading(false);
        setResult(perfData);
        return perfData; // このreturnは成功メッセージのために使われます
      }),
      {
        loading: "処理を実行中...",
        success: (perfData) => "処理が完了しました",
        error: "処理中にエラーが発生しました",
        position: "top-center",
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(handleOverlapSubmit)}>
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
        <Button type="submit" className="mt-4">
          Optimize Setlist
        </Button>
        <Button type="button" onClick={() => handleReset()} className="mx-1">
          Reset
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From / To</TableHead>
              {[...Array(size)].map((_, i) => (
                <TableHead key={i} className="w-auto">
                  {getValues(`performancesName.${i}`)}
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
                    {...register(`performancesName.${row}`)}
                    value={getValues(`performancesName.${row}`)}
                    // onChange={(e) => handlePerformancesNameChange(e, row)}
                    className="w-auto"
                  />
                  {/* {errors.performancesName?.[row] && (
                    <p className="text-red-500 text-sm">
                      {errors.performancesName[row].message}
                    </p>
                  )} */}
                </TableCell>
                {[...Array(size)].map((_, col) => (
                  <TableCell key={col}>
                    {row === col ? (
                      <div className="mx-3.5">-</div>
                    ) : (
                      <Input
                        type="number"
                        {...register(`costs.${row}.${col}`, {
                          valueAsNumber: true,
                        })}
                        value={getValues(`costs.${row}.${col}`) || 0}
                        onChange={(e) =>
                          handleCostChange(row, col, Number(e.target.value))
                        }
                        min="0"
                        max="100"
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
    </form>
  );
}
