import React, { useState } from "react";
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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ResultData } from "../types/types";

// スキーマ定義
const manualSchema = z.object({
  performances: z
    .array(
      z.object({
        name: z.string().min(1, "Performance name cannot be empty"),
        performers: z.array(z.string().min(1, "Performers cannot be empty")),
      })
    )
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
        path: ["performances.performers"], // エラーの対象を指定
      }
    ),
});

interface manualValues {
  performances: {
    name: string;
    performers: string[];
  }[];
}

const ManualForm = ({
  setIsLoading,
  setResult,
}: {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setResult: React.Dispatch<React.SetStateAction<ResultData>>;
}) => {
  const [size, setSize] = useState(3); // 初期サイズ
  const {
    register,
    handleSubmit,
    // watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<manualValues>({
    resolver: zodResolver(manualSchema),
    defaultValues: {
      performances: [
        {
          name: "",
          performers: [""],
        },
        {
          name: "",
          performers: [""],
        },
        {
          name: "",
          performers: [""],
        },
      ],
    },
  });

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 空文字の場合は0を設定し、それ以外は通常通り数値を処理
    const newSize =
      value === "" ? 2 : Math.max(2, Math.min(20, parseInt(value) || 2));
    setSize(newSize);

    const currentPerfs = getValues("performances");
    const updatedPerfs = Array.from({ length: newSize }, (_, index) => {
      return index < currentPerfs.length
        ? {
            name: currentPerfs[index].name,
            performers: currentPerfs[index].performers,
          }
        : {
            name: "",
            performers: [""],
          };
    });
    setValue("performances", updatedPerfs, { shouldValidate: true });
  };

  // const updateMemberName = (
  //   e: React.ChangeEvent<HTMLInputElement>,
  //   performanceIndex: number
  // ) => {
  //   const updatedPerformances = getValues("performances").map(
  //     (performance, index) => {
  //       if (index === performanceIndex) {
  //         return {
  //           name: performance.name,
  //           performers: e.target.value.split(","),
  //         };
  //       }
  //       return { name: performance.name, performers: performance.performers };
  //     }
  //   );
  //   // console.log(updatedPerformances);
  //   setValue("performances", updatedPerformances, { shouldValidate: true });
  // };

  const handleReset = () => {
    const updatedPerfs = Array.from({ length: size }, () => {
      return {
        name: "",
        performers: [""],
      };
    });
    setValue("performances", updatedPerfs, { shouldValidate: true });
  };

  const handleManualSubmit = (data: manualValues) => {
    setIsLoading(true);
    // console.log(data);
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
    <form onSubmit={handleSubmit(handleManualSubmit)}>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          演目数:
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
          セットリスト最適化
        </Button>
        <Button type="button" onClick={() => handleReset()} className="mx-1">
          リセット
        </Button>
        {/* {errors.performances && (
          <p className="text-red-500 text-sm">{errors.performances.message}</p>
        )} */}
      </div>

      {/* 演目名と出演者の入力欄 */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>演目名</TableHead>
              <TableHead>出演者(,区切りで入力してください)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getValues("performances").map((performance, row) => (
              <TableRow key={row}>
                <TableCell>
                  <Input
                    type="text"
                    // placeholder={`Performance ${row + 1}`}
                    {...register(`performances.${row}.name`)}
                    // value={getValues(`performances.${row}.name`)}
                    placeholder={`Performance ${row + 1} Name`}
                    // onChange={(e) => handlePerformancesNameChange(e, row)}
                    className={`w-auto ${
                      errors.performances?.[row]?.name
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {/* エラーメッセージを表示 */}
                  {/* {errors.performances?.[row]?.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.performances[row].name.message}
                    </p>
                  )} */}
                </TableCell>
                <TableCell>
                  <Input
                    type="text"
                    value={performance.performers}
                    placeholder="Member 1,Menber 2,Member 3,..."
                    // onChange={(e) => updateMemberName(e, row)}
                    onChange={(e) => {
                      const performers = e.target.value
                        .split(",")
                        .map((name) => name);
                      setValue(`performances.${row}.performers`, performers, {
                        shouldValidate: true, // バリデーションをトリガー
                      });
                    }}
                    className={`w-full ${
                      errors.performances?.[row]?.performers
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {/* エラーメッセージを表示 */}
                  {/* {errors.performances?.[row]?.performers && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.performances[row].performers.message}
                    </p>
                  )} */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </form>
  );
};

export default ManualForm;
