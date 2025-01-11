import React from 'react';
import EditCourseModal from './EditCourseModal';
import DeleteCourseModal from './DeleteCourseModal';

interface MataKuliah {
	prodi: number; 
	id: number;
    kode: number;
    nama: string;
    sks: number;
    semester: number;
}

type Props = {
	isModalOpen: boolean;
  	course: MataKuliah | null;
	onClose: () => void;
};

const CourseDetailModal = ({isModalOpen, course, onClose}: Props) => {

	return (
		<>
			{isModalOpen && course && (
				<div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
					<div className="bg-white p-6 rounded-lg shadow-lg w-96">
						<h2 className="text-xl mb-4">Course Details</h2>
						<div className="mb-2">
						<strong>Kode:</strong> {course.kode}
						</div>
						<div className="mb-2">
						<strong>Nama:</strong> {course.nama}
						</div>
						<div className="mb-2">
						<strong>SKS:</strong> {course.sks}
						</div>
						<div className="mb-2">
						<strong>Semester:</strong> {course.semester}
						</div>

						<div className="ml-auto flex gap-4 mt-4">
							<EditCourseModal course={course} onClose={onClose} />
							<DeleteCourseModal table={'mata_kuliah'} id={course.id} onClose={onClose} />
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
