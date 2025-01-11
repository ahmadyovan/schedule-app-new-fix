'use client';

import React, { useState } from 'react';
import SearchInput from '@/components/search-input';
import { useRealtime } from '@/components/hook/useRealtimeCourses';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AddCourseModal from './AddCourseModal';
import CourseDetailModal from './CourseDetailModal';

interface MataKuliah {
	prodi: number; 
	id: number;
    kode: number;
    nama: string;
    sks: number;
    semester: number;
}

const TableKurikulum = () => {
	const { data, loading, error } = useRealtime('mata_kuliah', {
		filters: [{ column: 'prodi', value: 1 }],
		orderBy: { column: 'id', ascending: true },
	});

	const [searchQuery, setSearchQuery] = useState('');
	const [selectedSemester, setSelectedSemester] = useState<number | null>(null);

	const [selectedCourse, setSelectedCourse] = useState<MataKuliah | null>(null);
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

	const filteredData = data.filter((course) => (
		course.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
			course.kode.toString().includes(searchQuery)) &&
		(selectedSemester === null || course.semester === selectedSemester)
	);

	// Pagination logic
	const pageSize = 5;  // Number of items per page
	const totalPages = Math.ceil(filteredData.length / pageSize);
	const [currentPage, setCurrentPage] = useState(1);

	const indexOfLastItem = currentPage * pageSize;
	const indexOfFirstItem = indexOfLastItem - pageSize;
	const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

	const nextPage = () => {
		if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
	};

	const prevPage = () => {
		if (currentPage > 1) setCurrentPage((prev) => prev - 1);
	};

	const handleRowClick = (course: any) => {
		setSelectedCourse(course);
		setIsDetailModalOpen(true); // Buka modal detail saat baris diklik
	};

	const handleCloseDetailModal = () => {
		setIsDetailModalOpen(false);
		setSelectedCourse(null);
	};

	if (error) return <div>Error: {error.message}</div>;

	return (
		<div className="w-full flex flex-col gap-3">
			<div className="flex gap-3">
				<AddCourseModal />
				<SearchInput placeholder="Search Mata Kuliah..." onSearch={(query) => setSearchQuery(query)} />
			</div>

			<div className="flex items-center gap-3">
				<select className="px-2 py-1 text-xs bg-gray-200 rounded" value={selectedSemester || ''} onChange={(e) => setSelectedSemester(e.target.value === '' ? null : Number(e.target.value))} >
					<option value="">Semua Semester</option>
					{[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => (
						<option key={semester} value={semester}>Semester {semester}</option>
					))}
				</select>
				<h1 className="text-xs">Total SKS: {filteredData.reduce((total, course) => total + course.sks, 0)}</h1>
			</div>

			<div className="w-full flex flex-col gap-2">
				{loading? Array(5).fill(0).map((_, index) => (
				<div key={index} className="w-full flex items-center py-1 h-7 bg-gray-400 rounded text-xs px-4 gap-5 animate-pulse" />))
				: currentItems.map((course, index) => (
				<div key={index} className="w-full flex items-center py-1 h-7 bg-[#E4E4E4] rounded text-xs px-4 gap-5" onClick={() => handleRowClick(course)}>
					<div>{indexOfFirstItem + index + 1}</div>
					<div>{course.kode}</div>
					<div>{course.nama}</div>
					<div>{course.sks}</div>
				</div>
				))}
			</div>

			<div className="w-full flex justify-between items-center">
				<button onClick={prevPage} disabled={currentPage === 1} className="px-2 py-1 bg-gray-400 rounded disabled:opacity-0">
					<ChevronLeft size={18} />
				</button>
				<span>Page {currentPage} of {totalPages}</span>
				<button onClick={nextPage} disabled={currentPage >= totalPages} className="px-2 py-1 bg-gray-400 rounded disabled:opacity-0">
					<ChevronRight size={18} />
				</button>
			</div>

			<CourseDetailModal isModalOpen={isDetailModalOpen} course={selectedCourse} onClose={handleCloseDetailModal}/>

		</div>
	);
};

export default TableKurikulum;
