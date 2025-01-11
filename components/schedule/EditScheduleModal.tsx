'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRealtime } from '../hook/useRealtimeCourses';

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
	mata_kuliah: MataKuliah;
	waktu: number;
}

type Props = {
    schedule: Jadwal;
    onClose: () => void;
};

const EditScheduleModal = ({ schedule, onClose }: Props) => {
    const supabase = createClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<Jadwal>({
        id: schedule.id,
        id_mata_kuliah: schedule.id_mata_kuliah,
        id_dosen: schedule.id_dosen,
        id_kelas: schedule.id_kelas,
        waktu: schedule.waktu,
        create_at: schedule.create_at,
        hari: schedule.hari,
        jam_akhir: schedule.jam_akhir,
        jam_mulai: schedule.jam_mulai,
        mata_kuliah: schedule.mata_kuliah,
    });

    const { data: CourseData, loading: CourseLoading } = useRealtime('mata_kuliah', {
        filters: [{ column: 'prodi', value: schedule.mata_kuliah.prodi }],
        orderBy: { column: 'id', ascending: true },
    });

    const { data: DosenData, loading: DosenLoading } = useRealtime('dosen', {
        filters: [{ column: 'prodi', value: schedule.mata_kuliah.prodi }],
        orderBy: { column: 'id', ascending: true },
    });

    const { data: KelasData, loading: KelasLoading } = useRealtime('kelas', {
        orderBy: { column: 'id', ascending: true },
    });

    const { data: WaktuData, loading: WaktuLoading } = useRealtime('waktu', {
        orderBy: { column: 'id', ascending: true },
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

    const handleEdit = async () => {
        try {
            const { error } = await supabase
                .from('jadwal')
                .update({
                    id_mata_kuliah: formData.id_mata_kuliah,
                    id_dosen: formData.id_dosen,
                    waktu: formData.waktu,
                    id_kelas: formData.id_kelas,
                })
                .eq('id', formData.id);

            if (error) throw new Error(error.message);

            alert('Schedule updated successfully!');
            setIsModalOpen(false);
            onClose();
        } catch (error: any) {
            alert(`Error updating schedule: ${error.message}`);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="w-[50%] py-2 bg-[#ccffbc] rounded hover:bg-[#b0e0a4] transition-colors">
                Edit
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg w-[90%] max-w-lg">
                        <h2 className="text-xl mb-4">Edit Schedule</h2>
                        <div className="flex flex-col gap-4">
                            <select
                                name="id_mata_kuliah"
                                className="border border-gray-300 px-2 py-1 focus:outline-none rounded w-full"
                                value={formData.id_mata_kuliah}
                                onChange={handleInputChange}
                                required
                            >
                                {CourseData?.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.nama}
                                    </option>
                                ))}
                            </select>

                            <select
                                name="id_dosen"
                                className="border border-gray-300 px-2 py-1 focus:outline-none rounded w-full"
                                value={formData.id_dosen}
                                onChange={handleInputChange}
                                required
                            >
                                {DosenData?.map((dosen) => (
                                    <option key={dosen.id} value={dosen.id}>
                                        {dosen.nama}
                                    </option>
                                ))}
                            </select>

                            <select
                                name="waktu"
                                className="border border-gray-300 px-2 py-1 focus:outline-none rounded w-full"
                                value={formData.waktu}
                                onChange={handleInputChange}
                                required
                            >
                                {WaktuData?.map((waktu) => (
                                    <option key={waktu.id} value={waktu.id}>
                                        {waktu.nama}
                                    </option>
                                ))}
                            </select>

                            <select
                                name="id_kelas"
                                className="border border-gray-300 px-2 py-1 focus:outline-none rounded w-full"
                                value={formData.id_kelas}
                                onChange={handleInputChange}
                                required
                            >
                                {KelasData?.map((kelas) => (
                                    <option key={kelas.id} value={kelas.id}>
                                        {kelas.kode}
                                    </option>
                                ))}
                            </select>
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

export default EditScheduleModal;
