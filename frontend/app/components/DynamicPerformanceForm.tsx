// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import React from "react";

// const DynamicPerformanceForm = () => {
//   const addPerformance = () => {
//     setPerformances([...performances, { name: "", performers: [] }]);
//   };

//   const addMember = (index: number) => {
//     const updatedPerformances = [...performances];
//     updatedPerformances[index].performers.push("");
//     setPerformances(updatedPerformances);
//   };

//   const updatePerformanceName = (index: number, value: string) => {
//     const updatedPerformances = performances.map((performance, i) => {
//       if (i === index) {
//         return { name: value, performers: performance.performers };
//       }
//       return { name: performance.name, performers: performance.performers };
//     });
//     setPerformances(updatedPerformances);
//   };

//   const updateMemberName = (
//     performanceIndex: number,
//     memberIndex: number,
//     value: string
//   ) => {
//     const updatedPerformances = performances.map((performance, i) => {
//       const newPerformers = [...performance.performers];
//       performance.performers.map((performer, j) => {
//         if (i === performanceIndex && j === memberIndex) {
//           newPerformers[memberIndex] = value;
//         }
//       });
//       return { name: performance.name, performers: newPerformers };
//     });
//     setPerformances(updatedPerformances);
//   };

//   return (
//     <div>
//       <Card className="mb-8">
//         <CardHeader>
//           <CardTitle>SetFlow Optimizer</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="p4 mb-4 border p-4 rounded">
//             <h1 className="text-xl font-bold mb-4">Dynamic Performance Form</h1>

//             <Button className="px-4 py-2 rounded mb-4" onClick={addPerformance}>
//               Add Performance
//             </Button>

//             {performances.map((performance, performanceIndex) => (
//               <div
//                 key={performanceIndex}
//                 className="mb-4 border p-4 rounded shadow"
//               >
//                 <Input
//                   type="text"
//                   placeholder={`Performance ${performanceIndex + 1} Name`}
//                   value={performance.name}
//                   onChange={(e) =>
//                     updatePerformanceName(performanceIndex, e.target.value)
//                   }
//                   className="border px-2 py-1 rounded w-full mb-2"
//                 />

//                 <Button
//                   className="px-4 py-2 rounded mb-2"
//                   onClick={() => addMember(performanceIndex)}
//                 >
//                   Add Member
//                 </Button>

//                 {performance.performers.map((member, memberIndex) => (
//                   <Input
//                     key={memberIndex}
//                     type="text"
//                     placeholder={`Member ${memberIndex + 1}`}
//                     value={member}
//                     onChange={(e) =>
//                       updateMemberName(
//                         performanceIndex,
//                         memberIndex,
//                         e.target.value
//                       )
//                     }
//                     className="border px-2 py-1 rounded w-full mb-2"
//                   />
//                 ))}
//               </div>
//             ))}

//             <Button className="px-4 py-2 rounded" onClick={handleManualSubmit}>
//               Optimize Setlist
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default DynamicPerformanceForm;
