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
import React from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { PerformanceData, ResultData } from "../types/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const excelSchema = z.object({
  performances: z
    .array(
      z.object({
        name: z.string().min(1, "Performance name cannot be empty"),
        performers: z.array(z.string().min(1, "Performers cannot be empty")),
      })
    )
    .min(2)
    .refine(
      (performances) => {
        const names = performances.map((perf) => perf.name);
        const uniqueNames = new Set(names);
        return names.length === uniqueNames.size;
      },
      {
        message: "Duplicate performance names are not allowed.",
        path: ["performances"], // エラーの対象を指定
      }
    )
    .refine(
      (performances) => {
        let isSameName: boolean = false;
        performances.map((perf) => {
          const uniqueNames = new Set(perf.performers);
          if (perf.performers.length !== uniqueNames.size) {
            isSameName = true;
          }
        });
        return !isSameName;
      },
      {
        message: "Duplicate performancer names are not allowed.",
        path: ["performances"], // エラーの対象を指定
      }
    ),
});

interface RowData {
  performance_name: string;
  performers: string;
}

interface excelValues {
  performances: PerformanceData[];
}

const ExcelForm = ({
  setIsLoading,
  setResult,
}: {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setResult: React.Dispatch<React.SetStateAction<ResultData>>;
}) => {
  // const [performances, setPerformances] = useState<PerformanceData[]>(
  //   Array(3).fill({ name: "", performers: [] })
  // );
  // const [isLoadedExcelData, setIsLoadedExcelData] = useState(false);

  const {
    // register,
    handleSubmit,
    // watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<excelValues>({
    resolver: zodResolver(excelSchema),
    defaultValues: {
      performances: [],
    },
  });

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
      const jsonData: RowData[] = XLSX.utils.sheet_to_json(sheet);

      const performancesData = jsonData.map((row) => ({
        name: row.performance_name, // A列
        performers: row.performers?.split(",") || [], // B列をカンマで分割
      }));
      console.log(performancesData);
      // setPerformances(performancesData);
      setValue("performances", performancesData, { shouldValidate: true });
    };
    reader.readAsBinaryString(file);
  };

  const handleExcelSubmit = (data: excelValues) => {
    setIsLoading(true);
    toast.promise(
      // Promise を返す非同期処理
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/manual`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          performances: data.performances,
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
    <div>
      <form onSubmit={handleSubmit(handleExcelSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            エクセルファイルを読み込む:
            <Input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleExcelUpload}
              className="mt-1"
            />
            <Button
              className="mt-6"
              type="submit"
              disabled={Object.keys(errors).length > 0}
            >
              セットリスト最適化
            </Button>
          </label>
        </div>
      </form>

      <div className="overflow-x-auto">
        <h3 className="mt-3">プレビュー</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>演目名</TableHead>
              <TableHead>出演者</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getValues("performances").map((performance, row) => (
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

export default ExcelForm;
