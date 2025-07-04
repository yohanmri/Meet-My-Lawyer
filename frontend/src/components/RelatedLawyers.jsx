import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'


const RelatedLawyers = ({ speciality, lawyerId }) => {

  const { lawyers } = useContext(AppContext)

  const navigate = useNavigate()

  const [relLawyer, setRelLawyers] = useState([])

  useEffect(() => {
    if (lawyers.length > 0 && speciality) {
      const lawyersData = lawyers.filter((lawyer) => lawyer.speciality === speciality && lawyer._id !== lawyerId)
      setRelLawyers(lawyersData)
    }
  }, [lawyers, speciality, lawyerId])

  return (
    <div className='flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10'>
      <h1 className='text-3xl font-medium'>Top Lawyers to Book</h1>
      <p className='sm:w-1/3 text-center text-sm'>Simply brows through our extensive list of trusted lawyers</p>
      <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
        {relLawyer.slice(0, 5).map((item, index) => (
          <div onClick={() => { navigate(`/appointment/${item._id}`); scroll(0, 0) }} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-5' key={index}>
            <img className='bg-blue-50' src={item.image} alt="" />
            <div className='p-4'>
              <div className='flex items-center gap-2 text-sm text-center text-green-500'>
                <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Available</p>
              </div>
              <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
              <p className='text-gray-600 text-sm'>{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => { navigate('/lawyers'); scrollTo(0, 0) }} className='bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10'> more</button>
    </div>
  )
}

export default RelatedLawyers
