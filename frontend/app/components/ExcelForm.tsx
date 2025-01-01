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
import * as XLSX from "xlsx";

const ExcelForm = ({
  setIsLoading,
  setResult,
}: {
  setIsLoading: any;
  setResult: any;
}) => {
  const [performances, setPerformances] = useState<
    { name: string; performers: string[] }[]
  >(Array(3).fill({ name: "", performers: [] }));
  const [isLoadedExcelData, setIsLoadedExcelData] = useState(false);

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

  const handleExcelSubmit = () => {
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

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Import Excel File:
          <Input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleExcelUpload}
            className="mt-1"
          />
          <Button className="mt-6" onClick={handleExcelSubmit}>
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
