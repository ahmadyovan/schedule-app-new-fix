'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { useRealtime } from './hook/useRealtimeCourses';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();
const STORAGE_KEY = 'jadwal';
const MAX_SKS = 20;

interface DataItem {
    id: number;
    id_mata_kuliah: number;
    id_prodi: number;
    prodi: number;
    kode: number;
    nama: string;
    sks: number;
    semester: number;
    id_waktu: number;
}

type SelectedDays = {
	Senin: number;
	Selasa: number;
	Rabu: number;
	Kamis: number;
	Jumat: number;
};

const SchedulePage = () => {
	const [items, setItems] = useState<DataItem[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const [selectedProdi, setSelectedProdi] = useState<number | null>(1);
	const [selectedSemester, setSelectedSemester] = useState<number | null>(1);
	const [selectedMataKuliah, setSelectedMataKuliah] = useState<number | null>(null);
	const [selectedTime, setSelectedTime] = useState<number | null>(null);
	const [totalSKS, setTotalSKS] = useState<number>(0);
	const [showModal, setShowModal] = useState(false);
	const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
	const [selectedDays, setSelectedDays] = useState<SelectedDays>({
		Senin: 0,
		Selasa: 0,
		Rabu: 0,
		Kamis: 0,
		Jumat: 0,
	});
	
	const { data: CourseData = [], loading: CourseLoading } = useRealtime('mata_kuliah', {
		filters: [{ column: 'prodi', value: selectedProdi }, { column: 'semester', value: selectedSemester }],
		orderBy: { column: 'id', ascending: true },
	});

	const { data: ProdiData = [] } = useRealtime('prodi', {
		orderBy: { column: 'id', ascending: true },
	});

	useEffect(() => {
		const storedData = localStorage.getItem(STORAGE_KEY);
		if (storedData) {
			try {
				const parsedItems: DataItem[] = JSON.parse(storedData);
				setItems(parsedItems);
				calculateTotalSKS(parsedItems);
			} catch (error) {
				console.error('Failed to parse local storage data', error);
			}
		}
	}, []);

	const saveData = useCallback((newItems: DataItem[]) => {
		setItems(newItems);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
		calculateTotalSKS(newItems);
	}, []);

	const calculateTotalSKS = useCallback((data: DataItem[]) => {
		const total = data.reduce((sum, item) => sum + item.sks, 0);
		setTotalSKS(total);
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.target;
		const parsedValue = parseInt(value, 10);

		if (name === 'prodi') {
			setSelectedProdi(parsedValue);
		} else if (name === 'semester') {
			setSelectedSemester(parsedValue);
		} else if (name === 'id_mata_kuliah') {
			setSelectedMataKuliah(parsedValue);
		}
	};

	const addItem = () => {

		if (!selectedMataKuliah) {
			alert('Lengkapi semua field');
			return;
		}

		const selectedCourse = CourseData.find((course) => course.id === selectedMataKuliah);

		if (!selectedCourse) {
			alert('Mata kuliah tidak valid');
			return;
		}

		if (totalSKS + selectedCourse.sks > MAX_SKS) {
			alert('Total SKS melebihi batas maksimum.');
			return;
		}

		const newItem: DataItem = {
			id: Date.now(),
			id_mata_kuliah: selectedMataKuliah,
			id_prodi: selectedProdi!,
			prodi: selectedProdi!,
			kode: selectedCourse.kode,
			nama: selectedCourse.nama,
			sks: selectedCourse.sks,
			semester: selectedSemester!,
			id_waktu: selectedTime!,
		};

		saveData([...items, newItem]);

		setSelectedMataKuliah(null);
		setSelectedTime(null);

		setIsOpen(false);
	};

	const deleteItem = useCallback((id: number) => {
		const updatedItems = items.filter((item) => item.id !== id);
		saveData(updatedItems);
	}, [items, saveData]);

	const handleSaveSchedule = async () => {
		try {
			const { data: preferensiData, error: preferensiError } = await supabase
			.from('preferensi')
			.insert({
				senin: selectedDays.Senin || 0,
				selasa: selectedDays.Selasa || 0,
				rabu: selectedDays.Rabu || 0,
				kamis: selectedDays.Kamis || 0,
				jumat: selectedDays.Jumat || 0,
			})
			.select();
	
			if (preferensiError || !preferensiData || preferensiData.length === 0) {
				console.error('Error inserting data into preferensi:', preferensiError);
				alert('Gagal menyimpan preferensi hari!');
				return;
			}
	
			const preferensiId = preferensiData[0].id;
	
			const formattedData = items.map((item) => ({
				id_matkul: item.id_mata_kuliah,
				id_dosen: 1, // Ganti sesuai kebutuhan
				id_preferensi: preferensiId,
			}));
	
			const { error: jadwalError } = await supabase.from('formdosen').insert(formattedData);
		
			if (jadwalError) {
				alert('Gagal menyimpan jadwal!');
				console.error('Error inserting jadwal:', jadwalError);
			} else {
				alert('Jadwal berhasil disimpan!');
			}
		} catch (error) {
			console.error('Unexpected error:', error);
			alert('Terjadi kesalahan saat menyimpan jadwal!');
		}
	};
	

	// Fungsi untuk menangani perubahan checkbox
	const handleDayChange = (day: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat', time: string) => {
		setSelectedDays((prev) => {
			const updatedDays = { ...prev };
			if (time === 'Pagi' && prev[day] === 2) {
				updatedDays[day] = 3; 
			} else if (time === 'Pagi') {
			updatedDays[day] = 1; 
			} else if (time === 'Sore' && prev[day] === 1) {
			updatedDays[day] = 3; 
			} else if (time === 'Sore') {
			updatedDays[day] = 2; 
			}
			return updatedDays;
		});
	};

	const handleCancel = () => {
		setShowModal(false);
	};
	

	const pageSize = 5;
	const totalPages = Math.ceil(items.length / pageSize);
	const [currentPage, setCurrentPage] = useState(1);
	const indexOfLastItem = currentPage * pageSize;
	const indexOfFirstItem = indexOfLastItem - pageSize;
	const currentItems = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);

	const nextPage = () => currentPage < totalPages && setCurrentPage((prev) => prev + 1);
	const prevPage = () => currentPage > 1 && setCurrentPage((prev) => prev - 1);

	return (
		<div className="flex flex-col gap-3">
			<div className='flex gap-2 items-center justify-between bg-white px-4 py-1 rounded'>
				<div className='flex items-center gap-2'>
					<button onClick={() => setIsOpen(true)} className="px-2 py-1 bg-blue-500 text-white rounded">Tambah</button>
					<p className='text-xs'>total sks: {totalSKS}</p> {/* Tampilkan total SKS */}
				</div>
				<div>
					<button onClick={() => setShowModal(true)} className="px-2 py-1 bg-blue-500 text-white rounded">Kirim</button>
				</div>
			</div>

			<div className='flex flex-col gap-1'>

				<div className="grid grid-cols-[1fr_5fr_1fr_1fr] items-center bg-white py-1 pr-4 rounded">
					<div className='text-center'>No</div>
					<div>Mata Kuliah</div>
					<div className='text-center'>SKS</div>
					<div className='px-2 opacity-0'>action</div>
				</div>

				<div className="w-full flex flex-col gap-1">
				{currentItems.map((item, index) => (
					<div key={item.id} className="grid grid-cols-[1fr_5fr_1fr_1fr] items-center bg-white py-1 pr-4 rounded">
					<div className='text-center'>{indexOfFirstItem + index + 1}</div>
					<div className="overflow-hidden lowercase text-nowrap">{item.nama}</div>
					<div className='text-center'>{item.sks}</div>
					<button onClick={() => deleteItem(item.id)} className="px-2 py-1 bg-red-500 text-white rounded"> Delete </button>
					</div>
				))}
				</div>

				<div className="flex justify-center items-center gap-5">
					<button onClick={prevPage} disabled={currentPage === 1} className="px-2 py-1 bg-gray-400 rounded disabled:opacity-0">
						<ChevronLeft size={18} />
					</button>
					<span>halaman {currentPage} dari {totalPages}</span>
					<button onClick={nextPage} disabled={currentPage >= totalPages} className="px-2 py-1 bg-gray-400 rounded disabled:opacity-0" >
						<ChevronRight size={18} />
					</button>
				</div>
			</div>

			{isOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
					<div className="bg-white p-4 rounded min-w-32 max:w-1/3">
						<h2 className="text-lg font-bold mb-4">Tambah Jadwal</h2>
						<div className="flex flex-col gap-3">
							<label> Program Studi
								<select value={selectedProdi ?? ''} onChange={handleChange} name="prodi" className="border border-gray-300 px-2 py-1 rounded w-full">
								<option value="" disabled>Pilih prodi</option>
								{ProdiData.map((prodi) => (
									<option key={prodi.id} value={prodi.id}>{prodi.nama}</option>
								))}
								</select>
							</label>

							<label> Semester
								<select value={selectedSemester ?? ''} onChange={handleChange} name="semester" className="border border-gray-300 px-2 py-1 rounded w-full">
								<option value="" disabled>Pilih Semester</option>
								{semesters.map((sem) => (
									<option key={sem} value={sem}>Semester {sem}</option>
								))}
								</select>
							</label>

							<label> Mata Kuliah
								<select value={selectedMataKuliah ?? ''} onChange={handleChange} name="id_mata_kuliah" className="border border-gray-300 px-2 py-1 rounded w-full">
								<option value="" disabled>Pilih Mata Kuliah</option>
								{CourseData.map((course) => (
									<option key={course.id} value={course.id}>{course.nama}</option>
								))}
								</select>
							</label>

							<div className="flex gap-2 justify-end mt-4">
								<button onClick={() => setIsOpen(false)} className="px-3 py-1 bg-gray-500 text-white rounded">Batal</button>
								<button onClick={addItem} className="px-3 py-1 bg-blue-500 text-white rounded">Tambah</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{showModal && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white p-6 rounded-lg max-w-md w-full flex flex-col">
						<h2 className="text-xl text-center font-semibold mb-4">Atur Preferensi Mengajar</h2>
						<div className="flex flex-col gap-1 items-center">
						{(Object.keys(selectedDays) as (keyof SelectedDays)[]).map((day) => (
							<div key={day} className="flex flex-col items-center text-sm">
								<h1 className="font-semibold">{day}</h1>
								<div className="flex gap-2">
								<label>
									<input
									type="checkbox"
									checked={selectedDays[day] === 1 || selectedDays[day] === 3}
									onChange={() => handleDayChange(day, 'Pagi')}
									/>
									Pagi
								</label>
								<label>
									<input
									type="checkbox"
									checked={selectedDays[day] === 2 || selectedDays[day] === 3}
									onChange={() => handleDayChange(day, 'Sore')}
									/>
									Sore
								</label>
								</div>
							</div>
							))}
						</div>

						<div className="flex justify-center gap-4 mt-4">
							<button onClick={handleCancel} className="px-4 py-2 bg-gray-500 text-white rounded">
								Batal
							</button>
							<button onClick={handleSaveSchedule} className="px-4 py-2 bg-blue-500 text-white rounded">
								Simpan
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default SchedulePage;
