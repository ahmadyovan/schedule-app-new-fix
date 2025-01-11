'use client';

import { useRealtime } from '@/components/hook/useRealtimeCourses';
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, useCallback, useMemo } from 'react';

const supabase = createClient();

const Home = () => {
	const [activeSemester, setActiveSemester] = useState<number | null>(1);
	const [counts, setCounts] = useState<{ [key: number]: number }>({});
	const [isLoading, setIsLoading] = useState(true);
	const [selectedMatkul, setSelectedMatkul] = useState<number | null>(null);
	const [dosenList, setDosenList] = useState<{ id: number; nama: string }[]>([]);


	// Realtime data hook
	const { data = [], loading: loadingRealtime, error } = useRealtime('jadwal', {
		select: '*, mata_kuliah!inner(*)',
		filters: [{ column: 'mata_kuliah.prodi', value: 4 }],
		orderBy: { column: 'id', ascending: true },
	});

	// Fungsi untuk mengambil jumlah data dari prefMatkul
	const fetchPrefMatkulCount = useCallback(async (id_mata_kuliah: number) => {
		const { data, error } = await supabase
			.from('prefMatkul')
			.select('matkul')
			.eq('matkul', id_mata_kuliah);

		if (error) {
			console.error('Error fetching count:', error);
			return 0;
		}

		return data.length; // Menghitung jumlah data
	}, []);

	const handleSelectDosen = async (idMatkul: number) => {
		setSelectedMatkul(idMatkul);
	
		// Ambil daftar dosen dari database
		const { data, error } = await supabase.from('dosen').select('id, nama');
		if (error) {
			console.error('Error fetching dosen:', error);
			return;
		}
	
		setDosenList(data || []);
	};
	

	// Penyaringan data berdasarkan semester
	const filteredData = useMemo(() => {
		return data.filter((item) =>
			activeSemester === null || item.mata_kuliah.semester === activeSemester
		);
	}, [data, activeSemester]);

	// Mengambil jumlah data prefMatkul untuk setiap id_mata_kuliah
	useEffect(() => {
		const fetchCounts = async () => {
			if (!activeSemester) return; // Tidak ada semester aktif
			setIsLoading(true); // Memulai proses loading

			const newCounts: { [key: number]: number } = {};
			const semesterData = data.filter((item) => item.mata_kuliah.semester === activeSemester);

			for (const item of semesterData) {
				if (item.mata_kuliah?.id) {
					const count = await fetchPrefMatkulCount(item.mata_kuliah.id);
					newCounts[item.mata_kuliah.id] = count;
				}
			}

			setCounts(newCounts);
			setIsLoading(false); // Selesai proses loading
		};

		// Jalankan fetch saat website pertama kali dibuka atau activeSemester berubah
		fetchCounts();
	}, [activeSemester, data, fetchPrefMatkulCount]);

	// Sinkronisasi isLoading dengan loadingRealtime
	useEffect(() => {
		if (loadingRealtime) {
			setIsLoading(true);
		}
	}, [loadingRealtime]);

	return (
		<div className="h-full w-full flex flex-col items-center gap-5 xl:text-2xl text-black">
			<div className="w-full flex flex-col items-center">
				<h1>Manajemen Kurikulum</h1>
				<h1>Teknik Informatika</h1>
			</div>
			<div className="min-w-60 w-full">
				<div className="w-full flex gap-3">
					<div className="w-full flex flex-col gap-1">
						<div className="flex gap-2">
							<div className="w-full flex flex-col gap-2">
								<select
									id="semester-select"
									className="px-3 py-1 w-fit border border-gray-300 rounded-md text-sm focus:outline-none"
									value={activeSemester || ''}
									onChange={(e) => setActiveSemester(Number(e.target.value))}
								>
									<option value="" disabled>
										-- Pilih Semester --
									</option>
									{Array.from({ length: 8 }, (_, index) => (
										<option key={index} value={index + 1}>
											Semester {index + 1}
										</option>
									))}
								</select>
							</div>
						</div>

						<div className="w-full">
							{/* Header Table */}
							<div className="w-10/12 grid grid-cols-[5rem,10rem,1fr,5rem,20rem,10rem] items-center py-1 bg-[#E4E4E4] rounded px-4 gap-3 border border-black border-solid">
								<div className="text-center">No</div>
								<div>Kode</div>
								<div>Mata Kuliah</div>
								<div className="text-center">SKS</div>
								<div className="">Dosen</div>
								<div>Preferensi</div>
							</div>
						</div>

						{/* Scrollable Table */}
						<div className="h-full min-h-40 max-h-96 w-full flex flex-col overflow-hidden">
							<div className="h-full w-full overflow-y-scroll flex flex-col gap-1 scroll-snap-y scroll-snap-mandatory">
								{isLoading
									? Array(5)
											.fill(0)
											.map((_, index) => (
												<div
													key={index}
													className="grid grid-cols-4 items-center py-1 bg-gray-400 rounded px-4 gap-3 animate-pulse scroll-snap-align-start"
												/>
											))
									: filteredData.map((item, index) => (
											<div
												key={index}
												className="w-full flex items-center py-1 lowercase gap-3 cursor-pointer scroll-snap-align-start"
											>
												<div className="w-10/12 grid grid-cols-[5rem,10rem,1fr,5rem,20rem,10rem] gap-3 bg-[#E4E4E4] px-4 rounded border border-black border-solid">
													<div className="text-center">{index + 1}</div>
													<div>{item.mata_kuliah.kode}</div>
													<div>{item.mata_kuliah.nama}</div>
													<div className="text-center">{item.mata_kuliah.sks}</div>
													<div className="">{item.id_dosen ? item.id_dosen : 'belum dipilih'}</div>
													<div>{counts[item.mata_kuliah.id] || 0}</div>
												</div>
												<div>
													{item.id_dosen ? (
														<button className="py-1 px-2 text-nowrap"  onClick={() => handleSelectDosen(item.mata_kuliah.id)}>Ubah</button>
													) : (
														<button className="py-1 px-2 text-nowrap"  onClick={() => handleSelectDosen(item.mata_kuliah.id)}>Pilih</button>
													)}
												</div>
											</div>
										))}
							</div>
						</div>
					</div>
				</div>
			</div>

			{selectedMatkul && (
				<div className="w-full bg-gray-200 p-4 rounded shadow-md">
					<h3 className="text-lg font-bold">Pilih Dosen</h3>
					<ul className="list-disc pl-5">
						{dosenList.map((dosen) => (
							<li key={dosen.id} className="flex justify-between items-center">
								<span>{dosen.nama}</span>
								<button
									className="py-1 px-3 bg-blue-500 text-white rounded hover:bg-blue-700"
									// onClick={() => handleAssignDosen(selectedMatkul, dosen.id)}
								>
									Pilih
								</button>
							</li>
						))}
					</ul>
					<button
						className="mt-4 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-700"
						onClick={() => setSelectedMatkul(null)}
					>
						Batal
					</button>
				</div>
			)}
		</div>
	);
};

export default Home;
