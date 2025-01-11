'use client';

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

const AddCourseModal = () => {
  
	const supabase = createClient(); // Menggunakan Supabase client
	const [isOpen, setIsOpen] = useState(false);
	const [formData, setFormData] = useState({
		kode: "",
		nama: "",
		prodi: 1, // contoh prodi
		semester: '', // semester kosong awalnya
		sks: '',  // contoh SKS
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));

		console.log(formData);
		
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		console.log(formData);
		
		const { data, error } = await supabase
		.from("mata_kuliah")
		.insert([formData])
		.select();

		if (error) {
			console.error("Error inserting course:", error);
		} else {
			console.log("Course added:", data);
			setIsOpen(false);
		}
	};

	// Array untuk mendefinisikan fields dan properti masing-masing
	const inputFields = [
		{ label: "Kode Mata Kuliah", name: "kode", type: "text", required: true },
		{ label: "Nama Mata Kuliah", name: "nama", type: "text", required: true },
		{ label: "Sks", name: "sks", type: "number", required: true },
	];

	// Daftar semester untuk dropdown
	const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

	return (
		<>
		<button className="px-2 py-1 bg-[#b8b8b8] rounded" onClick={() => setIsOpen(true)}>Tambah</button>

		{isOpen && (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
				<div className="bg-white p-5 rounded shadow-lg text-xs">
					<h2 className="text-sm mb-5">Tambah Mata Kuliah</h2>
					<form onSubmit={handleSubmit} className="flex flex-col gap-5">
						<div className="flex flex-col gap-2">
							{/* Dropdown for Semester */}
							<div className="flex flex-col gap-1">
								<label className="block text-sm font-medium">Semester</label>
								<select name="semester" className="border border-gray-300 px-2 py-1 focus:outline-none rounded w-full" value={formData.semester}  onChange={handleInputChange}  required >
									{semesters.map((semester, index) => (
										<option key={index} value={semester} className="text-lg">
											{semester}
										</option>
									))}
								</select>
							</div>
							{/* Input Fields for Kode, Nama, SKS */}
							{inputFields.map((field) => (
								<div className="flex flex-col gap-1" key={field.name}>
									<label className="block text-sm font-medium">{field.label}</label>
									<input className="border border-gray-300 px-2 py-1 focus:outline-none rounded w-full" type={field.type} name={field.name} autoComplete="off" value={formData[field.name as keyof typeof formData] || ""} onChange={handleInputChange} required={field.required} />
								</div>
							))}
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

export default AddCourseModal;
