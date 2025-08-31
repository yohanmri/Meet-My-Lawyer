import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { MdCheckCircle } from 'react-icons/md';

const Applications_lawyers = () => {
    // GET applications and getAllApplications from context
    const { aToken, applications, getAllApplications } = useContext(AdminContext);
    const [searchQuery, setSearchQuery] = useState('');

    // USE the context function instead of local one
    useEffect(() => {
        console.log('🚀 useEffect triggered, aToken:', aToken);
        if (aToken) {
            console.log('📞 Calling getAllApplications...');
            getAllApplications();
        }
    }, [aToken]);

    // Filter applications based on search query (with safety check)
    const filteredApplications = (applications || []).filter((app) =>
        app.application_name && app.application_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // DEBUG: Add console logs to see what's happening (AFTER filteredApplications is defined)
    console.log('🔍 Debug - applications from context:', applications);
    console.log('🔍 Debug - applications type:', typeof applications);
    console.log('🔍 Debug - applications length:', applications?.length);
    console.log('🔍 Debug - filteredApplications:', filteredApplications);

    // Log the entire context to see what's available
    const contextData = useContext(AdminContext);
    console.log('🔍 Debug - entire context keys:', Object.keys(contextData));

    return (
        <div className='w-full max-w-6xl m-5'>
            <p className='mb-3 text-lg font-medium'>Lawyer Applications</p>

            {/* Search Bar */}
            <div className='flex justify-between items-center mb-4'>
                <input
                    type='text'
                    placeholder='Search by applicant name'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='px-3 py-1 border rounded-md text-sm text-gray-700'
                />
            </div>

            {/* Table Header */}
            <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
                <div className='hidden sm:grid grid-cols-[0.5fr_3fr_2fr_2fr_2fr_2fr_1fr] py-3 px-6 border-b'>
                    <p>#</p>
                    <p>Name</p>
                    <p>Email</p>
                    <p>Speciality</p>
                    <p>Experience</p>
                    <p>District</p>
                    <p>Status</p>
                </div>

                {/* Table Rows */}
                {filteredApplications.length === 0 ? (
                    <div className='text-center py-8 text-gray-500'>
                        {applications === undefined ? 'Loading applications...' : 'No applications found'}
                    </div>
                ) : (
                    filteredApplications.map((app, index) => (
                        <div
                            key={index}
                            className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_2fr_2fr_2fr_2fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50'
                        >
                            <p className='max-sm:hidden'>{index + 1}</p>
                            <div className='flex items-center gap-2'>
                                <img
                                    className='w-8 h-8 rounded-full object-cover'
                                    src={app.application_image || '/default-user.png'}
                                    alt={app.application_name}
                                />
                                <p>{app.application_name}</p>
                            </div>
                            <p className='max-sm:hidden'>{app.application_email}</p>
                            <p>{app.application_speciality}</p>
                            <p>{app.application_experience}</p>
                            <p>{app.application_district}</p>
                            <p className='text-green-500 flex items-center gap-1 text-xs font-medium'>
                                <MdCheckCircle size={16} /> Pending
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Applications_lawyers;