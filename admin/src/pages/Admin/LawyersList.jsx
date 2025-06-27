// LawyersList.jsx
import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'


const LawyersList = () => {
    const { lawyers, aToken, getAllLawyers, changeAvailability } = useContext(AdminContext)

    useEffect(() => {
        if (aToken) {
            getAllLawyers()
        }
    }, [aToken])

    return (
        <div className='m-5 max-h-[90vh] overflow-y-scroll'>
            <h1 className='text-lg font-medium'>All lawyers</h1>
            <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
                {lawyers.map((item, index) => (
                    <div className=' border border-indigo-200 rounded-xl w-56 overflow-hidden cursor-pointer group' key={index}>
                        {/* Display the lawyer's image */}
                        <img
                            className='w-56 h-48 object-cover object-top bg-indigo-50 group-hover:bg-primary transition-all duration-500'
                            src={item.image}
                            alt={item.name || 'Lawyer'}
                            onError={(e) => {
                                e.target.src = '/placeholder-image.jpg';
                            }}
                        />

                        <div className='p-4'>
                            <p className='text-lg font-medium text-gray-900'>{item.name}</p>
                            <p className='text-sm text-gray-600'>{item.speciality}</p>
                            <div className='flex items-center gap-2 mt-2 p-2 rounded'>
                                <input
                                    onChange={() => changeAvailability(item._id)}
                                    className="accent-indigo-500"
                                    type="checkbox"
                                    checked={item.available}
                                />
                                <p className='text-sm'>Available</p>
                            </div>
                        </div>
                    </div>
                )
                )}
            </div>
        </div>
    )
}

export default LawyersList