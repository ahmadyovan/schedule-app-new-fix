'use client';

import React, { useState } from 'react';
import SearchInput from '@/components/search-input';
import { useRealtime } from '@/components/hook/useRealtimeCourses';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AddScheduleModal from './AddScheduleModal';
import ScheduleDetailModal from './scheduleDetailModal';

interface MataKuliah {
    prodi: number; 
    id: number;
    kode: number;
    nama: string;
    sks: number;
    semester: number;
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
    mata_kuliah: MataKuliah; // Make this optional
    waktu: number;
    dosen?: { nama: string }; // Make this optional
}

const TableSchedule = () => {
    const { data, loading, error } = useRealtime('jadwal', {
		select: '*, dosen:dosen(*), mata_kuliah:mata_kuliah(*)',
		filters: [{ column: 'mata_kuliah.prodi', value: 1 }],
		orderBy: { column: 'id', ascending: true },
	});

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSemester, setSelectedSemester] = useState<number | null>(null);

    const [selectedSchedule, setSelectedSchedule] = useState<Jadwal | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // Add safe filtering
    const filteredData = data.filter((schedule) => {
        // Check if mata_kuliah exists before accessing its properties
        const matchesSearch = schedule.mata_kuliah && (
            schedule.mata_kuliah.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
            schedule.mata_kuliah.kode.toString().includes(searchQuery)
        );

        const matchesSemester = selectedSemester === null || 
            (schedule.mata_kuliah && schedule.mata_kuliah.semester === selectedSemester);

        return matchesSearch && matchesSemester;
    });

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

    const handleRowClick = (schedule: Jadwal) => {
        setSelectedSchedule(schedule);
        setIsDetailModalOpen(true);
    };

    const handleCloseDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedSchedule(null);
    };

    // Add safe total SKS calculation
    const totalSKS = filteredData.reduce((total, course) => 
        course.mata_kuliah ? total + course.mata_kuliah.sks : total, 0);

    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="w-full flex flex-col gap-3">

			<div className="flex items-center gap-3">
                <select className="px-2 py-1 text-xs bg-gray-200 rounded" value={selectedSemester || ''} onChange={(e) => setSelectedSemester(e.target.value === '' ? null : Number(e.target.value))} >
                    <option value="">Semua Semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => (
                        <option key={semester} value={semester}>Semester {semester}</option>
                    ))}
                </select>
                <h1 className="text-xs">Total SKS: {totalSKS}</h1>
            </div>

            <div className="flex gap-3">
                <AddScheduleModal />
                <SearchInput placeholder="Search Mata Kuliah..." onSearch={(query) => setSearchQuery(query)} />
            </div>

            <div className="w-full flex flex-col gap-2">
                {loading ? Array(5).fill(0).map((_, index) => (
                    <div key={index} className="w-full flex items-center py-1 h-7 bg-gray-400 rounded text-xs px-4 gap-5 animate-pulse" />
                )) : currentItems.map((schedule, index) => (
                    schedule.mata_kuliah && schedule.dosen ? (
                        <div key={index} className="w-full flex items-center py-1 h-7 bg-[#E4E4E4] rounded text-xs px-4 gap-5" onClick={() => handleRowClick(schedule)}>
                            <div>{indexOfFirstItem + index + 1}</div>
                            <div>{schedule.mata_kuliah.kode}</div>
                            <div>{schedule.mata_kuliah.nama}</div>
                            <div>{schedule.mata_kuliah.sks}</div>
                            <div>{schedule.dosen.nama}</div>
                        </div>
                    ) : null
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

            <ScheduleDetailModal isModalOpen={isDetailModalOpen} schedule={selectedSchedule} onClose={handleCloseDetailModal}/>
        </div>
    );
};

export default TableSchedule;