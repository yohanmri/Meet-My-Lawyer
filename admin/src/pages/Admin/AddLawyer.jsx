import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify'
import axios from 'axios';


export default function LawyerRegistrationForm() {

    const [lawyerImg, setLawyerImg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [gender, setGender] = useState('Male') // Set default to avoid empty option issue
    const [dateOfBirth, setDateOfBirth] = useState('')
    const [password, setPassword] = useState('')
    const [speciality, setSpeciality] = useState('General Practice')
    const [degree, setDegree] = useState('')
    const [officePhone, setOfficePhone] = useState('')
    const [licenseNumber, setLicenseNumber] = useState('')
    const [barAssociation, setBarAssociation] = useState('')
    const [experience, setExperience] = useState('')
    const [professionalType, setProfessionalType] = useState('Attorney-at-Law')
    const [consultationFees, setConsultationFees] = useState('')
    const [primaryCourt, setPrimaryCourt] = useState('')
    const [secondaryCourt, setSecondaryCourt] = useState('')
    const [district, setDistrict] = useState('Colombo')
    const [address, setAddress] = useState('')
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const [languages, setLanguages] = useState([])
    const [additionalInfo, setAdditionalInfo] = useState('')

    const { backendUrl, aToken } = useContext(AdminContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {
            if (!lawyerImg) {
                return toast.error('Image Not Selected')
            }

            // Validate at least one language is selected
            if (languages.length === 0) {
                return toast.error('Please select at least one language')
            }

            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(lawyerImg.type)) {
                return toast.error('Please select a valid image file (JPEG, PNG, WebP)')
            }

            // Validate file size (5MB limit)
            if (lawyerImg.size > 5 * 1024 * 1024) {
                return toast.error('Image size should be less than 5MB')
            }

            const formData = new FormData()
            formData.append('image', lawyerImg);
            formData.append('name', name);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('gender', gender);
            formData.append('dob', dateOfBirth);
            formData.append('password', password);
            formData.append('speciality', speciality);
            formData.append('degree', degree);
            formData.append('office_phone', officePhone);
            formData.append('license_number', licenseNumber);
            formData.append('bar_association', barAssociation);
            formData.append('experience', experience);
            formData.append('legal_professionals', professionalType);
            formData.append('fees', Number(consultationFees));
            formData.append('court1', primaryCourt);
            formData.append('court2', secondaryCourt);
            formData.append('district', district);

            // Address as JSON string since schema expects Object
            formData.append('address', JSON.stringify({
                street: address,
                district: district
            }));

            formData.append('latitude', Number(latitude));
            formData.append('longitude', Number(longitude));
            formData.append('about', additionalInfo);

            // Add missing required fields
            formData.append('available', true);
            formData.append('date', Date.now());

            // Languages array
            languages.forEach(lang => {
                formData.append('languages_spoken[]', lang);
            });

            // Console log formdata
            console.log('=== FormData Contents ===');
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }


            const { data } = await axios.post(backendUrl + '/api/admin/add-lawyer', formData, { headers: { aToken } })

            if (data.success) {
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }

            // TODO: Add actual API call here
            /*
            const response = await fetch(`${backendUrl}/api/admin/add-lawyer`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${aToken}`
                },
                body: formData
            });
    
            if (response.ok) {
                toast.success('Lawyer added successfully');
                // Reset form or redirect
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to add lawyer');
            }
            */

        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred while adding the lawyer');
        }




    }

    return (
        <form onSubmit={onSubmitHandler} className='m-5 w-full'>
            <p className='mb-3 text-lg font-medium'>Add Lawyer</p>
            <div className='bg-white px-8 py-8 border rounded w-full max-h-[80vh] overflow-y-scroll'>
                <div className='max-w-full mx-auto'>

                    {/* Fixed: Four Column Grid instead of 5 */}
                    <div className='grid grid-cols-1 lg:grid-cols-4 gap-4 h-full'>

                        {/* Left Column - Personal & Location */}
                        <div className='flex flex-col gap-4 h-full'>

                            {/* Personal Information */}
                            <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-1'>
                                <h3 className='text-lg font-semibold text-[#515151] mb-4'>Profile Photo</h3>

                                {/* Image Upload */}
                                <div className='flex flex-col items-center gap-2'>
                                    <label htmlFor="lawyer-img" className='cursor-pointer'>
                                        <img
                                            src={lawyerImg ? URL.createObjectURL(lawyerImg) : (assets?.upload_area || '/default-upload.png')}
                                            className='w-16 bg-gray-100 rounded-full cursor-pointer'
                                            alt="Upload area"
                                        />
                                    </label>
                                    <input
                                        onChange={(e) => setLawyerImg(e.target.files[0])}
                                        type="file"
                                        id="lawyer-img"
                                        accept="image/*"
                                        hidden
                                    />
                                    <p className='text-[#515151] text-xs text-center leading-tight'>Upload Lawyer's<br />picture</p>
                                </div>
                            </div>

                            {/* Languages */}
                            <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-1'>
                                <h3 className='text-lg font-semibold text-[#515151] mb-4'>Languages Spoken</h3>
                                <div className='flex flex-col gap-3'>
                                    <label className='flex items-center gap-3 text-sm text-[#515151]'>
                                        <input
                                            type="checkbox"
                                            value="Sinhala"
                                            className='w-4 h-4 rounded'
                                            checked={languages.includes('Sinhala')}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setLanguages([...languages, 'Sinhala']);
                                                } else {
                                                    setLanguages(languages.filter(lang => lang !== 'Sinhala'));
                                                }
                                            }}
                                        />
                                        Sinhala
                                    </label>
                                    <label className='flex items-center gap-3 text-sm text-[#515151]'>
                                        <input
                                            type="checkbox"
                                            value="Tamil"
                                            className='w-4 h-4 rounded'
                                            checked={languages.includes('Tamil')}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setLanguages([...languages, 'Tamil']);
                                                } else {
                                                    setLanguages(languages.filter(lang => lang !== 'Tamil'));
                                                }
                                            }}
                                        />
                                        Tamil
                                    </label>
                                    <label className='flex items-center gap-3 text-sm text-[#515151]'>
                                        <input
                                            type="checkbox"
                                            value="English"
                                            className='w-4 h-4 rounded'
                                            checked={languages.includes('English')}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setLanguages([...languages, 'English']);
                                                } else {
                                                    setLanguages(languages.filter(lang => lang !== 'English'));
                                                }
                                            }}
                                        />
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
                                            value={additionalInfo}
                                            onChange={(e) => setAdditionalInfo(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Second Column - Personal Information */}
                        <div className='flex flex-col gap-4 h-full'>
                            <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-1'>
                                <h3 className='text-lg font-semibold text-[#515151] mb-4'>Personal Information</h3>
                                <div className='grid grid-cols-1 gap-3'>
                                    <div className='w-full'>
                                        <p className='text-[#515151] text-sm mb-1'>Lawyer Name</p>
                                        <input
                                            type="text"
                                            placeholder='Name'
                                            className='border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            required
                                            onChange={(e) => setName(e.target.value)}
                                            value={name}
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <p className='text-[#515151] text-sm mb-1'>Lawyer Email</p>
                                        <input
                                            type="email"
                                            placeholder='Email'
                                            className='border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            required
                                            onChange={(e) => setEmail(e.target.value)}
                                            value={email}
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <p className='text-[#515151] text-sm mb-1'>Phone Number</p>
                                        <input
                                            type="tel"
                                            placeholder='Phone'
                                            className='border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            required
                                            onChange={(e) => setPhone(e.target.value)}
                                            value={phone}
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <p className='text-[#515151] text-sm mb-1'>Gender</p>
                                        <select
                                            onChange={(e) => setGender(e.target.value)}
                                            value={gender}
                                            className='border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            required
                                        >
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
                                            required
                                            onChange={(e) => setDateOfBirth(e.target.value)}
                                            value={dateOfBirth}
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <p className='text-[#515151] text-sm mb-1'>Lawyer Password</p>
                                        <input
                                            type="password"
                                            placeholder='Password'
                                            className='border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            required
                                            minLength="6"
                                            onChange={(e) => setPassword(e.target.value)}
                                            value={password}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Third Column - Professional Information */}
                        <div className='flex flex-col gap-4 h-full'>
                            <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-1'>
                                <h3 className='text-lg font-semibold text-[#515151] mb-4'>Professional Info</h3>
                                <div className='grid grid-cols-1 gap-3'>
                                    <div className='w-full'>
                                        <p className='text-[#515151] text-sm mb-1'>Speciality</p>
                                        <select
                                            onChange={(e) => setSpeciality(e.target.value)}
                                            value={speciality}
                                            className='border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            required
                                        >
                                            <option value="Criminal Law">Criminal Law</option>
                                            <option value="Civil Law">Civil Law</option>
                                            <option value="Family Law">Family Law</option>
                                            <option value="Corporate Law">Corporate Law</option>
                                            <option value="Immigration Law">Immigration Law</option>
                                            <option value="Property Law">Property Law</option>
                                            <option value="General Practice">General Practice</option>
                                        </select>
                                    </div>
                                    <div className='w-full'>
                                        <p className='text-[#515151] text-sm mb-1'>Degree</p>
                                        <input
                                            type="text"
                                            placeholder='e.g., LLB, LLM'
                                            className='border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            required
                                            value={degree}
                                            onChange={(e) => setDegree(e.target.value)}
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <p className='text-[#515151] text-sm mb-1'>Office Phone (Optional)</p>
                                        <input
                                            type="tel"
                                            placeholder='Office Phone'
                                            className='border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            onChange={(e) => setOfficePhone(e.target.value)}
                                            value={officePhone}
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <p className='text-[#515151] text-sm mb-1'>License Number</p>
                                        <input
                                            type="text"
                                            placeholder='License Number'
                                            className='border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            required
                                            onChange={(e) => setLicenseNumber(e.target.value)}
                                            value={licenseNumber}
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <p className='text-[#515151] text-sm mb-1'>Bar Association</p>
                                        <input
                                            type="text"
                                            placeholder='Bar Association'
                                            className='border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            onChange={(e) => setBarAssociation(e.target.value)}
                                            value={barAssociation}
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <p className='text-[#515151] text-sm mb-1'>Experience (Years)</p>
                                        <input
                                            type="number"
                                            min="0"
                                            max="50"
                                            placeholder='Years of Experience'
                                            className='border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            onChange={(e) => setExperience(e.target.value)}
                                            value={experience}
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <p className='text-[#515151] text-sm mb-1'>Legal Professional Type</p>
                                        <select
                                            className='border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            value={professionalType}
                                            onChange={(e) => setProfessionalType(e.target.value)}
                                            required
                                        >
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
                                            min="0"
                                            placeholder='Fees'
                                            className='border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            value={consultationFees}
                                            onChange={(e) => setConsultationFees(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fourth Column - Location & Courts */}
                        <div className='flex flex-col gap-4 h-full'>
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
                                            value={primaryCourt}
                                            onChange={(e) => setPrimaryCourt(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className='w-full'>
                                        <p className='text-[#515151] text-sm mb-1'>Secondary Court (Optional)</p>
                                        <input
                                            type="text"
                                            placeholder='Secondary Court'
                                            className='border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            value={secondaryCourt}
                                            onChange={(e) => setSecondaryCourt(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Location Information */}
                            <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-1'>
                                <h3 className='text-lg font-semibold text-[#515151] mb-4'>Location Information</h3>
                                <div className='grid grid-cols-1 gap-3'>
                                    <div className='w-full'>
                                        <p className='text-[#515151] text-sm mb-1'>District</p>
                                        <select
                                            className='border border-gray-300 rounded w-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                            value={district}
                                            onChange={(e) => setDistrict(e.target.value)}
                                            required
                                        >
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
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
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
                                            value={latitude}
                                            onChange={(e) => setLatitude(e.target.value)}
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
                                            value={longitude}
                                            onChange={(e) => setLongitude(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-center items-center'>
                                <button
                                    type="submit"
                                    className='bg-blue-600 hover:bg-blue-700 px-10 py-3 text-white rounded-full transition-colors duration-200 font-medium'
                                >
                                    Add Lawyer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}