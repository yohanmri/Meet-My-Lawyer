import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { toast } from "react-toastify";

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currencySymbol = 'Rs. '
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [lawyers, setLawyers] = useState([])


    const value = {
        lawyers,
        currencySymbol
    }

    const getLawyersData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/lawyer/list')
            if (data.success) {
                setLawyers(data.lawyers)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)

        }
    }

    useEffect(() => {
        getLawyersData()
    }, [])

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider