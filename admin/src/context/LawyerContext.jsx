import React from 'react'
import { createContext } from "react";


export const LawyerContext = createContext()

const LawyerContextProvider = (props) => {
    const value = {

    }
    return (
        <LawyerContext.Provider value={value}>
            {props.children}
        </LawyerContext.Provider>
    )
}

export default LawyerContextProvider