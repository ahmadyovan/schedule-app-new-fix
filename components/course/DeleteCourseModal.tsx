'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Props {
    table: string;
    id: number;
    onClose: () => void
}

const DeleteCourseModal = ({ table, id, onClose }: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false); // Untuk mengontrol visibilitas modal
    const supabase = createClient();

    const handleDelete = async () => {
        console.log('tes');
        
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('id', id);
    
        if (error) {
          console.error('Error deleting course:', error.message);
        } else {
          setIsModalOpen(false);
          onClose(); 
        }
    };

    return (
        <>
            <button onClick={() => setIsModalOpen(true)} className="w-[50%] bg-[#ffbcbc] rounded hover:bg-[#e0a4a4] transition-colors"> Hapus </button>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg w-[90%] max-w-lg">
                        <h2 className="text-xl mb-4">Konfirmasi Hapus</h2>
                        <p className="mb-4">Apakah Anda yakin ingin menghapus course ini?</p>
                        <div className="flex justify-end gap-4">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" >
                                Tidak
                            </button>
                            <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" >
                                Ya
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DeleteCourseModal;
