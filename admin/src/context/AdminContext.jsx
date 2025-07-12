import React, { useState } from 'react'
import { createContext } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';


export const AdminContext = createContext()

const AdminContextProvider = (props) => {



    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')

    const [lawyers, setLawyers] = useState([])
    const [appointments, setAppointments] = useState([])

    const backendUrl = import.meta.env.VITE_BACKEND_URL


    const getAllLawyers = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/all-lawyers', {}, { headers: { aToken } })
            if (data.success) {
                setLawyers(data.lawyers)
                console.log(data.lawyers)
                // Removed the recursive call that was causing infinite loop
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const changeAvailability = async (lawyerId) => {
        console.log('🔄 changeAvailability called with lawyerId:', lawyerId);
        console.log('🔑 Using token:', aToken);
        console.log('🌐 Backend URL:', backendUrl);

        try {
            console.log('📤 Making API request...');

            const { data } = await axios.post(
                backendUrl + '/api/admin/change-availability',
                { lawyerId },
                { headers: { aToken } }
            );

            console.log('📥 Full API Response:', data);
            console.log('✅ data.success:', data.success);
            console.log('💬 data.message:', data.message);
            console.log('📊 typeof data.success:', typeof data.success);

            if (data.success) {
                console.log('🎉 SUCCESS! About to show toast with message:', data.message);

                // Try different toast methods
                toast.success(data.message);
                console.log('📝 toast.success() called');

                // Also try without message to see if message is the issue
                toast.success('Availability changed successfully!');
                console.log('📝 backup toast.success() called');

                console.log('🔄 About to call getAllLawyers...');
                await getAllLawyers();
                console.log('✅ getAllLawyers completed');

            } else {
                console.log('❌ API returned success: false');
                console.log('❌ Error message:', data.message);
                toast.error(data.message || 'Failed to update availability');
            }

        } catch (error) {
            console.log('💥 Error occurred:', error);
            console.log('📋 Error response:', error.response?.data);
            console.log('🔍 Error message:', error.message);
            toast.error(error.response?.data?.message || error.message);
        }
    }

    const getAllAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { aToken } })

            if (data.success) {
                setAppointments(data.appointments)
                console.log(data.appointments);
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(data.message)
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllAppointments()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(data.message)

        }
    }


    const value = {
        aToken, setAToken,
        backendUrl, lawyers,
        getAllLawyers, changeAvailability,
        appointments, setAppointments,
        getAllAppointments,
        cancelAppointment
    }


    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}



export default AdminContextProvider