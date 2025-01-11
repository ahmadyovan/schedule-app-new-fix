// 'use client';
// import React from 'react';
// import { useCourseContext } from "@/app/context/CourseContext";

// type SemesterType = 'Gasal' | 'Genap';

// const semesterData: Record<SemesterType, number[]> = {
//   Gasal: [1, 3, 5, 7],
//   Genap: [2, 4, 6, 8],
// };

// const FilterSemester = () => {
//   const { setSelectedSemester, setSelectedCourseId } = useCourseContext(); // Access the context

//   const handleSemesterChange = (semester: number) => {
// 	setSelectedCourseId(null);
//     setSelectedSemester(semester); // Update the selected semester in the context
//   };

//   return (
//     <div className="h-full flex flex-col w-full items-center gap-8">
//       {(Object.keys(semesterData) as SemesterType[]).map((semesterType) => (
//         <div key={semesterType} className="w-full flex flex-col items-center gap-3 text-center">
//           <h2 className="w-full text-2xl bg-[linear-gradient(to_right,_#d9d9d9,_#c8c8c8_25%,_#c8c8c8_74%,_#d9d9d9)]">
//             {semesterType}
//           </h2>
//           {semesterData[semesterType].map((semester) => (
//             <div key={semester} className="w-full flex flex-col gap-1 cursor-pointer" onClick={() => handleSemesterChange(semester)}>
//               <div>{`Semester ${semester}`}</div>
//               <div className="h-1 w-full bg-[linear-gradient(to_right,_#d9d9d9,_#c8c8c8_25%,_#c8c8c8_75%,_#d9d9d9)]"></div>
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default FilterSemester;
