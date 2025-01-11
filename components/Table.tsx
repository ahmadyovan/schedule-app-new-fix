'use client';

import { useState } from 'react';
import { useRealtime } from './hook/useRealtimeCourses';
import SearchInput from './search-input';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AddScheduleModal from './schedule/AddScheduleModal';

interface MataKuliah {
	prodi: number;
	id: number;
	kode: number;
	nama: string;
	sks: number;
	semester: number;
}

interface Waktu {
	id: number;
	nama: string;
}

interface Jadwal {
	create_at: string;
	hari: number;
	id: number;
	id_dosen: number;
	id_kelas: number;
	id_mata_kuliah: number;
	jam_akhir: string;
	jam_mulai: string;
	mata_kuliah?: MataKuliah;
	id_waktu: number; 
	waktu: Waktu;
	dosen?: { nama: string }; // Optional field
}

interface Props {
	table: 'mata_kuliah' | 'jadwal';
	select: string;
	filter: { column: string; value: number };
}

// Type guard helpers
function isMataKuliah(data: Jadwal | MataKuliah): data is MataKuliah {
  	return 'prodi' in data;
}

function isJadwal(data: Jadwal | MataKuliah): data is Jadwal {
  	return 'hari' in data;
}

const Table = ({ table, select, filter }: Props) => {
	const { data, loading, error } = useRealtime(table, {
		select: select,
		filters: [{ column: filter.column, value: filter.value }],
		orderBy: { column: 'id', ascending: true },
	});

	const [searchQuery, setSearchQuery] = useState('');
	const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
	const [selectedData, setSelectedData] = useState<MataKuliah | Jadwal | null>(null);
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

	// Filtered data logic
	const filteredData = data.filter((item) => {
		if (isMataKuliah(item)) {
			const matchesSearch = item.nama?.toLowerCase().includes(searchQuery.toLowerCase()) || item.kode?.toString().includes(searchQuery);
			const matchesSemester = selectedSemester === null || item.semester === selectedSemester;
			return matchesSearch && matchesSemester;
		} else if (isJadwal(item)) {
			const matchesSearch = item.mata_kuliah?.nama?.toLowerCase().includes(searchQuery.toLowerCase()) || item.mata_kuliah?.kode?.toString().includes(searchQuery);
			const matchesSemester = selectedSemester === null || item.mata_kuliah?.semester === selectedSemester;
			return matchesSearch && matchesSemester;
		}
		return false;
	});

	// Total SKS calculation
	const totalSKS = filteredData.reduce((total, item) => {
		if (isMataKuliah(item)) return total + item.sks;
		if (isJadwal(item) && item.mata_kuliah?.sks) return total + item.mata_kuliah.sks;
		return total;
	}, 0);

	// Pagination logic
	const pageSize = 5;
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

	const handleRowClick = (item: Jadwal | MataKuliah) => {
		setSelectedData(item);
		setIsDetailModalOpen(true);
	};

	const handleCloseDetailModal = () => {
		setIsDetailModalOpen(false);
		setSelectedData(null);
	};

	if (error) return <div>Error: {error.message}</div>;

	return (
		<div className="w-full flex flex-col gap-3">
		
			<div className="flex items-center item-center justify-between">
				<div className='flex items-center gap-3'>
					<select className="px-2 py-1 text-xs bg-gray-200 rounded" value={selectedSemester || ''} onChange={(e) => setSelectedSemester(e.target.value === '' ? null : Number(e.target.value))} >
						<option value="">Semua Semester</option>
						{[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => (
							<option key={semester} value={semester}>
							Semester {semester}
							</option>
						))}
					</select>
					<h1 className="text-xs">Total SKS: {totalSKS}</h1>
				</div>
				<AddScheduleModal />
			</div>

			<div className="flex gap-3">
				<SearchInput placeholder={`Search ${table === 'mata_kuliah' ? 'Mata Kuliah' : 'Jadwal'}...`} onSearch={(query) => setSearchQuery(query)} />
			</div>

			{/* Data Table */}
			<div className="w-full flex flex-col gap-2">
				{loading ? Array(5).fill(0).map((_, index) => (
				<div key={index} className="w-full flex items-center py-1 h-7 bg-gray-400 rounded text-xs px-4 gap-5 animate-pulse" />
				)) : currentItems.map((item, index) => (
				<div key={index} className="w-full flex items-center py-1 h-7 bg-[#E4E4E4] rounded text-xs px-4 gap-3 cursor-pointer" onClick={() => handleRowClick(item)} >
					<div className={`w-5 min-w-5 border border-solid border-red-300`}>{indexOfFirstItem + index + 1}</div>
					<div className={`w-14 min-w-14 hidden sm:flex border border-solid border-red-300`}>{isMataKuliah(item) ? item.kode : item.mata_kuliah?.kode}</div>
					<div className={`w-full min-w-10 border border-solid border-red-300`}>{isMataKuliah(item) ? item.nama : item.mata_kuliah?.nama}</div>
					<div className={`w-5 min-w-5 hidden sm:flex border border-solid border-red-300`}>{isMataKuliah(item) ? item.sks : item.mata_kuliah?.sks}</div>
					<div className={`${isJadwal(item)? 'w-full' : 'hidden'} max-w-40 border border-solid border-red-300`}>{isJadwal(item) ? item.dosen?.nama : ''}</div>
					<div className={`${isJadwal(item)? 'w-14' : 'hidden'} hidden sm:flex border border-solid border-red-300`}>{isJadwal(item) ? item.waktu.nama : ''}</div>
				</div>
				))}
			</div>

			{/* Pagination */}
			<div className="w-full flex justify-between items-center">
				<button onClick={prevPage} disabled={currentPage === 1} className={`px-2 py-1 bg-gray-400 rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}>
					<ChevronLeft size={18} />
				</button>
				<span>
					Page {currentPage} of {totalPages}
				</span>
				<button onClick={nextPage} disabled={currentPage >= totalPages} className={`px-2 py-1 bg-gray-400 rounded ${currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : '' }`} >
					<ChevronRight size={18} />
				</button>
			</div>
		</div>
	);
};

export default Table;
