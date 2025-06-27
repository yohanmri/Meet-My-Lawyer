import React, { useState } from 'react'
import { createContext } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';


export const AdminContext = createContext()

const AdminContextProvider = (props) => {

    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')

    const [lawyers, setLawyers] = useState([])

    const backendUrl = import.meta.env.VITE_BACKEND_URL


    const getAllLawyers = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/all-lawyers', {}, { headers: { aToken } })
            if (data.success) {
                setLawyers(data.lawyers)
                console.log(data.lawyers)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const value = {
        aToken, setAToken,
        backendUrl, lawyers,
        getAllLawyers
    }


    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider