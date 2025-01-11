'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRealtimeSchedule, ScheduleWithRelations } from '@/components/hook/useRealtimeSchedule';
import { UserData } from '@/types/userData';

const ITEMS_PER_PAGE = 5;

type ScheduleContextType = {
    schedule: ScheduleWithRelations[];
    userData: UserData | null;
    selectedDay: number | null;
    selectedProdi: number | null;
    selectedScheduleId: number | null;
    isLoading: boolean;
    currentPage: number;
    totalPages: number;
    getCurrentPageData: () => ScheduleWithRelations[];
    nextPage: () => void;
    prevPage: () => void;
    setCurrentPage: (page: number) => void;
    setSelectedDay: (day: number | null) => void;
    setSelectedProdi: (prodi: number | null) => void;
    setSelectedScheduleId: (scheduleId: number | null) => void;
    updateSchedule: (newSchedule: ScheduleWithRelations) => void;
    deleteSchedule: (scheduleId: number) => void;
};

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
    const allSchedules = useRealtimeSchedule();
    const [schedules, setSchedules] = useState<ScheduleWithRelations[]>([]);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [selectedProdi, setSelectedProdi] = useState<number | null>(null);
    const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredSchedules = schedules
        .filter((schedule) => {
            if (!selectedProdi || !schedule.mata_kuliah) return true;
            return schedule.mata_kuliah.prodi === selectedProdi;
        })
        .filter((schedule) => (selectedDay ? schedule.hari === selectedDay : true))
        .filter((schedule) => (selectedScheduleId ? schedule.id === selectedScheduleId : true));

    const totalPages = Math.ceil(filteredSchedules.length / ITEMS_PER_PAGE);

    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredSchedules.slice(startIndex, endIndex);
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedDay, selectedScheduleId]);

    useEffect(() => {
        setIsLoading(true);
        if (userData) {
            const filteredSchedules = allSchedules.filter(schedule => 
                schedule.mata_kuliah?.prodi === userData.user_prodi
            );
            setSchedules(filteredSchedules);
        } else {
            setSchedules(allSchedules);
        }
        const timeout = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [allSchedules, userData]);

    const updateSchedule = (newSchedule: ScheduleWithRelations) => {
        setSchedules(prevSchedules => {
            const index = prevSchedules.findIndex(schedule => schedule.id === newSchedule.id);
            if (index !== -1) {
                return prevSchedules.map(schedule => 
                    schedule.id === newSchedule.id ? newSchedule : schedule
                );
            }
            return [newSchedule, ...prevSchedules];
        });
    };
    
    const deleteSchedule = (scheduleId: number) => {
        setSchedules(prevSchedules => 
            prevSchedules.filter(schedule => schedule.id !== scheduleId)
        );
    };

    return (
        <ScheduleContext.Provider value={{ 
            schedule: schedules, 
            userData, 
            selectedDay,
            selectedProdi,
            selectedScheduleId,
            isLoading,
            currentPage,
            totalPages,
            getCurrentPageData,
            nextPage,
            prevPage,
            setCurrentPage,
            setSelectedDay,
            setSelectedProdi,
            setSelectedScheduleId,
            updateSchedule,
            deleteSchedule
        }}>
            {children}
        </ScheduleContext.Provider>
    );
};

export const useScheduleContext = () => {
    const context = useContext(ScheduleContext);
    if (!context) {
        throw new Error('useScheduleContext must be used within a ScheduleProvider');
    }
    return context;
};