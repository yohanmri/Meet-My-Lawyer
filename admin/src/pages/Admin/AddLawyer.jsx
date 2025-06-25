import React, { useState } from 'react';
import { assets } from '../../assets/assets'

export default function LawyerRegistrationForm() {


    

    return (
        <form className='m-5 w-full'>
            <p className='mb-3 text-lg font-medium'>Add Lawyer</p>
            <div className='bg white px-8 py-8 border rounded w-full max-h-[80vh] overflow-y-scroll'>
                <div className='max-w-full mx-auto'>

                    {/* Three Column Grid */}
                    <div className='grid grid-cols-1 lg:grid-cols-5 gap-4 h-full'>

                        {/* Left Column - Personal & Location */}
                        <div className='flex flex-col gap-4 h-full'>

                            {/* Personal Information */}
                            <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-1'>
                                <h3 className='text-lg font-semibold text-[#515151] mb-4'>Profile Photo</h3>

                                {/* Image Upload */}
                                <div className='flex flex-col items-center gap-2'>
                                    <label htmlFor="lawyer-img" className='cursor-pointer'>
                                        <img src={assets.upload_area} className='w-16 bg-gray-100 rounded-full cursor-pointer' alt="" />
                                    </label>
                                    <input type="file" id="lawyer-img" hidden />
                                    <p className='text-[#515151] text-xs text-center leading-tight'>Upload Lawyer's<br />picture</p>
                                </div>


                            </div>
                            {/* Languages */}
                            <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-1'>
                                <h3 className='text-lg font-semibold text-[#515151] mb-4'>Languages Spoken</h3>
                                <div className='flex flex-col gap-3'>
                                    <label className='flex items-center gap-3 text-sm text-[#515151]'>
                                        <input type="checkbox" value="Sinhala" className='w-4 h-4 rounded' />
                                        Sinhala
                                    </label>
                                    <label className='flex items-center gap-3 text-sm text-[#515151]'>
                                        <input type="checkbox" value="Tamil" className='w-4 h-4 rounded' />
                                        Tamil
                                    </label>
                                    <label className='flex items-center gap-3 text-sm text-[#515151]'>
                                        <input type="checkbox" value="English" className='w-4 h-4 rounded' />
                                        English
                                    </label>
                                </div>
                            </div>
                            {/* Additional Information */}
                            <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-1'>
                                <h3 className='text-lg font-semibold text-[#515151] mb-4'>Additional Info</h3>
                                <div className='grid grid-cols-1 gap-3 h-full'>
                                    <div className='w-full flex-1'>
                                        <textarea
                                            placeholder='Tell us about yourself and your practice'
                                            className='border border-gray-300 rounded w-full p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-22'
                                            required
                                        ></textarea>
                                    </div>
                                    <div className='w-full'>

                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Middle Column - Professional Information */}
                        <div className='flex flex-col gap-4 h-full'>


                            {/* Personal Information */}
                            <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-1'>
                                <h3 className='text-lg font-semibold text-[#515151] mb-4'>Personal Information</h3>



                                {/* Personal Fields */}
                                <div className='grid grid-cols-1 gap-3'>
                                    <div className='w-full'>
                                        <p className='text-[#515151] text-sm mb-1'>Lawyer Name</p>
                                        <input
                                            type="text"
                                            placeholder='Name'
                                            className='border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            required
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <p className='text-[#515151] text-sm mb-1'>Lawyer Email</p>
                                        <input
                                            type="email"
                                            placeholder='Email'
                                            className='border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            required
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <p className='text-[#515151] text-sm mb-1'>Phone Number</p>
                                        <input
                                            type="tel"
                                            placeholder='Phone'
                                            className='border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            required
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <p className='text-[#515151] text-sm mb-1'>Gender</p>
                                        <select className='border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent' required>
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className='w-full'>
                                        <p className='text-[#515151] text-sm mb-1'>Date of Birth</p>
                                        <input
                                            type="date"
                                            className='border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <p className='text-[#515151] text-sm mb-1'>Lawyer Password</p>
                                        <input
                                            type="password"
                                            placeholder='Password'
                                            className='border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            required
                                        />
                                    </div>
                                </div>
                            </div>


                        </div>

                        {/* middle 2 Column - Languages & Additional Info */}
                        <div className='flex flex-col gap-4 h-full'>

                            {/* Professional Information */}
                            <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-1'>
                                <h3 className='text-lg font-semibold text-[#515151] mb-4'>Professional Info</h3>
                                <div className='grid grid-cols-1 gap-3'>
                                    <div className='w-full'>
                                        <p className='text-[#515151] text-sm mb-1'>Speciality</p>
                                        <select className='border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent' required>
                                            <option value="">Select Speciality</option>
                                            <option value="Criminal Law">Criminal Law</option>
                                            <option value="Civil Law">Civil Law</option>
                                            <option value="Family Law">Family Law</option>
                                            <option value="Corporate Law">Corporate Law</option>
                                            <option value="Immigration Law">Immigration Law</option>
                                            <option value="Property Law">Property Law</option>
                                        </select>
                                    </div>
                                    <div className='w-full'>
                                        <p className='text-[#515151] text-sm mb-1'>Degree</p>
                                        <input
                                            type="text"
                                            placeholder='e.g., LLB, LLM'
                                            className='border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            required
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <p className='text-[#515151] text-sm mb-1'>Office Phone (Optional)</p>
                                        <input
                                            type="tel"
                                            placeholder='Office Phone'
                                            className='border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <p className='text-[#515151] text-sm mb-1'>License Number</p>
                                        <input
                                            type="text"
                                            placeholder='License Number'
                                            className='border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            required
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <p className='text-[#515151] text-sm mb-1'>Bar Association</p>
                                        <input
                                            type="text"
                                            placeholder='Bar Association'
                                            className='border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            required
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <p className='text-[#515151] text-sm mb-1'>Experience (Years)</p>
                                        <input
                                            type="number"
                                            placeholder='Years of Experience'
                                            className='border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            required
                                        />
                                    </div>
                                </div>
                            </div>





                        </div>

                        {/* middle 3 Column - Languages & Additional Info */}
                        <div className='flex flex-col gap-4 h-full'>
                            {/* Professional Type & Fees */}
                            <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-1'>
                                <h3 className='text-lg font-semibold text-[#515151] mb-4'>Professional Details</h3>
                                <div className='grid grid-cols-1 gap-3'>
                                    <div className='w-full'>
                                        <p className='text-[#515151] text-sm mb-1'>Legal Professional Type</p>
                                        <select className='border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent' required>
                                            <option value="">Select Type</option>
                                            <option value="Attorney-at-Law">Attorney-at-Law</option>
                                            <option value="Advocate">Advocate</option>
                                            <option value="Notary Public">Notary Public</option>
                                            <option value="Legal Consultant">Legal Consultant</option>
                                        </select>
                                    </div>
                                    <div className='w-full'>
                                        <p className='text-[#515151] text-sm mb-1'>Consultation Fees (LKR)</p>
                                        <input
                                            type="number"
                                            placeholder='Fees'
                                            className='border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            required
                                        />
                                    </div>
                                </div>

                            </div>

                            {/* Courts */}
                            <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-1'>
                                <h3 className='text-lg font-semibold text-[#515151] mb-4'>Courts</h3>
                                <div className='grid grid-cols-1 gap-3'>
                                    <div className='w-full'>
                                        <p className='text-[#515151] text-sm mb-1'>Primary Court</p>
                                        <input
                                            type="text"
                                            placeholder='Primary Court'
                                            className='border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            required
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <p className='text-[#515151] text-sm mb-1'>Secondary Court (Optional)</p>
                                        <input
                                            type="text"
                                            placeholder='Secondary Court'
                                            className='border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>


                        {/* middle 3 Column - Languages & Additional Info */}
                        <div className='flex flex-col gap-4 h-full'>
                            {/* Location Information */}
                            <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-1'>
                                <h3 className='text-lg font-semibold text-[#515151] mb-4'>Location Information</h3>
                                <div className='grid grid-cols-1 gap-3'>
                                    <div className='w-full'>
                                        <p className='text-[#515151] text-sm mb-1'>District</p>
                                        <select className='border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent' required>
                                            <option value="">Select District</option>
                                            <option value="Colombo">Colombo</option>
                                            <option value="Gampaha">Gampaha</option>
                                            <option value="Kalutara">Kalutara</option>
                                            <option value="Kandy">Kandy</option>
                                            <option value="Matale">Matale</option>
                                            <option value="Nuwara Eliya">Nuwara Eliya</option>
                                            <option value="Galle">Galle</option>
                                            <option value="Matara">Matara</option>
                                            <option value="Hambantota">Hambantota</option>
                                            <option value="Jaffna">Jaffna</option>
                                            <option value="Kilinochchi">Kilinochchi</option>
                                            <option value="Mannar">Mannar</option>
                                            <option value="Vavuniya">Vavuniya</option>
                                            <option value="Mullaitivu">Mullaitivu</option>
                                            <option value="Batticaloa">Batticaloa</option>
                                            <option value="Ampara">Ampara</option>
                                            <option value="Trincomalee">Trincomalee</option>
                                            <option value="Kurunegala">Kurunegala</option>
                                            <option value="Puttalam">Puttalam</option>
                                            <option value="Anuradhapura">Anuradhapura</option>
                                            <option value="Polonnaruwa">Polonnaruwa</option>
                                            <option value="Badulla">Badulla</option>
                                            <option value="Moneragala">Moneragala</option>
                                            <option value="Ratnapura">Ratnapura</option>
                                            <option value="Kegalle">Kegalle</option>
                                        </select>
                                    </div>
                                    <div className='w-full'>
                                        <p className='text-[#515151] text-sm mb-1'>Address</p>
                                        <textarea
                                            placeholder='Complete Address'
                                            className='border border-gray-300 rounded w-full p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            required
                                            rows="3"
                                        ></textarea>
                                    </div>
                                    <div className='w-full'>
                                        <p className='text-[#515151] text-sm mb-1'>Latitude</p>
                                        <input
                                            type="number"
                                            step="any"
                                            placeholder='Latitude'
                                            className='border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            required
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <p className='text-[#515151] text-sm mb-1'>Longitude</p>
                                        <input
                                            type="number"
                                            step="any"
                                            placeholder='Longitude'
                                            className='border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            required
                                        />
                                    </div>
                                </div>

                            </div>

                            <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-1 justify-center'>
                                {/* Submit Button */}
                                <div className="mt-6 flex justify-center">
                                    <button className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>
                                        Add Lawyer
                                    </button>
                                </div>
                            </div>


                        </div>

                        {/* Right Column - Languages & Additional Info */}
                        <div className='flex flex-col gap-4 h-full'>



                        </div>
                    </div>


                </div>
            </div >
        </form>
    );
}