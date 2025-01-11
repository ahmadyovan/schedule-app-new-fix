'use client'

import { createClient } from "@/utils/supabase/client";
import LogoutButton from "@/components/log-out-button";
import { useCallback, useEffect, useState } from "react";
import { useRealtime } from "@/components/hook/useRealtimeCourses";

interface DataItem {
    id: number;
    id_mata_kuliah: number;
    id_prodi: number;
    prodi: number;
    kode: number;
    nama: string;
    sks: number;
    semester: number;
}

type DayType = 'senin' | 'selasa' | 'rabu' | 'kamis' | 'jumat';
type TimeType = 'Pagi' | 'Malam';

interface ScheduleData {
    dosen: number;
    seninPagi: boolean;
    seninMalam: boolean;
    selasaPagi: boolean;
    selasaMalam: boolean;
    rabuPagi: boolean;
    rabuMalam: boolean;
    kamisPagi: boolean;
    kamisMalam: boolean;
    jumatPagi: boolean;
    jumatMalam: boolean;
    [key: string]: boolean | number; // Add index signature
}


const STORAGE_KEY = 'jadwal';
const MAX_SKS = 20;
const supabase = createClient(); 


const Penjadwalan = () => {


    const [items, setItems] = useState<DataItem[]>([]);
	const [modal1, setmodal1] = useState(false);
	const [selectedProdi, setSelectedProdi] = useState<number | null>(1);
	const [selectedSemester, setSelectedSemester] = useState<number | null>(1);
	const [selectedMataKuliah, setSelectedMataKuliah] = useState<number | null>(null);
	const [totalSKS, setTotalSKS] = useState<number>(0);
	const [modal2, setmodal2] = useState(false);
	const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
	const [timeSlots, setTimeSlots] = useState<{ day: string; time: string }[]>([]);
	const [showPopup, setShowPopup] = useState(false);
	const [selectedDay, setSelectedDay] = useState('Senin');
	const [selectedTime, setSelectedTime] = useState('Pagi');
	
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

	const handleAddTimeSlot = () => {
		setShowPopup(true); // Tampilkan popup untuk menambah waktu
	};
	
	const handlePopupCancel = () => {
		setShowPopup(false); // Sembunyikan popup tanpa menambah waktu
	};
	
	const handlePopupSave = () => {
		// Tambahkan waktu yang dipilih ke daftar
		setTimeSlots([...timeSlots, { day: selectedDay, time: selectedTime }]);
		setShowPopup(false);
	};
	
	const handleRemoveTimeSlot = (index: number) => {
		// Hapus waktu dari daftar
		setTimeSlots((prev) => prev.filter((_, i) => i !== index));
	};

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
		};

		saveData([...items, newItem]);

		setSelectedMataKuliah(null);

		setmodal1(false);
	};

	const deleteItem = useCallback((id: number) => {
		const updatedItems = items.filter((item) => item.id !== id);
		saveData(updatedItems);
	}, [items, saveData]);

	const handleSaveSchedule = async () => {
		try {
			const newSchedule: ScheduleData = {
				dosen: 1,
				seninPagi: true,
				seninMalam: true,
				selasaPagi: true,
				selasaMalam: true,
				rabuPagi: true,
				rabuMalam: true,
				kamisPagi: true,
				kamisMalam: true,
				jumatPagi: true,
				jumatMalam: true,
			};
	
			timeSlots.forEach((slot) => {
				const day = slot.day.toLowerCase() as DayType;
				const time = slot.time as TimeType;
				const key = `${day}${time}` as keyof ScheduleData;
				newSchedule[key] = false;
			});
	
			// Send data to database
			const { error: waktuerror } = await supabase.from('prefWaktu').insert([newSchedule]);
	
			if (waktuerror) {12
				alert('Gagal menyimpan preferensi waktu');
				console.error('Error inserting menyimpan preferensi waktu:', waktuerror);
			} else {
				alert('menyimpan preferensi waktu berhasil disimpan!');
			}
	
			const prevMatkul = items.map((item) => ({
				matkul: item.id_mata_kuliah,
				dosen: 1,
			}));
	
			const { error: jadwalError } = await supabase.from('prefMatkul').insert(prevMatkul);
		
			if (jadwalError) {
				alert('Gagal menyimpan preferensi matkul');
				console.error('Error inserting preferensi matkul:', jadwalError);
			} else {
				alert('preferensi matkul berhasil disimpan!');
			}
		} catch (error) {
			console.error('Unexpected error:', error);
			alert('Terjadi kesalahan saat menyimpan jadwal!');
		}
	};
	

	const handleCancel = () => {
		// Reset state dan tutup modal
		setTimeSlots([]);
		setShowPopup(false);
	};
    
    return(
        <div className="h-full w-full flex flex-col items-center text-black xl:text-2xl">
            <div className="w-full flex flex-col px-5 items-center sm:px-10">
                <div className="text-center py-3 pt-10">
                    <h1>Preferensi Mengajar</h1>
                </div>
                <div className="w-full min-w-60 max-w-7xl flex flex-col gap-3">

					<div className='w-full'>
                        <div className='flex items-center gap-2'>
                            <button onClick={() => setmodal1(true)} className="px-2 py-1 bg-[#b8b8b8] rounded">Tambah</button>
                           
                        </div>
                       
                    </div>

					<div className='w-full flex flex-col gap-2'>
                        <div className="w-10/12 grid grid-cols-[5rem_1fr_10rem_5rem_5rem] items-center bg-white py-1 pr-4 rounded">
                            <div className='text-center'>No</div>
                            <div>Mata Kuliah</div>
							<div className="text-center">semester</div>
							<div className="text-center">prodi</div>
                            <div className='text-center'>SKS</div>
                        </div>
                        <div className="w-full flex flex-col gap-2">
							{items.map((item, index) => (
								<div key={item.id} className="w-full flex items-center gap-2">
									<div className="w-10/12 grid grid-cols-[5rem_1fr_10rem_5rem_5rem] bg-white py-1 pr-4 rounded">
										<div className='text-center'>{index + 1}</div>
										<div className="overflow-hidden lowercase text-nowrap">{item.nama}</div>
										<div className='text-center'>{item.semester}</div>
										<div className="overflow-hidden text-center lowercase text-nowrap">{item.prodi}</div>
										<div className='text-center'>{item.sks}</div>
									</div>
									<button onClick={() => deleteItem(item.id)} className="px-2 py-1 bg-red-500 text-white rounded"> Delete </button>
								</div>
							))}
                        </div>
                    </div>

					<div className="flex gap-2">
                        <button onClick={() => setmodal2(true)} className="px-2 py-1 bg-[#b8b8b8] rounded">selesai</button>
						<p className=''>total sks: {totalSKS}</p> {/* Tampilkan total SKS */}
                    </div>
					
					{modal1 && (
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
                                            <button onClick={() => setmodal1(false)} className="px-3 py-1 bg-gray-500 text-white rounded">Batal</button>
                                            <button onClick={addItem} className="px-3 py-1 bg-blue-500 text-white rounded">Tambah</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {modal2 && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                <div className="bg-white p-6 rounded-lg max-w-md w-full flex flex-col">
									<h2 className="text-xl text-center font-semibold mb-4">
										Apakah Anda Ingin Menambahkan Jam Kosong Mengajar?
									</h2>
									<div className="flex flex-col gap-4">
										<button
											onClick={handleAddTimeSlot}
											className="px-4 py-2 bg-blue-500 text-white rounded self-center"
										>
											Tambah Jam Kosong
										</button>
										<ul className="list-disc pl-5">
											{timeSlots.map((slot, index) => (
												<li key={index} className="flex justify-between items-center">
													<span>
														{slot.day} - {slot.time}
													</span>
													<button
														onClick={() => handleRemoveTimeSlot(index)}
														className="text-red-500"
													>
														Hapus
													</button>
												</li>
											))}
										</ul>
									</div>
									<div className="flex justify-center gap-4 mt-4">
										<button
											onClick={handleSaveSchedule}
											className="px-4 py-2 bg-blue-500 text-white rounded"
										>
											Simpan
										</button>-
										<button
											onClick={() => setmodal2(false)}
											className="px-4 py-2 bg-blue-500 text-white rounded"
										>
											kembali
										</button>
									</div>
								</div>
                            </div>
                        )}

						{showPopup && (
								<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
									<div className="bg-white p-6 rounded-lg max-w-sm w-full">
										<h3 className="text-lg font-semibold text-center mb-4">
											Pilih Hari dan Waktu
										</h3>
										<div className="flex flex-col gap-4">
											<label>
												Hari:
												<select
													value={selectedDay}
													onChange={(e) => setSelectedDay(e.target.value)}
													className="w-full mt-1 p-2 border rounded"
												>
													<option value="Senin">Senin</option>
													<option value="Selasa">Selasa</option>
													<option value="Rabu">Rabu</option>
													<option value="Kamis">Kamis</option>
													<option value="Jumat">Jumat</option>
												</select>
											</label>
											<label>
												Waktu:
												<select
													value={selectedTime}
													onChange={(e) => setSelectedTime(e.target.value)}
													className="w-full mt-1 p-2 border rounded"
												>
													<option value="Pagi">Pagi</option>
													<option value="Malam">Malam</option>
												</select>
											</label>
										</div>
										<div className="flex justify-center gap-4 mt-4">
											<button
												onClick={handlePopupCancel}
												className="px-4 py-2 bg-gray-500 text-white rounded"
											>
												Batal
											</button>
											<button
												onClick={handlePopupSave}
												className="px-4 py-2 bg-blue-500 text-white rounded"
											>
												Simpan
											</button>
										</div>
									</div>
								</div>
							)}

                </div>
            </div>
        </div>
    )
}

export default Penjadwalan