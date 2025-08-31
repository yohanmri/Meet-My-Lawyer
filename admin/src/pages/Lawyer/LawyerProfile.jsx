import React, { useContext, useEffect, useState } from 'react';
import { LawyerContext } from '../../context/LawyerContext';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const LawyerProfile = () => {
    const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(LawyerContext);
    const { currency } = useContext(AppContext);

    const [isEdit, setIsEdit] = useState(false);

    const updateProfile = async () => {
        try {
            const { data } = await axios.post(
                backendUrl + '/api/lawyer/update-profile',
                profileData,
                { headers: { dToken } }
            );

            if (data.success) {
                toast.success(data.message);
                setIsEdit(false);
                getProfileData();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    };

    useEffect(() => {
        getProfileData();
    }, [dToken]);

    return (
        profileData && (
            <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
                <div className='flex flex-col gap-6'>
                    <div>
                        <img className='w-full sm:max-w-xs rounded-xl border' src={profileData.image} alt='Profile' />
                    </div>

                    <div className='border border-stone-200 rounded-2xl p-6 bg-white shadow-sm'>
                        <div className='flex justify-between items-start'>
                            <div>
                                <h2 className='text-2xl font-bold text-gray-800'>{profileData.name}</h2>
                                <p className='text-sm text-gray-500'>{profileData.degree} - {profileData.speciality}</p>
                                <p className='text-xs bg-gray-100 rounded-full px-2 py-1 mt-1 inline-block'>{profileData.experience} Years</p>
                            </div>
                            <button onClick={() => setIsEdit(!isEdit)} className='text-sm text-[#6A0610] border border-[#6A0610] px-3 py-1 rounded-full hover:bg-[#6A0610] hover:text-white transition-all'>
                                {isEdit ? 'Cancel' : 'Edit'}
                            </button>
                        </div>

                        <div className='mt-5 space-y-3'>
                            <div>
                                <label className='text-sm font-semibold text-gray-600'>About</label>
                                <p className='text-sm text-gray-700'>
                                    {isEdit ? <textarea value={profileData.about} onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))} className='w-full mt-1 border rounded-md p-2 text-sm' /> : profileData.about}
                                </p>
                            </div>

                            <div>
                                <label className='text-sm font-semibold text-gray-600'>Email</label>
                                <p className='text-sm text-gray-700'>{profileData.email}</p>
                            </div>

                            <div>
                                <label className='text-sm font-semibold text-gray-600'>Phone</label>
                                <p className='text-sm text-gray-700'>{profileData.phone} / {profileData.office_phone || 'N/A'}</p>
                            </div>

                            <div>
                                <label className='text-sm font-semibold text-gray-600'>Bar Association</label>
                                <p className='text-sm text-gray-700'>{profileData.bar_association}</p>
                            </div>

                            <div>
                                <label className='text-sm font-semibold text-gray-600'>License Number</label>
                                <p className='text-sm text-gray-700'>{profileData.license_number}</p>
                            </div>

                            <div className='flex gap-3'>
                                <div className='w-1/2'>
                                    <label className='text-sm font-semibold text-gray-600'>District</label>
                                    <p className='text-sm text-gray-700'>{profileData.district}</p>
                                </div>
                                <div className='w-1/2'>
                                    <label className='text-sm font-semibold text-gray-600'>Court(s)</label>
                                    <p className='text-sm text-gray-700'>{profileData.court1}{profileData.court2 ? `, ${profileData.court2}` : ''}</p>
                                </div>
                            </div>

                            <div className='flex gap-3'>
                                <div className='w-1/2'>
                                    <label className='text-sm font-semibold text-gray-600'>Latitude</label>
                                    <p className='text-sm text-gray-700'>{profileData.latitude}</p>
                                </div>
                                <div className='w-1/2'>
                                    <label className='text-sm font-semibold text-gray-600'>Longitude</label>
                                    <p className='text-sm text-gray-700'>{profileData.longitude}</p>
                                </div>
                            </div>

                            <div>
                                <label className='text-sm font-semibold text-gray-600'>Languages Spoken</label>
                                <p className='text-sm text-gray-700'>{profileData.languages_spoken?.join(', ')}</p>
                            </div>

                            <div>
                                <label className='text-sm font-semibold text-gray-600'>Address</label>
                                <p className='text-sm text-gray-700'>
                                    {isEdit ? (
                                        <>
                                            <input type='text' value={profileData.address?.street} onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, street: e.target.value } }))} className='w-full border rounded-md px-3 py-1 text-sm mt-1' />
                                            <input type='text' value={profileData.address?.district} onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, district: e.target.value } }))} className='w-full border rounded-md px-3 py-1 text-sm mt-2' />
                                        </>
                                    ) : (
                                        <>
                                            {profileData.address?.street}, {profileData.address?.district}
                                        </>
                                    )}
                                </p>
                            </div>

                            <div>
                                <label className='text-sm font-semibold text-gray-600'>Appointment Fee</label>
                                <p className='text-sm text-gray-700'>{currency} {isEdit ? <input type='number' value={profileData.fees} onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))} className='ml-2 w-24 border rounded-md px-2 py-1 text-sm' /> : profileData.fees}</p>
                            </div>

                            <div className='flex gap-2 items-center'>
                                <input type='checkbox' checked={profileData.available} onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))} />
                                <label className='text-sm text-gray-700'>Available for Appointments</label>
                            </div>

                            {isEdit && (
                                <button onClick={updateProfile} className='mt-4 px-4 py-2 text-sm bg-[#6A0610] text-white rounded-full hover:bg-[#50040C] transition'>
                                    Save Changes
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default LawyerProfile;