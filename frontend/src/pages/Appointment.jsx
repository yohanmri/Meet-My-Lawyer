import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedLawyers from '../components/RelatedLawyers'

const Appointment = () => {
  const { lawyerId } = useParams()
  const { lawyers, currencySymbol } = useContext(AppContext)

  const [lawyerInfo, setLawyerInfo] = useState(null)

  const [lawyerSlots, setLawyerSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const getAvailableSlots = async () => {
    setLawyerSlots([])
    //getting current

    let today = new Date()

    for (let i = 0; i < 7; i++) {
      // getting date with index
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      // setting end time of the date with index
      let endTime = new Date()
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21, 0, 0, 0)

      // setting hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      }
      else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let timeSlots = []

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        // add slot to array
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime
        })

        // Increment current time by 30 minutes

        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      setLawyerSlots(prev => ([...prev, timeSlots]))
    }
  }




  useEffect(() => {
    const fetchLawyerInfo = () => {
      try {
        const foundLawyer = lawyers.find(lawyer => lawyer._id === lawyerId)
        setLawyerInfo(foundLawyer)
      } catch (error) {
        console.error("Error fetching lawyertor info:", error)
      }
    }



    fetchLawyerInfo()
  }, [lawyers, lawyerId])


  useEffect(() => {
    getAvailableSlots()
  }, [lawyerInfo])


  useEffect(() => {
    console.log(lawyerSlots);
  }, [lawyerSlots])


  return lawyerInfo && (
    <div>
      {/*-------Lawyer Details -----*/}
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={lawyerInfo.image} alt={`Dr. ${lawyerInfo.name}`} />
        </div>


        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bh-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          {/*-------Lawyer Info: name, degree, experience----*/}
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>{lawyerInfo.name}
            <img className='w-5' src={assets.verified_icon} alt="" />
          </p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{lawyerInfo.degree} - {lawyerInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{lawyerInfo.experience}</button>
          </div>
          {/*-------Lawyer About----*/}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>About <img src={assets.info_icon} alt="" /></p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{lawyerInfo.about}</p>
          </div>
          <p>
            Appointment fee: <span>{currencySymbol}{lawyerInfo.fees}</span>
          </p>
        </div>
      </div>

      {/*------------------Booking slots--------------------*/}

      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {
            lawyerSlots.length && lawyerSlots.map((item, index) => (
              <div onClick={() => setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border  border-gray-200'}`} key={index}>
                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
              </div>
            ))
          }
        </div>

        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {lawyerSlots.length && lawyerSlots[slotIndex].map((item, index) => (
            <p onClick={() => setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`} key={index}>
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>
        <button className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>Book an appointment</button>
      </div>
      {/*----------------Listing Related Lawyers-----------------*/}

      <RelatedLawyers lawyerId={lawyerId} speciality={lawyerInfo.speciality} />
    </div>
  )
}

export default Appointment