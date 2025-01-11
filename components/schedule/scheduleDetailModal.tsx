import React from 'react';
import EditCourseModal from '../course/EditCourseModal';
import DeleteCourseModal from '../course/DeleteCourseModal';
import EditScheduleModal from './EditScheduleModal';

interface MataKuliah {
	prodi: number; 
	id: number;
    kode: number;
    nama: string;
    sks: number;
    semester: number;
}

interface Jadwal {
	create_at: string; // Tipe string sesuai format timestamp ISO
	hari: number;
	id: number;
	id_dosen: number;
	id_kelas: number;
	id_mata_kuliah: number;
	jam_akhir: string; // Format waktu string, seperti "10:00:00+07"
	jam_mulai: string; // Format waktu string, seperti "20:00:00+07"
	mata_kuliah: MataKuliah; // Objek mata_kuliah di dalam jadwal
	waktu: number; // Properti numerik
}

type Props = {
	isModalOpen: boolean;
  	schedule: Jadwal | null;
	onClose: () => void;
};

const CourseDetailModal = ({isModalOpen, schedule, onClose}: Props) => {

	return (
		<>
			{isModalOpen && schedule && (
				<div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg w-96">
						<h2 className="text-xl mb-4">Schedule Details</h2>
						<div className="mb-2">
						<strong>Kode:</strong> {schedule.mata_kuliah.kode}
						</div>
						<div className="mb-2">
						<strong>Nama:</strong> {schedule.mata_kuliah.nama}
						</div>
						<div className="mb-2">
						<strong>SKS:</strong> {schedule.mata_kuliah.sks}
						</div>
						<div className="mb-2">
						<strong>Waktu:</strong> {schedule.waktu}
						</div>

						<div className="ml-auto flex gap-4 mt-4">
							<EditScheduleModal schedule={schedule} onClose={onClose} />
							<DeleteCourseModal table={'jadwal'} id={schedule.id} onClose={onClose} />
						</div>

						<div className="flex justify-end gap-3 mt-4">
							<button onClick={onClose} className="px-4 py-2 bg-gray-300 text-black rounded">Close</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default CourseDetailModal;
