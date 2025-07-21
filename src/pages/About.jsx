import { useEffect, useState, Suspense } from "react";
import axios from 'axios';
import LoadingSpinner from "../components/Loading";
import Modal from '../components/Modal';

export default function About( {setUserData} ) {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        title: '',
        message: '',
        isConfirmation: false,
        onConfirm: () => {},
        modalType: ''
    });

    const openConfirmationModal = (e) => {
        e.preventDefault();
        setModalConfig({
            title: 'Confirm Action',
            message: 'Are you sure you want to perform this action?',
            isConfirmation: true,
            onConfirm: handleSubmit,
            modalType: 'question'
            // onConfirm: handleConfirmAction
        });
        setIsModalOpen(true);
    };
    const openConfirmationModalDeactivation = (e) => {
        e.preventDefault();
        setModalConfig({
            title: 'Confirm Action',
            message: 'Are you sure you want to perform this action ?',
            isConfirmation: true,
            onConfirm: handleDeactivation,
            modalType: 'question'
            // onConfirm: handleConfirmAction
        });
        setIsModalOpen(true);
    };

    const openNotificationModal = () => {
        setModalConfig({
            title: 'Notification',
            message: 'Changes Saved Successfull.',
            isConfirmation: false,
            onConfirm: () => {},
            modalType: 'success'
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const [formData, setFormData] = useState({
        imageUrl: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: '',
        language: '',
        timeZone: '',
        currency: ''
    });
    
    const handleFileChange = (e) => {  
        setFormData({ ...formData, imageUrl: e.target.files[0] });
    };
      
    const [cloneData, setCloneData] = useState(formData);
    const [isChecked, setIsChecked] = useState(false);
    
    const token = localStorage.getItem("token");
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/profile`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            const userData = response.data; // Assuming the response contains user data in JSON format
            setFormData(userData);
            setCloneData(userData);
            setUserData(prev => ({
                ...prev,
                username: `${userData.firstName} ${userData.lastName}`,
                imageUrl: userData.imageUrl,
              }));
            setLoading(false);
          } catch (error) {
            console.error('Error fetching user data:', error);
            setLoading(false);
          }
        };
    
        fetchData();
      }, []);
    
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };
    
    const handleReset = (e) => {
        e.preventDefault();
        setFormData(cloneData)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };      
   
      const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        try {
          data.append('image', formData.imageUrl);
          data.append('firstName', formData.firstName);
          data.append('lastName', formData.lastName);
          data.append('email', formData.email);
          data.append('phoneNumber', formData.phoneNumber);
          data.append('address', formData.address);
          data.append('language', formData.language);
          data.append('timeZone', formData.timeZone);
          data.append('currency', formData.currency);
      
          const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/updateProfile`, data, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });

          const response2 = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/profile`, {
                headers: {
                'Authorization': `Bearer ${token}`
                }
            });
            const userData = response2.data; // Assuming the response contains updated user data in JSON format
            setFormData(userData);
            setCloneData(userData);
            setUserData({
                      username: `${userData.firstName} ${userData.lastName}`,
                      imageUrl: userData.imageUrl
                    })
      
          setModalConfig({
            title: 'Notification',
            message: 'Profile Updated Successfully',
            isConfirmation: false,
            onConfirm: () => {},
            modalType: 'success'
          });
          console.log('User profile updated successfully', response.data);
        } catch (error) {
          setModalConfig({
            title: 'Notification',
            message: 'Something went wrong !',
            isConfirmation: false,
            onConfirm: () => {},
            modalType: 'error'
          });
          console.error('Error updating user profile:', error);
        }
        openNotificationModal();
      };
      

    const handleDeactivation = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        // console.log(token)
        try {
            const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/deactivateProfile`, {
                headers: {
                    'Authorization' : `Bearer ${token}`
                },
                params: {
                    email: formData.email
                }
            });
            console.log('Delete successfully', response.data);
            localStorage.setItem("token", '');
            localStorage.setItem("user", '')
            location.href = "/"
            openNotificationModal();
        } catch (error) {
            console.error('Error delete user profile:', error);
        }
    }
    return (<>
        {loading ? <LoadingSpinner /> :
        (<>
        <form onSubmit={openConfirmationModal}>
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={modalConfig.onConfirm}
                title={modalConfig.title}
                message={modalConfig.message}
                isConfirmation={modalConfig.isConfirmation}
                type={modalConfig.modalType}
            />

        <div className="flex flex-col p-6 gap-6 bg-white shadow rounded-xl">
            <span className="text-2xl font-semibold">Account Details</span>
            <div className="flex items-center gap-6">
                <img
                    className="w-20 h-20 rounded-full border-2 border-gray-200"
                    src={formData.imageUrl}
                    onError={(e) => { e.target.src = '/images/dummy.webp'; }}
                    alt="Profile"
                    loading="lazy"
                />
                <div className="flex flex-col gap-2">
                    <label htmlFor="image" className="text-sm font-medium text-gray-600">Profile Picture</label>
                    <input type="file" id="image" accept="image/*" name="imageUrl" className="text-sm border rounded-md py-2 px-2 md:px-4 md:w-full w-3/4" onChange={handleFileChange} />
                    <span className="text-xs text-gray-500">Allowed formats: JPG, GIF, PNG (Max size: 800KB)</span>
                </div>
            </div>
            <div className="border-b border-gray-200"></div>

            <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 md:gap-x-8">
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-600">First Name</label>
                    <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
                </div>
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-600">Last Name</label>
                    <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
                    <input type="email" id="email" name="email" value={formData.email} disabled className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm bg-gray-100 cursor-not-allowed" />
                </div>
                <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-600">Phone Number</label>
                    <input type="text" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
                </div>
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-600">Address</label>
                    <input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" />
                </div>
                <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-600">Language</label>
                    <select id="language" name="language" value={formData.language} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50">
                        <option value="" disabled>Select Language</option>
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="timeZone" className="block text-sm font-medium text-gray-600">Time Zone</label>
                    <select id="timeZone" name="timeZone" value={formData.timeZone} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50">
                        <option value="" disabled>Select Time Zone</option>
                        <option value="GMT">(GMT-11:00) International Date Line West</option>
                        <option value="GMT-8">(GMT-08:00) Pacific Time (US & Canada)</option>
                        <option value="GMT+5">(GMT+05:00) Islamabad, Karachi, Tashkent</option>
                        <option value="GMT+5.5">(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                        <option value="GMT+5.75">(GMT+05:45) Kathmandu</option>
                        {/* Add more time zones as needed */}
                    </select>
                </div>
                <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-600">Currency</label>
                    <select id="currency" name="currency" value={formData.currency} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50">
                        <option value="" disabled>Select Currency</option>
                        <option value="INR">Indian Rupee (₹)</option>
                        <option value="USD">United States Dollar ($)</option>
                        <option value="EUR">Euro (€)</option>
                        <option value="GBP">British Pound Sterling (£)</option>
                        <option value="JPY">Japanese Yen (¥)</option>
                        {/* Add more currencies as needed */}
                    </select>
                </div>
            </div>
            <div className="flex justify-end mt-6">
                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Save Changes
                </button>
                <button type="button" onClick={handleReset} className="ml-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Reset
                </button>
            </div>
        </div>

        </form>
        <form onSubmit={openConfirmationModalDeactivation}>
                <div className="flex flex-col items-start p-6 gap-6 my-8 bg-white shadow rounded-xl">
                    <span className="text-2xl font-semibold">Delete Account</span>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="confirmation" name="confirmation" checked={isChecked} onChange={handleCheckboxChange} />
                        <label htmlFor="confirmation" className="text-sm">I confirm my account deletion.</label>
                    </div>
                    <button type="submit" className={`py-2 px-4 text-sm md:text-base bg-red-500 text-white rounded-md ${!isChecked && "opacity-50 cursor-not-allowed"}`} disabled={!isChecked}>
                        Delete Account
                    </button>
                </div>
            </form>
        
        </>)}
    </>)
}