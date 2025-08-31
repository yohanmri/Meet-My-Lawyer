import React, { useContext, useEffect, useState } from 'react';
import { LawyerContext } from '../../context/LawyerContext';
import { AppContext } from '../../context/AppContext';
import { MdCancel, MdCheckCircle } from 'react-icons/md';

const LawyerAppointment = () => {
    const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } = useContext(LawyerContext);
    const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        if (dToken) {
            getAppointments();
        }
    }, [dToken]);

    const filteredAppointments = appointments.filter(item => {
        const matchesStatus =
            filterStatus === 'all' ||
            (filterStatus === 'completed' && item.isCompleted) ||
            (filterStatus === 'cancelled' && item.cancelled) ||
            (filterStatus === 'upcoming' && !item.cancelled && !item.isCompleted);

        const matchesSearch = item.userData.name.toLowerCase().includes(searchQuery.toLowerCase());

        const appointmentDate = new Date(item.slotDate);
        const isAfterStart = startDate ? appointmentDate >= new Date(startDate) : true;
        const isBeforeEnd = endDate ? appointmentDate <= new Date(endDate) : true;

        return matchesStatus && matchesSearch && isAfterStart && isBeforeEnd;
    });

    return (
        <div className='w-full max-w-6xl m-5'>
            <p className='mb-3 text-lg font-medium'>All Appointments</p>

            {/* Filter Bar */}
            <div className='bg-white shadow-md p-4 mb-4 border border-gray-200 rounded-lg'>
                <div className='flex flex-wrap justify-between items-end gap-4'>
                    <div className='flex gap-2 flex-wrap'>
                        <button onClick={() => setFilterStatus('all')} className={`px-4 py-1 rounded-full border ${filterStatus === 'all' ? 'bg-[#6A0610] text-white' : 'text-gray-700'}`}>All</button>
                        <button onClick={() => setFilterStatus('completed')} className={`px-4 py-1 rounded-full border ${filterStatus === 'completed' ? 'bg-green-500 text-white' : 'text-gray-700'}`}>Completed</button>
                        <button onClick={() => setFilterStatus('cancelled')} className={`px-4 py-1 rounded-full border ${filterStatus === 'cancelled' ? 'bg-red-500 text-white' : 'text-gray-700'}`}>Cancelled</button>
                        <button onClick={() => setFilterStatus('upcoming')} className={`px-4 py-1 rounded-full border ${filterStatus === 'upcoming' ? 'bg-blue-500 text-white' : 'text-gray-700'}`}>Upcoming</button>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <input
                            type='text'
                            placeholder='Search by client name'
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className='px-3 py-1 border rounded-md text-sm text-gray-700'
                        />
                        <input
                            type='date'
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                            className='px-3 py-1 border rounded-md text-sm text-gray-700 bg-white shadow-sm'
                        />
                        <input
                            type='date'
                            value={endDate}
                            onChange={e => setEndDate(e.target.value)}
                            className='px-3 py-1 border rounded-md text-sm text-gray-700 bg-white shadow-sm'
                        />
                    </div>
                </div>
            </div>

            <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[50vh] overflow-y-scroll'>
                <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
                    <p>#</p>
                    <p>Client</p>
                    <p>Payment Status</p>
                    <p>Age</p>
                    <p>Date & Time</p>
                    <p>Fees</p>
                    <p>Action</p>
                </div>

                {filteredAppointments.slice().reverse().map((item, index) => (
                    <div
                        className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50'
                        key={index}
                    >
                        <p className='max-sm:hidden'>{index + 1}</p>
                        <div className='flex items-center gap-2'>
                            <img className='w-8 h-8 rounded-full object-cover' src={item.userData.image} alt='' />
                            <p>{item.userData.name}</p>
                        </div>
                        <div>
                            <p className='text-xs inline border border-[#6A0610] text-[#6A0610] px-2 rounded-full'>
                                {item.payment ? 'Online' : 'CASH'}
                            </p>
                        </div>
                        <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
                        <p>{slotDateFormat(item.slotDate)} | {item.slotTime}</p>
                        <p>{currency} {item.amount}</p>

                        {item.cancelled ? (
                            <p className='text-red-400 text-xs font-medium flex items-center gap-1'>
                                <MdCancel size={16} /> Cancelled
                            </p>
                        ) : item.isCompleted ? (
                            <p className='text-green-500 text-xs font-medium flex items-center gap-1'>
                                <MdCheckCircle size={16} /> Completed
                            </p>
                        ) : (
                            <div className='flex gap-2'>
                                <MdCancel
                                    onClick={() => cancelAppointment(item._id)}
                                    className='text-red-500 cursor-pointer'
                                    size={24}
                                />
                                <MdCheckCircle
                                    onClick={() => completeAppointment(item._id)}
                                    className='text-green-500 cursor-pointer'
                                    size={24}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};


export default LawyerAppointment;