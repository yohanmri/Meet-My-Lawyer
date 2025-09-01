import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, User, Mail, Phone, GraduationCap, MapPin, Scale, FileText, Camera, Upload } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const RegisterLawyer = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        application_name: '',
        application_email: '',
        application_phone: '',
        application_office_phone: '',
        application_speciality: '',
        application_gender: '',
        application_dob: '',
        application_degree: [],
        application_district: '',
        application_license_number: '',
        application_bar_association: '',
        application_experience: '',
        application_languages_spoken: [],
        application_about: '',
        application_legal_professionals: [],
        application_fees: 0,
        application_address: {},
        application_latitude: 0,
        application_longitude: 0,
        application_court1: '',
        application_court2: '',
        application_image: null,
        application_license_certificate: null,
        application_birth_certificate: null,
        application_legal_professionals_certificate: []
    });

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const steps = [
        { id: 'personal', title: 'Personal Info', icon: User },
        { id: 'contact', title: 'Contact Details', icon: Mail },
        { id: 'education', title: 'Education', icon: GraduationCap },
        { id: 'professional', title: 'Professional', icon: Scale },
        { id: 'location', title: 'Location', icon: MapPin },
        { id: 'documents', title: 'Documents', icon: FileText },
        { id: 'review', title: 'Review', icon: Camera }
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFileChange = (field, file) => {
        setFormData(prev => ({
            ...prev,
            [field]: file
        }));
    };

    const handleMultipleFileChange = (field, files) => {
        setFormData(prev => ({
            ...prev,
            [field]: Array.from(files)
        }));
    };

    const handleArrayInput = (field, value) => {
        const values = value.split(',').map(item => item.trim()).filter(item => item);
        handleInputChange(field, values);
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const goToStep = (stepIndex) => {
        setCurrentStep(stepIndex);
    };

    const validateForm = () => {
        const requiredFields = [
            'application_name',
            'application_email',
            'application_phone',
            'application_speciality',
            'application_gender',
            'application_license_number',
            'application_bar_association',
            'application_experience',
            'application_district',
            'application_court1'
        ];

        for (let field of requiredFields) {
            if (!formData[field] || formData[field] === '') {
                toast.error(`Please fill in ${field.replace('application_', '').replace('_', ' ')}`);
                return false;
            }
        }

        if (formData.application_languages_spoken.length === 0) {
            toast.error('Please specify at least one language spoken');
            return false;
        }

        if (formData.application_degree.length === 0) {
            toast.error('Please specify your degrees');
            return false;
        }

        if (formData.application_legal_professionals.length === 0) {
            toast.error('Please provide legal professional information');
            return false;
        }

        return true;
    };

    const renderStepIndicator = () => (
        <div className="flex items-center justify-center mb-3 mt-3 overflow-x-auto pb-4">
            <div className="flex items-center space-x-2 min-w-max">
                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;

                    return (
                        <React.Fragment key={step.id}>
                            <div
                                className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${isActive ? 'scale-110' : 'scale-100'
                                    }`}
                                onClick={() => goToStep(index)}
                            >
                                <div className={`
                                    w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2
                                    ${isActive
                                        ? 'bg-blue-600 text-white shadow-md border-blue-600'
                                        : isCompleted
                                            ? 'bg-green-500 text-white border-green-500'
                                            : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
                                    }
                                `}>
                                    <Icon size={20} />
                                </div>
                                <span className={`
                                    text-xs mt-2 font-medium transition-colors duration-300
                                    ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-500' : 'text-gray-600'}
                                `}>
                                    {step.title}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`
                                    w-8 h-0.5 mx-2 transition-colors duration-300
                                    ${index < currentStep ? 'bg-green-500' : 'bg-gray-300'}
                                `} />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );

    const renderPersonalInfo = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                        type="text"
                        value={formData.application_name}
                        onChange={(e) => handleInputChange('application_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Enter your full name"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                    <select
                        value={formData.application_gender}
                        onChange={(e) => handleInputChange('application_gender', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <input
                        type="date"
                        value={formData.application_dob}
                        onChange={(e) => handleInputChange('application_dob', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Speciality *</label>
                    <input
                        type="text"
                        value={formData.application_speciality}
                        onChange={(e) => handleInputChange('application_speciality', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="e.g., Criminal Law, Corporate Law"
                        required
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">About Yourself</label>
                <textarea
                    value={formData.application_about}
                    onChange={(e) => handleInputChange('application_about', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                    placeholder="Brief description about yourself and your practice"
                />
            </div>
        </div>
    );

    const renderContactDetails = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                        type="email"
                        value={formData.application_email}
                        onChange={(e) => handleInputChange('application_email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="your.email@example.com"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                        type="tel"
                        value={formData.application_phone}
                        onChange={(e) => handleInputChange('application_phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="+1 (555) 123-4567"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Office Phone</label>
                    <input
                        type="tel"
                        value={formData.application_office_phone}
                        onChange={(e) => handleInputChange('application_office_phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="+1 (555) 987-6543"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Languages Spoken *</label>
                    <input
                        type="text"
                        value={formData.application_languages_spoken.join(', ')}
                        onChange={(e) => handleArrayInput('application_languages_spoken', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="English, Spanish, French (separate with commas)"
                        required
                    />
                </div>
            </div>
        </div>
    );

    const renderEducation = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Education & Qualifications</h2>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Degrees *</label>
                    <input
                        type="text"
                        value={formData.application_degree.join(', ')}
                        onChange={(e) => handleArrayInput('application_degree', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="J.D., LL.M., B.A. (separate with commas)"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Legal Professionals Information *</label>
                    <textarea
                        value={formData.application_legal_professionals.join('\n')}
                        onChange={(e) => handleInputChange('application_legal_professionals', e.target.value.split('\n').filter(item => item.trim()))}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                        placeholder="Enter professional details (one per line)"
                        required
                    />
                </div>
            </div>
        </div>
    );

    const renderProfessional = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Professional Details</h2>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">License Number *</label>
                    <input
                        type="text"
                        value={formData.application_license_number}
                        onChange={(e) => handleInputChange('application_license_number', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Enter your license number"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bar Association *</label>
                    <input
                        type="text"
                        value={formData.application_bar_association}
                        onChange={(e) => handleInputChange('application_bar_association', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="e.g., New York State Bar"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience *</label>
                    <input
                        type="text"
                        value={formData.application_experience}
                        onChange={(e) => handleInputChange('application_experience', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="e.g., 5-10 years"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fees</label>
                    <input
                        type="number"
                        value={formData.application_fees}
                        onChange={(e) => handleInputChange('application_fees', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Enter consultation fees"
                        min="0"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Court *</label>
                    <input
                        type="text"
                        value={formData.application_court1}
                        onChange={(e) => handleInputChange('application_court1', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Primary court of practice"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Court</label>
                    <input
                        type="text"
                        value={formData.application_court2}
                        onChange={(e) => handleInputChange('application_court2', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Secondary court of practice"
                    />
                </div>
            </div>
        </div>
    );

    const renderLocation = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Location & Address</h2>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">District *</label>
                    <input
                        type="text"
                        value={formData.application_district}
                        onChange={(e) => handleInputChange('application_district', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Enter your district"
                        required
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Complete Address *</label>
                    <textarea
                        value={typeof formData.application_address === 'string' ? formData.application_address : JSON.stringify(formData.application_address, null, 2)}
                        onChange={(e) => handleInputChange('application_address', { street: e.target.value, district: formData.application_district })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                        placeholder="Enter your complete address"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                    <input
                        type="number"
                        step="any"
                        value={formData.application_latitude}
                        onChange={(e) => handleInputChange('application_latitude', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Enter latitude"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                    <input
                        type="number"
                        step="any"
                        value={formData.application_longitude}
                        onChange={(e) => handleInputChange('application_longitude', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Enter longitude"
                    />
                </div>
            </div>
        </div>
    );

    const renderDocuments = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Document Upload (Optional)</h2>
            <p className="text-sm text-gray-600 mb-4">
                Document uploads are optional but recommended. You can submit your application now and upload documents later if needed.
            </p>
            <div className="space-y-6">
                <div className="border border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors duration-200">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Profile Picture (Optional)</h3>
                    <p className="mt-1 text-sm text-gray-600">Upload your professional photo</p>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange('application_image', e.target.files[0])}
                        className="mt-2 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-medium file:bg-white file:text-gray-700 hover:file:bg-gray-50"
                    />
                    {formData.application_image && (
                        <p className="mt-1 text-sm text-green-600">✓ {formData.application_image.name}</p>
                    )}
                </div>

                <div className="border border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors duration-200">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">License Certificate (Optional)</h3>
                    <p className="mt-1 text-sm text-gray-600">Upload your law license certificate</p>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileChange('application_license_certificate', e.target.files[0])}
                        className="mt-2 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-medium file:bg-white file:text-gray-700 hover:file:bg-gray-50"
                    />
                    {formData.application_license_certificate && (
                        <p className="mt-1 text-sm text-green-600">✓ {formData.application_license_certificate.name}</p>
                    )}
                </div>

                <div className="border border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors duration-200">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Birth Certificate (Optional)</h3>
                    <p className="mt-1 text-sm text-gray-600">Upload your birth certificate</p>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileChange('application_birth_certificate', e.target.files[0])}
                        className="mt-2 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-medium file:bg-white file:text-gray-700 hover:file:bg-gray-50"
                    />
                    {formData.application_birth_certificate && (
                        <p className="mt-1 text-sm text-green-600">✓ {formData.application_birth_certificate.name}</p>
                    )}
                </div>

                <div className="border border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors duration-200">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Professional Certificates (Optional)</h3>
                    <p className="mt-1 text-sm text-gray-600">Upload additional professional certificates</p>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        multiple
                        onChange={(e) => handleMultipleFileChange('application_legal_professionals_certificate', e.target.files)}
                        className="mt-2 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-medium file:bg-white file:text-gray-700 hover:file:bg-gray-50"
                    />
                    {formData.application_legal_professionals_certificate.length > 0 && (
                        <p className="mt-1 text-sm text-green-600">
                            ✓ {formData.application_legal_professionals_certificate.length} file(s) selected
                        </p>
                    )}
                </div>
            </div>
        </div>
    );

    const renderReview = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Review & Submit</h2>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Summary</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="font-medium text-gray-600">Name:</span>
                        <span className="text-gray-900">{formData.application_name || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="font-medium text-gray-600">Email:</span>
                        <span className="text-gray-900">{formData.application_email || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="font-medium text-gray-600">Phone:</span>
                        <span className="text-gray-900">{formData.application_phone || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="font-medium text-gray-600">Speciality:</span>
                        <span className="text-gray-900">{formData.application_speciality || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="font-medium text-gray-600">Experience:</span>
                        <span className="text-gray-900">{formData.application_experience || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="font-medium text-gray-600">District:</span>
                        <span className="text-gray-900">{formData.application_district || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="font-medium text-gray-600">Languages:</span>
                        <span className="text-gray-900">{formData.application_languages_spoken.join(', ') || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                        <span className="font-medium text-gray-600">License Number:</span>
                        <span className="text-gray-900">{formData.application_license_number || 'Not provided'}</span>
                    </div>
                </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Please Review Your Information</h4>
                <p className="text-sm text-yellow-700">
                    Once submitted, your application will be reviewed by our admin team. Please ensure all information is accurate before proceeding.
                </p>
            </div>
        </div>
    );

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 0: return renderPersonalInfo();
            case 1: return renderContactDetails();
            case 2: return renderEducation();
            case 3: return renderProfessional();
            case 4: return renderLocation();
            case 5: return renderDocuments();
            case 6: return renderReview();
            default: return renderPersonalInfo();
        }
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);

            // Validate form
            if (!validateForm()) {
                setIsSubmitting(false);
                return;
            }

            // Create FormData for file uploads
            const submitData = new FormData();

            // Add text fields
            submitData.append('application_name', formData.application_name);
            submitData.append('application_email', formData.application_email);
            submitData.append('application_phone', formData.application_phone);
            submitData.append('application_office_phone', formData.application_office_phone);
            submitData.append('application_speciality', formData.application_speciality);
            submitData.append('application_gender', formData.application_gender);
            submitData.append('application_dob', formData.application_dob);
            submitData.append('application_degree', JSON.stringify(formData.application_degree));
            submitData.append('application_district', formData.application_district);
            submitData.append('application_license_number', formData.application_license_number);
            submitData.append('application_bar_association', formData.application_bar_association);
            submitData.append('application_experience', formData.application_experience);
            submitData.append('application_languages_spoken', JSON.stringify(formData.application_languages_spoken));
            submitData.append('application_about', formData.application_about);
            submitData.append('application_legal_professionals', JSON.stringify(formData.application_legal_professionals));
            submitData.append('application_fees', formData.application_fees);
            submitData.append('application_address', JSON.stringify(formData.application_address));
            submitData.append('application_latitude', formData.application_latitude);
            submitData.append('application_longitude', formData.application_longitude);
            submitData.append('application_court1', formData.application_court1);
            submitData.append('application_court2', formData.application_court2);

            // Add files
            if (formData.application_image) {
                submitData.append('application_image', formData.application_image);
            }
            if (formData.application_license_certificate) {
                submitData.append('application_license_certificate', formData.application_license_certificate);
            }
            if (formData.application_birth_certificate) {
                submitData.append('application_birth_certificate', formData.application_birth_certificate);
            }
            if (formData.application_legal_professionals_certificate.length > 0) {
                formData.application_legal_professionals_certificate.forEach((file, index) => {
                    submitData.append('application_legal_professionals_certificate', file);
                });
            }

            // Debug: Log FormData contents
            console.log('Submitting FormData with files:');
            for (let [key, value] of submitData.entries()) {
                console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value);
            }

            // Submit to backend
            const response = await axios.post(`${backendUrl}/api/application/add-application`, submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                toast.success('Application submitted successfully! You will be notified once it\'s reviewed.');

                // Reset form
                setFormData({
                    application_name: '',
                    application_email: '',
                    application_phone: '',
                    application_office_phone: '',
                    application_speciality: '',
                    application_gender: '',
                    application_dob: '',
                    application_degree: [],
                    application_district: '',
                    application_license_number: '',
                    application_bar_association: '',
                    application_experience: '',
                    application_languages_spoken: [],
                    application_about: '',
                    application_legal_professionals: [],
                    application_fees: 0,
                    application_address: {},
                    application_latitude: 0,
                    application_longitude: 0,
                    application_court1: '',
                    application_court2: '',
                    application_image: null,
                    application_license_certificate: null,
                    application_birth_certificate: null,
                    application_legal_professionals_certificate: []
                });

                setCurrentStep(0);
            } else {
                toast.error(response.data.message || 'Failed to submit application');
            }
        } catch (error) {
            console.error('Submission error:', error);
            toast.error(error.response?.data?.message || 'Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='mt-8'>
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div
                        style={{ background: 'linear-gradient(to right, #D00C1F, #6A0610)' }}
                        className=" px-4 py-2">
                        <h1 className="text-2xl font-bold text-white">Lawyer Registration</h1>
                        <p className="text-blue-100 mt-2">Complete your professional registration</p>
                    </div>

                    <div className="p-8">
                        {renderStepIndicator()}

                        <div className="min-h-[400px]">
                            {renderCurrentStep()}
                        </div>

                        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                            <button
                                onClick={prevStep}
                                disabled={currentStep === 0 || isSubmitting}
                                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${currentStep === 0 || isSubmitting
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                <ChevronLeft size={20} className="mr-2" />
                                Previous
                            </button>

                            {currentStep < steps.length - 1 ? (
                                <button
                                    onClick={nextStep}
                                    disabled={isSubmitting}
                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                    <ChevronRight size={20} className="ml-2" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="flex items-center px-6 py-2 bg-green-600 text-white rounded-md text-sm font-bold hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterLawyer;