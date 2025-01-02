import { Button } from "@/components/ui/button";
import React from "react";
import { ResultData } from "../types/types";
import * as XLSX from "xlsx";

const ExportResultToExcel = ({ result }: { result: ResultData }) => {
  const adjustColumnWidths = (data: any[]): { wch: number }[] => {
    if (data.length === 0) return [];

    const headers = Object.keys(data[0]);
    const columnWidths = headers.map((header) => header.length);

    data.reduce((widths, row) => {
      Object.values(row).forEach((value, index) => {
        const strValue = value ? String(value) : "";
        widths[index] = Math.max(widths[index], strValue.length);
      });
      return widths;
    }, columnWidths);

    return columnWidths.map((width) => ({ wch: width + 2 })); // +2 は余白のため
  };

  const exportResultDataToExcel = (data: ResultData) => {
    // Performances シート
    const performancesData = data.performancesName.map(
      (performance, index) => ({
        Order: index + 1,
        "Performance Name": performance,
        "Overlap Cost": result.overlap_costs[index],
        "Total Cost": result.total_costs[index],
      })
    );
    const performancesSheet = XLSX.utils.json_to_sheet(performancesData);
    performancesSheet["!cols"] = adjustColumnWidths(performancesData);

    // Detail シート
    const detailData = data.detail.map((detail) => ({
      From: detail.from_performance,
      To: detail.to_performance,
      "Overlapping Members": detail.overlapping_members.join(", "),
    }));
    const detailSheet = XLSX.utils.json_to_sheet(detailData);
    detailSheet["!cols"] = adjustColumnWidths(detailData);

    // ワークブックにシートを追加
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, performancesSheet, "Performances");
    XLSX.utils.book_append_sheet(workbook, detailSheet, "Details");

    // ファイルを保存
    XLSX.writeFile(workbook, "ResultData.xlsx");
  };
  return (
    <div>
      <Button
        onClick={() => exportResultDataToExcel(result)}
        className="mt-1 mb-2"
      >
        Export Result to Excel file
      </Button>
    </div>
  );
};

export default ExportResultToExcel;