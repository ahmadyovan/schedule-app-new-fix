'use client';

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRealtime } from "../hook/useRealtimeCourses";

const AddScheduleModal = () => {
  
	const supabase = createClient(); // Menggunakan Supabase client

	const { data: CourseData, loading: CourseLoading, error: CourseError } = useRealtime('mata_kuliah', {
		filters: [{ column: 'prodi', value: 1 }],
    	orderBy: { column: 'id', ascending: true },
	});

	const { data: DosenData, loading: DosenLoading, error: DosenError } = useRealtime('dosen', {
    	orderBy: { column: 'id', ascending: true },
	});

	const { data: KelasData, loading: KelasLoading, error: KelasError } = useRealtime('kelas', {
    	orderBy: { column: 'id', ascending: true },
	});

	const { data: WaktuData, loading: WaktuLoading, error: WaktuError } = useRealtime('waktu', {
    	orderBy: { column: 'id', ascending: true },
	});

	const [isOpen, setIsOpen] = useState(false);
	const [selectedSemester, setSelectedSemester] = useState(1); // State untuk semester
	const [formData, setFormData] = useState({
		id_mata_kuliah: 1,
		id_dosen: 1,
		waktu: 1, 
		id_kelas: 1,
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
	
		setFormData((prev) => ({
			...prev,
			[name]: name === 'id_mata_kuliah' || name === 'id_dosen' || name === 'id_kelas' || name === 'waktu'
				? parseInt(value, 10)
				: value,
		}));
	};

	const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedSemester(parseInt(e.target.value, 10)); // Ubah semester yang dipilih
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		console.log(formData);
		
		const { data, error } = await supabase
		.from("jadwal")
		.insert([formData])
		.select();

		if (error) {
			console.error("Error inserting course:", error);
		} else {
			console.log("Course added:", data);
		}
	};

	// Filter mata kuliah berdasarkan semester yang dipilih
	const filteredCourses = CourseData.filter((course) => course.semester === selectedSemester);

	return (
		<>
		<button className="px-2 py-1 text-xs bg-[#ccffbc] rounded" onClick={() => setIsOpen(true)}>Tambah</button>

		{isOpen && (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
				<div className="bg-white p-5 rounded shadow-lg text-xs">
					<h2 className="text-sm mb-5">Tambah Jadwal</h2>
					<form onSubmit={handleSubmit} className="flex flex-col gap-5">
						<div className="flex flex-col gap-2">
							{/* Dropdown Semester */}
							<div className="flex flex-col gap-1">
								<label className="block text-sm font-medium">Semester</label>
								<select name="semester" className="border border-gray-300 px-2 py-1 focus:outline-none rounded w-full" value={selectedSemester} onChange={handleSemesterChange} required>
									<option value={1}>Semester 1</option>
									<option value={2}>Semester 2</option>
									<option value={3}>Semester 3</option>
									<option value={4}>Semester 4</option>
									<option value={5}>Semester 5</option>
									<option value={6}>Semester 6</option>
									<option value={7}>Semester 7</option>
									<option value={8}>Semester 8</option>
								</select>
							</div>

							{/* Dropdown Mata Kuliah */}
							<div className="flex flex-col gap-1">
								<label className="block text-sm font-medium">Mata Kuliah</label>
								<select name="id_mata_kuliah" className="border border-gray-300 px-2 py-1 focus:outline-none rounded w-full" value={formData.id_mata_kuliah} onChange={handleInputChange} required>
									{filteredCourses.map((course, index) => (
										<option key={index} value={course.id}>
											{course.nama}
										</option>
									))}
								</select>
							</div>

							{/* Dropdown Dosen */}
							<div className="flex flex-col gap-1">
								<label className="block text-sm font-medium">Dosen</label>
								<select name="id_dosen" className="border border-gray-300 px-2 py-1 focus:outline-none rounded w-full" value={formData.id_dosen} onChange={handleInputChange} required>
									{DosenData.map((dosen, index) => (
										<option key={index} value={dosen.id}>
											{dosen.nama}
										</option>
									))}
								</select>
							</div>
						</div>
						<div className="flex gap-4">
							<button type="submit" className="bg-blue-500 text-white px-2 py-2 rounded">Simpan</button>
							<button type="button" className="bg-gray-300 px-2 py-2 rounded" onClick={() => setIsOpen(false)}>Batal</button>
						</div>
					</form>
				</div>
			</div>
		)}
		</>
	);
};

export default AddScheduleModal;
