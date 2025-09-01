import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { MdCheckCircle, MdCancel, MdVisibility } from 'react-icons/md';
import { toast } from 'react-toastify';
import axios from 'axios';

const Applications_lawyers = () => {
    const { aToken, applications, getAllApplications, backendUrl } = useContext(AdminContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [actionType, setActionType] = useState(''); // 'approve' or 'reject'
    const [actionApplication, setActionApplication] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const itemsPerPage = 8;

    useEffect(() => {
        console.log('🚀 useEffect triggered, aToken:', aToken);
        if (aToken) {
            console.log('📞 Calling getAllApplications...');
            getAllApplications();
        }
    }, [aToken]);

    // Filter applications based on search query
    const filteredApplications = (applications || []).filter((app) =>
        app.application_name && app.application_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.application_email && app.application_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.application_speciality && app.application_speciality.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.application_district && app.application_district.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredApplications.slice(startIndex, startIndex + itemsPerPage);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Reset to first page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // View application details
    const handleView = (app) => {
        setSelectedApplication(app);
        setShowViewModal(true);
    };

    // Show confirmation modal for approve/reject
    const handleAction = (app, action) => {
        setActionApplication(app);
        setActionType(action);
        setShowConfirmModal(true);
    };

    // Process approve/reject action
    const processAction = async () => {
        try {
            setIsProcessing(true);

            const endpoint = actionType === 'approve'
                ? '/api/admin/approve-application'
                : '/api/admin/reject-application';

            const { data } = await axios.post(backendUrl + endpoint, {
                applicationId: actionApplication._id
            }, {
                headers: { aToken }
            });

            if (data.success) {
                toast.success(data.message);
                getAllApplications(); // Refresh the applications list
                setShowConfirmModal(false);
                setActionApplication(null);
                setActionType('');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Action error:', error);
            toast.error(error.response?.data?.message || 'Failed to process application');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className='w-full max-w-7xl m-5'>
            <div className='flex justify-between items-center mb-4'>
                <p className='text-lg font-medium'>Lawyer Applications</p>

                {/* Search Bar */}
                <div className='flex-1 max-w-md mx-4'>
                    <div className='relative'>
                        <input
                            type='text'
                            placeholder='Search by name, email, speciality, or district...'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                        />
                        <svg
                            className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                        >
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                        </svg>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                            >
                                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                <div className='text-sm text-gray-600'>
                    Total: {filteredApplications.length} applications
                </div>
            </div>

            {/* Search Results Info */}
            {searchQuery && (
                <div className='mb-4 text-sm text-gray-600'>
                    Found {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''} matching "{searchQuery}"
                </div>
            )}

            {/* Table */}
            <div className='bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll'>
                {/* Table Header */}
                <div className='hidden sm:grid grid-cols-[0.3fr_2.5fr_2fr_1.8fr_1.5fr_1.5fr_1fr_1.5fr] py-3 px-6 border-b font-medium text-gray-700 bg-gray-50'>
                    <p>#</p>
                    <p>Name</p>
                    <p>Email</p>
                    <p>Speciality</p>
                    <p>Experience</p>
                    <p>District</p>
                    <p>Status</p>
                    <p>Actions</p>
                </div>

                {/* Table Rows */}
                {currentItems.length === 0 ? (
                    <div className='text-center py-12 text-gray-500'>
                        {applications === undefined ? (
                            <div>
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                                <p>Loading applications...</p>
                            </div>
                        ) : searchQuery ? (
                            <div>
                                <p className='text-lg mb-2'>No applications match your search</p>
                                <p className='text-sm'>Try adjusting your search terms or clear the search to see all applications</p>
                            </div>
                        ) : (
                            <div>
                                <p className='text-lg mb-2'>No applications found</p>
                                <p className='text-sm'>Applications will appear here once lawyers submit their registration forms</p>
                            </div>
                        )}
                    </div>
                ) : (
                    currentItems.map((app, index) => (
                        <div
                            key={app._id || index}
                            className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.3fr_2.5fr_2fr_1.8fr_1.5fr_1.5fr_1fr_1.5fr] items-center text-gray-600 py-3 px-6 border-b hover:bg-gray-50 transition-colors'
                        >
                            <p className='max-sm:hidden'>{startIndex + index + 1}</p>
                            <div className='flex items-center gap-2'>
                                <p className='font-medium truncate'>{app.application_name}</p>
                            </div>
                            <p className='max-sm:hidden truncate'>{app.application_email}</p>
                            <p className='truncate'>{app.application_speciality}</p>
                            <p>{app.application_experience}</p>
                            <p>{app.application_district}</p>
                            <div className='flex items-center gap-1'>
                                <div className='w-2 h-2 bg-yellow-500 rounded-full'></div>
                                <span className='text-yellow-600 text-xs font-medium'>Pending</span>
                            </div>
                            <div className='flex items-center gap-1'>
                                <button
                                    onClick={() => handleView(app)}
                                    className='p-1.5 hover:bg-blue-100 rounded text-blue-600 transition-colors'
                                    title='View Details'
                                >
                                    <MdVisibility size={16} />
                                </button>
                                <button
                                    onClick={() => handleAction(app, 'approve')}
                                    className='p-1.5 hover:bg-green-100 rounded text-green-600 transition-colors'
                                    title='Approve Application'
                                >
                                    <MdCheckCircle size={16} />
                                </button>
                                <button
                                    onClick={() => handleAction(app, 'reject')}
                                    className='p-1.5 hover:bg-red-100 rounded text-red-600 transition-colors'
                                    title='Reject Application'
                                >
                                    <MdCancel size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-4">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        className={`px-3 py-1 border rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>

                    <div className="flex gap-1">
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => goToPage(pageNum)}
                                    className={`px-3 py-1 rounded text-sm ${pageNum === currentPage
                                            ? 'bg-blue-600 text-white'
                                            : 'border hover:bg-gray-50'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                    </div>

                    <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        className={`px-3 py-1 border rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* View Application Modal */}
            {showViewModal && selectedApplication && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Application Details - {selectedApplication.application_name}</h2>
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Personal Information */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg border-b pb-2">Personal Information</h3>
                                    <div className="space-y-2 text-sm">
                                        <div><strong>Name:</strong> {selectedApplication.application_name}</div>
                                        <div><strong>Email:</strong> {selectedApplication.application_email}</div>
                                        <div><strong>Phone:</strong> {selectedApplication.application_phone}</div>
                                        <div><strong>Gender:</strong> {selectedApplication.application_gender}</div>
                                        <div><strong>Date of Birth:</strong> {selectedApplication.application_dob || 'Not provided'}</div>
                                        <div><strong>About:</strong> {selectedApplication.application_about || 'Not provided'}</div>
                                    </div>
                                </div>

                                {/* Professional Information */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg border-b pb-2">Professional Information</h3>
                                    <div className="space-y-2 text-sm">
                                        <div><strong>Speciality:</strong> {selectedApplication.application_speciality}</div>
                                        <div><strong>Experience:</strong> {selectedApplication.application_experience}</div>
                                        <div><strong>License Number:</strong> {selectedApplication.application_license_number}</div>
                                        <div><strong>Bar Association:</strong> {selectedApplication.application_bar_association}</div>
                                        <div><strong>Degree:</strong> {selectedApplication.application_degree?.join(', ')}</div>
                                        <div><strong>Languages:</strong> {selectedApplication.application_languages_spoken?.join(', ')}</div>
                                        <div><strong>Consultation Fees:</strong> LKR {selectedApplication.application_fees}</div>
                                    </div>
                                </div>

                                {/* Location Information */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg border-b pb-2">Location & Courts</h3>
                                    <div className="space-y-2 text-sm">
                                        <div><strong>District:</strong> {selectedApplication.application_district}</div>
                                        <div><strong>Address:</strong> {selectedApplication.application_address?.street || 'Not provided'}</div>
                                        <div><strong>Primary Court:</strong> {selectedApplication.application_court1}</div>
                                        <div><strong>Secondary Court:</strong> {selectedApplication.application_court2 || 'Not provided'}</div>
                                    </div>
                                </div>

                                {/* Documents */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg border-b pb-2">Documents</h3>
                                    <div className="space-y-2 text-sm">
                                        <div><strong>Profile Image:</strong> {selectedApplication.application_image ? '✓ Uploaded' : '✗ Not uploaded'}</div>
                                        <div><strong>License Certificate:</strong> {selectedApplication.application_license_certificate?.originalUrl ? '✓ Uploaded' : '✗ Not uploaded'}</div>
                                        <div><strong>Birth Certificate:</strong> {selectedApplication.application_birth_certificate?.originalUrl ? '✓ Uploaded' : '✗ Not uploaded'}</div>
                                        <div><strong>Professional Certificates:</strong> {selectedApplication.application_legal_professionals_certificate?.length > 0 ? `✓ ${selectedApplication.application_legal_professionals_certificate.length} file(s)` : '✗ Not uploaded'}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                                <button
                                    onClick={() => setShowViewModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmModal && actionApplication && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">
                            {actionType === 'approve' ? 'Approve Application' : 'Reject Application'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to <strong>{actionType}</strong> the application from{' '}
                            <strong>{actionApplication.application_name}</strong>?
                            {actionType === 'approve' && (
                                <span className="block mt-2 text-sm">
                                    This will add them as an active lawyer in the system.
                                </span>
                            )}
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                disabled={isProcessing}
                                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={processAction}
                                disabled={isProcessing}
                                className={`px-4 py-2 text-white rounded hover:opacity-90 disabled:opacity-50 ${actionType === 'approve' ? 'bg-green-600' : 'bg-red-600'
                                    }`}
                            >
                                {isProcessing ? 'Processing...' : actionType === 'approve' ? 'Approve' : 'Reject'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Applications_lawyers;