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
    let today = new Date()

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      let endTime = new Date()
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21, 0, 0, 0)

      // setting hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(0)
      }
      else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let timeSlots = []

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime
        })

        // Increment current time by 1 hour instead of 30 minutes
        currentDate.setHours(currentDate.getHours() + 1)
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
        console.error("Error fetching lawyer info:", error)
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
    <div className='min-h-screen  py-6'>
      <div className='max-w-6xl mx-auto px-4'>
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column - Lawyer Info & Booking */}
          <div className='lg:col-span-2 space-y-4'>

            {/* Booking Slots Card - Compact */}
            <div className='bg-[#D8D8E3] rounded-lg border border-white border-opacity-50 overflow-hidden h-full flex flex-col' style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)' }}>
              <div className='bg-black text-white p-4'>
                <h2 className='text-lg font-bold flex items-center gap-2'>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  Book Your Appointment
                </h2>
                <p className='text-gray-300 text-xs mt-1'>Select your preferred date and time</p>
              </div>

              <div className='p-4'>
                {/* Date Selection - Compact */}
                <div className='mb-4'>
                  <h3 className='text-base font-semibold text-gray-900 mb-3'>Available Dates</h3>
                  <div className='flex gap-2 overflow-x-auto pb-2'>
                    {
                      lawyerSlots.length && lawyerSlots.map((item, index) => (
                        <div
                          onClick={() => setSlotIndex(index)}
                          className={`text-center py-2 px-3 min-w-[65px] rounded-lg cursor-pointer transition-all duration-200 border-2 ${slotIndex === index
                            ? 'bg-gradient-to-r from-[#6A0610] to-[#D00C1F] text-white border-[#6A0610] shadow-lg'
                            : 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md'
                            }`}
                          key={index}
                        >
                          <p className='text-xs font-medium opacity-75'>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                          <p className='text-lg font-bold'>{item[0] && item[0].datetime.getDate()}</p>
                          <p className='text-xs opacity-75'>
                            {item[0] && item[0].datetime.toLocaleDateString('en-US', { month: 'short' })}
                          </p>
                        </div>
                      ))
                    }
                  </div>
                </div>

                {/* Time Selection - Compact */}
                <div className='mb-4'>
                  <h3 className='text-base font-semibold text-gray-900 mb-3'>Available Times</h3>
                  <div className='grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2'>
                    {lawyerSlots.length && lawyerSlots[slotIndex].map((item, index) => (
                      <button
                        onClick={() => setSlotTime(item.time)}
                        className={`p-2 rounded-lg text-xs font-medium transition-all duration-200 border-2 ${item.time === slotTime
                          ? 'bg-gradient-to-r from-[#6A0610] to-[#D00C1F] text-white border-[#6A0610] shadow-lg'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-md'
                          }`}
                        key={index}
                      >
                        {item.time.toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Appointment Summary - Compact */}
                {slotTime && (
                  <div className='bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4'>
                    <h4 className='text-base font-semibold text-gray-900 mb-2'>Appointment Summary</h4>
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                      <div className='flex items-center gap-2'>
                        <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className='text-xs font-medium text-gray-900'>Date</p>
                          <p className='text-blue-600 font-semibold text-sm'>
                            {lawyerSlots[slotIndex][0] && lawyerSlots[slotIndex][0].datetime.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className='flex items-center gap-2'>
                        <div className='w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'>
                          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className='text-xs font-medium text-gray-900'>Time</p>
                          <p className='text-green-600 font-semibold text-sm'>{slotTime}</p>
                        </div>
                      </div>

                      <div className='flex items-center gap-2'>
                        <div className='w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center'>
                          <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className='text-xs font-medium text-gray-900'>Fee</p>
                          <p className='text-purple-600 font-semibold text-sm'>{currencySymbol}{lawyerInfo.fees}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Book Button - Compact */}
                <button
                  className={`w-full py-3 rounded-lg text-white font-semibold text-base transition-all duration-200 ${slotTime
                    ? 'bg-gradient-to-r from-[#6A0610] to-[#D00C1F] hover:from-[#7A0611] hover:to-[#E00C1F] shadow-lg hover:shadow-xl'
                    : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  disabled={!slotTime}
                >
                  {slotTime ? (
                    <span className='flex items-center justify-center gap-2'>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Confirm Appointment
                    </span>
                  ) : (
                    'Select Date & Time to Continue'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Lawyer Photo */}
          <div className='lg:col-span-1'>
            <div className='bg-[#D8D8E3] rounded-xl border border-white border-opacity-50 overflow-hidden sticky top-6' style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.06)' }}>
              <div className='relative'>
                <img
                  className='w-full h-80 object-cover'
                  src={lawyerInfo.image}
                  alt={`${lawyerInfo.name}`}
                />

                <div className="absolute top-4 right-4 bg-green-500 px-3 py-1 rounded-full text-sm font-medium text-white shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    Available Now
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <h3 className="text-white text-lg font-bold">{lawyerInfo.name}</h3>
                  <p className="text-gray-200 text-sm">{lawyerInfo.speciality} Specialist</p>
                </div>
              </div>

              <div className='p-4 space-y-3'>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-700'>Education</span>
                  <span className='font-semibold text-gray-900'> {lawyerInfo.degree}</span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-700'>Experience</span>
                  <span className='font-semibold text-gray-900'>{lawyerInfo.experience} Years</span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-700'>Rating</span>
                  <span className='font-semibold text-gray-900'>⭐ 4.9/5</span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-700'>Location</span>
                  <span className='font-semibold text-gray-900'>{lawyerInfo.district}</span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-700'>Method</span>
                  <span className='font-semibold text-gray-900'>{lawyerInfo.consultationMethod}</span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-700'>Consultation fee</span>
                  <span className='font-semibold text-gray-900'>{currencySymbol}{lawyerInfo.fees}</span>
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-700'>About</span>
                  <span className='font-semibold text-gray-900'>{lawyerInfo.about}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Lawyers Section */}
        <div className='mt-8'>
          <RelatedLawyers lawyerId={lawyerId} speciality={lawyerInfo.speciality} />
        </div>
      </div>
    </div>
  )
}

export default Appointment