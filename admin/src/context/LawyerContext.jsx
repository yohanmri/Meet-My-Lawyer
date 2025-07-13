import React, { useState } from 'react'
import { createContext } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'


export const LawyerContext = createContext()

const LawyerContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '')

    const [appointments, setAppointments] = useState([])

    const [dashData, setDashData] = useState(false)

    const getAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/lawyer/appointments', { headers: { dToken } })
            if (data.success) {
                setAppointments(data.appointments)
                console.log(data.appointments)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    //Function to mark the appointment completed

    const completeAppointment = async (appointmentId) => {

        try {
            const { data } = await axios.post(backendUrl + '/api/lawyer/complete-appointment', { appointmentId }, { headers: { dToken } })
            if (data.success) {
                toast.success(data.message)
                getAppointments()
            } else {
                toast.error(data.message)
            }


        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }


    //Function to mark the appointment cancel

    const cancelAppointment = async (appointmentId) => {

        try {
            const { data } = await axios.post(backendUrl + '/api/lawyer/cancel-appointment', { appointmentId }, { headers: { dToken } })
            if (data.success) {
                toast.success(data.message)
                getAppointments()
            } else {
                toast.error(data.message)
            }


        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const getDashData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/lawyer/dashboard', { headers: { dToken } })
            if (data.success) {
                setDashData(data.dashData)
                console.log(data.dashData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const value = {
        dToken, setDToken,
        backendUrl,
        appointments, setAppointments,
        getAppointments,
        completeAppointment, cancelAppointment,
        dashData, setDashData, getDashData,
    }
    return (
        <LawyerContext.Provider value={value}>
            {props.children}
        </LawyerContext.Provider>
    )
}

export default LawyerContextProvider