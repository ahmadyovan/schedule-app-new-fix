// import FilterSemester from "@/components/filter-semester";
'use client'

import AddCourseModal from '@/components/course/AddCourseModal';
import DeleteCourseModal from '@/components/course/DeleteCourseModal';
import EditCourseModal from '@/components/course/EditCourseModal';
import { useRealtime } from '@/components/hook/useRealtimeCourses';
import { useState } from 'react';

interface MataKuliah {
	prodi: number;
	id: number;
	kode: number;
	nama: string;
	sks: number;
	semester: number;
}

const Home = () => {

	const [activeSemester, setActiveSemester] = useState<number | null>(1);
	
	const { data = [], loading, error } = useRealtime('mata_kuliah', {
		select: '*',
		filters: [{ column: 'prodi', value: 4 }],
		orderBy: { column: 'id', ascending: true },
	  });
	
	  // Filter data berdasarkan pencarian
	  const filteredData = data.filter((item) =>
		activeSemester === null || item.semester === activeSemester
	  );

	return (
		<div className="h-full w-full flex flex-col items-center gap-5 text-black xl:text-2xl">
			<div className="w-full flex flex-col items-center pt-10">
				<h1 className="">Manajemen kurikulum</h1>
				<h1 className="">Teknik Informatika</h1>
			</div>
			<div className="min-w-60 flex justify-center w-full">
				<div className="w-full max-w-[100rem] flex justify-center gap-3">
					<div className='w-full flex flex-col gap-1'>

						<div className='flex gap-3'>
							<div className="flex flex-col gap-2">
								<select id="semester-select" className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none" value={activeSemester || ""} onChange={(e) => setActiveSemester(Number(e.target.value))} >
									{Array.from({ length: 8 }, (_, index) => (
										<option key={index} value={index + 1}>
											Semester {index + 1}
										</option>
									))}
								</select>
							</div>

							<div className="flex justify-between">
								<AddCourseModal />
							</div>
						</div>

						

						<div className='w-full'>
							{/* Header Table */}
							<div className="w-10/12 grid grid-cols-[5rem,10rem,1fr,5rem,10rem] items-center py-1 bg-[#E4E4E4] rounded px-4 gap-3 border border-black border-solid">
								<div className="text-center">No</div>
								<div className="">Kode</div>
								<div className="">Mata Kuliah</div>
								<div className="text-center">SKS</div>
								<div className="text-center">Semester</div>
							</div>
						</div>

						{/* Scrollable Table */}
						<div className="h-full w-full flex flex-col overflow-hidden">
							<div className="h-full w-full overflow-y-scroll flex flex-col gap-1 scroll-snap-y scroll-snap-mandatory">
								{loading
								? Array(5)
									.fill(0)
									.map((_, index) => (
										<div key={index} className="grid grid-cols-4 items-center py-1 bg-gray-400 rounded text-xs gap-3 animate-pulse scroll-snap-align-start" />
									))
								: filteredData.map((item, index) => (
									<div key={index} className="w-full flex py-1 lowercase gap-3 cursor-pointer scroll-snap-align-start">
										<div className='w-10/12 grid grid-cols-[5rem,10rem,1fr,5rem,10rem] rounded gap-3 bg-[#E4E4E4] px-4 border border-black border-solid'>
											<div className="text-center ">{index + 1}</div>
											<div className="">{item.kode}</div>
											<div className="">{item.nama}</div>
											<div className="text-center">{item.sks}</div>
											<div className="text-center">{item.semester}</div>
										</div>
										
										<div className='w-52 flex gap-2'>
											<EditCourseModal course={item} onClose={() => {  }}/>
											<DeleteCourseModal table="mata_kuliah" id={item.id} onClose={() => {     }} />
										</div>
									</div>
									))}
							</div>
						</div>
					</div>
				</div>
			</div>
					
		</div>
		
	);
};

export default Home;
