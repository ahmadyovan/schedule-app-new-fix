'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

type Course = {
    id: number;
    kode: number;
    nama: string;
    sks: number;
    semester: number;
};

type Props = {
    course: Course;
    onClose: () => void;
};

const EditCourseModal = ({ course, onClose }: Props) => {

    const supabase = createClient();

    const [isModalOpen, setIsModalOpen] = useState(false);

    // State untuk input form
    const [courseName, setCourseName] = useState('');
    const [courseKode, setCourseKode] = useState(0);
    const [courseSks, setCourseSks] = useState(0);
    const [courseSemester, setCourseSemester] = useState(0);

    const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

    useEffect(() => {
        if (course) {
            setCourseName(course.nama);
            setCourseKode(course.kode);
            setCourseSks(course.sks);
            setCourseSemester(course.semester);
        }
    }, [course]);

    const handleEdit = async () => {
        try {
            const { data, error } = await supabase
                .from('mata_kuliah')
                .update({
                    nama: courseName,
                    kode: courseKode,
                    sks: courseSks,
                    semester: courseSemester,
                })
                .eq('id', course.id)
                .select();

            if (error) throw new Error(error.message);

            alert('Course updated successfully!');
            setIsModalOpen(false);
            onClose();
        } catch (error: any) {
            alert(`Error updating course: ${error.message}`);
        }
    };

    return (
        <>
            <button onClick={() => setIsModalOpen(true)} className="w-[50%] bg-[#b8b8b8] rounded hover:bg-[#b0e0a4] transition-colors"> Edit </button>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg w-[90%] max-w-lg">
                        <h2 className="text-xl mb-4">Edit Course</h2>
                        <div className="flex flex-col gap-4">
                        <label>
                            Semester:
                            <select
                            value={courseSemester}
                            onChange={(e) =>
                                setCourseSemester(Number(e.target.value))
                            }
                            className="w-full p-2 border border-gray-300 rounded"
                            >
                            <option value="">Pilih Semester</option>
                            {semesters.map((sem) => (
                                <option key={sem} value={sem}>
                                {sem}
                                </option>
                            ))}
                            </select>
                        </label>
                        <label>
                            Course Name:
                            <input
                            type="text"
                            value={courseName}
                            onChange={(e) => setCourseName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            />
                        </label>
                        <label>
                            Course Kode:
                            <input
                            type="number"
                            value={courseKode}
                            onChange={(e) => setCourseKode(Number(e.target.value))}
                            className="w-full p-2 border border-gray-300 rounded"
                            />
                        </label>
                        <label>
                            Course SKS:
                            <input
                            type="number"
                            value={courseSks}
                            onChange={(e) => setCourseSks(Number(e.target.value))}
                            className="w-full p-2 border border-gray-300 rounded"
                            />
                        </label>
                        </div>
                        <div className="flex justify-end gap-4 mt-6">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleEdit}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Save
                        </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EditCourseModal;
