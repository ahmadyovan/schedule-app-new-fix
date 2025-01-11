'use client';

import React, { useState, useMemo } from 'react';
import { useCourseContext } from '@/app/context/CourseContext';
import { useSchedule } from '@/app/context/scheduledosenContext';

type FormData = {
  matakuliah: string;
  jurusan: string;
  semester: string;
  waktu: string;
};

const INITIAL_FORM: FormData = {
  matakuliah: '',
  jurusan: '',
  semester: '',
  waktu: ''
};

const PRODI_NAMES = {
  1: "Informatika",
  2: "Mesin",
  3: "Industri",
  4: "Komputer",
  5: "DKV"
} as const;

const WAKTU_OPTIONS = ["Pagi", "Sore"];

export default function AddScheduleModal() {
	const [isOpen, setIsOpen] = useState(false);
	const [form, setForm] = useState<FormData>(INITIAL_FORM);
	const { courses } = useCourseContext();
	const { addItem } = useSchedule();


	const dropdownData = useMemo(() => {

		const getUniqueValues = <T,>(arr: T[]): T[] => { return Array.from(new Set(arr).values()); };
		const uniqueProdi = getUniqueValues(courses.map(c => c.course_prodi)).sort((a, b) => a - b);

		// Get unique semesters and sort
		const uniqueSemester = getUniqueValues(courses.map(c => c.course_semester)).sort((a, b) => parseInt(a.split(' ')[1]) - parseInt(b.split(' ')[1]));

		// Filter and map matakuliah
		const filteredMatakuliah = courses
		.filter(c => (
			(!form.jurusan || c.course_prodi.toString() === form.jurusan) &&
			(!form.semester || c.course_semester === form.semester)
		))
		.map(c => ({ id: c.course_id, name: c.course_name }));

		return {
			prodi: uniqueProdi.map(value => ({
				value: value.toString(),
				label: PRODI_NAMES[value as keyof typeof PRODI_NAMES]
			})),
			semester: uniqueSemester.map(value => ({
				value,
				label: value
			})),
			matakuliah: filteredMatakuliah
		};
	}, [courses, form.jurusan, form.semester]);

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.target;
		setForm(prev => ({
		  ...prev,
		  [name]: value,
		  // Hanya reset matakuliah jika yang berubah adalah jurusan atau semester
		  ...((['jurusan', 'semester'].includes(name)) && { matakuliah: '' })
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (Object.values(form).every(Boolean)) {
			addItem(form);
			setForm(INITIAL_FORM);
			setIsOpen(false);
		}
	};

	return (
		<div className='w-full'>
			<div className='flex justify-end'>
				<button className="px-2 py-2 text-xs bg-[#ccffbc] rounded" onClick={() => setIsOpen(true)}>Tambah</button>
			</div>
			

			{ isOpen && ( 
			<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
				<div className="w-full max-w-sm flex flex-col gap-5 bg-white p-5 rounded text-xs">
					<h2 className="text-center">Tambah Jadwal Mengajar</h2>
					
					<form onSubmit={handleSubmit} className="space-y-5 lowercase">
						<div className='space-y-2'>
							{/* Jurusan Select */}
							<SelectField label="Jurusan" name="jurusan" value={form.jurusan} onChange={handleChange} options={dropdownData.prodi} />

							{/* Semester Select */}
							<SelectField label="Semester" name="semester" value={form.semester} onChange={handleChange} options={dropdownData.semester} />

							{/* Matakuliah Select */}
							<SelectField label="Mata Kuliah" name="matakuliah" value={form.matakuliah} onChange={handleChange} disabled={!form.jurusan || !form.semester} options={dropdownData.matakuliah.map(m => ({ value: m.name, label: m.name, key: m.id }))} />

							{/* Waktu Select */}
							<SelectField label="Waktu" name="waktu" value={form.waktu} onChange={handleChange} options={WAKTU_OPTIONS.map(w => ({ value: w, label: w }))} />
						</div>
						

						<div className="flex justify-end gap-3">
							<button type="submit" className="px-2 py-2 rounded bg-green-300">Tambahkan</button>
							<button type="button" onClick={() => setIsOpen(false)} className="px-2 py-2 rounded bg-green-300">Batal</button>
						</div>
					</form>
				</div>
			</div>
			)}
		</div>
	)

	// Reusable Components
	type SelectFieldProps = {
		label: string;
		name: string;
		value: string;
		onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
		options: { value: string; label: string; key?: number }[];
		disabled?: boolean;
	};

	function SelectField({ label, name, value, onChange, options, disabled }: SelectFieldProps) {
		return (
			<div className="flex flex-col gap-1">
				<label>{label}</label>
				<select name={name} value={value} onChange={onChange} disabled={disabled} required className="border lowercase focus:outline-none px-2 py-1 rounded w-full disabled:bg-gray-100" >
				<option className='text-lg' value="">Pilih {label}</option>
				{options.map(({ value, label, key }) => (
					<option className='text-lg' key={key || value} value={value}>
					{label}
					</option>
				))}
				</select>
			</div>
		);
	}
}