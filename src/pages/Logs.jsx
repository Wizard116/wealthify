import { MagnifyingGlassIcon, ArrowDownTrayIcon, ChevronUpDownIcon, ChevronUpIcon, ChevronDownIcon,
    PencilSquareIcon,
    TrashIcon
} from "@heroicons/react/24/outline"
import { useEffect, useState } from "react";
import axios from "axios";
import Modal from '../components/Modal';

const Logs = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [orderDate, setOrderDate] = useState(true);
  const [orderAmount, setOrderAmoumt] = useState(true);
  const [orderCategory, setOrderCategory] = useState(true);
  const [orderDescription, setOrderDescription] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentId, setCurrentID] = useState('');
  const [currentItem, setCurrentItem] = useState({
        amount: '',
        category: '',
        description: '',
        date: ''
    });
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        title: '',
        message: '',
        isConfirmation: false,
        onConfirm: () => {},
        modalType: ''
    });
    const [newNotifications, setNewNotifications] = useState({
        type: '',
        message: ''
    });

    const openConfirmationModal = (type, id) => {
        setModalConfig({
            title: 'Confirm Action',
            message: 'Are you sure you want to perform this action?',
            isConfirmation: true,
            onConfirm: () => handleDelete(type, id),
            modalType: 'question'
            // onConfirm: handleConfirmAction
        });
        setIsModalOpen2(true);
    };

    const openNotificationModal = () => {
        // setModalConfig({
        //     title: 'Notification',
        //     message: 'Profile Updated Successfully',
        //     isConfirmation: false,
        //     onConfirm: () => {}
        // });
        setIsModalOpen2(true);
    };

    const handleConfirmAction = () => {
        // Perform the confirm action here
        console.log('Action Confirmed!');
        setIsModalOpen2(false);
    };

    const handleCloseModal = () => {
        setIsModalOpen2(false);
    };

  const token = localStorage.getItem("token");

  useEffect(() => {

    const getData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/sortByDate/${orderDate ? 'desc' : 'asc'}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setData(response.data)
            setFilteredData(response.data)
        } catch(error) {
            console.log("Date Sorted Error", error);
        }
    };
    getData();
}, [data]);

  const handleDelete = async (type, id) => {
      addNotification(type, id);
    try {
        await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/deleteEntry`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
              type: type,
              id: id
            }
        });
        
        setFilteredData(prevData => prevData.filter(item => item._id !== id));
        setModalConfig({
            title: 'Notification',
            message: 'Data deleted!',
            isConfirmation: false,
            onConfirm: () => {},
            modalType: 'success'
        });
    } catch (error) {
        setModalConfig({
            title: 'Notification',
            message: 'Something went wrong !',
            isConfirmation: false,
            onConfirm: () => {},
            modalType: 'error'
        });
        console.error('Error deleting item:', error);
    }
    openNotificationModal()
  };

    const handleEdit = (item) => {
        const formattedDate = new Date(item.date).toISOString().split('T')[0];
        setCurrentItem({ ...item, date: formattedDate });
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setCurrentItem({
            amount: '',
            category: '',
            description: '',
            date: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${import.meta.env.VITE_BASE_URL}/api/update`, currentItem, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    id: currentItem._id,
                    type: currentItem.type,
                }
            });
            // console.log(currentItem._id)
            setFilteredData(prevData => prevData.map(item => item._id === currentItem._id ? currentItem : item));
            handleModalClose();
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };


    const addNotification = async (type, id) => {
        const token = localStorage.getItem("token");
        try {
            const responseFirst = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/getOne/${type}/${id}`,
            {
                    headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

            console.log(JSON.stringify(responseFirst.data));
            console.log(`${responseFirst.data.amount}| ${responseFirst.data.type}`)
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/notifications`,
                {
                    type: 'deleted',
                    message: `₹${responseFirst.data.amount} | ${responseFirst.data.type} | ${responseFirst.data.category}`,

                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
        } catch (error) {
            console.error('Error creating notification:', error);
        }
    };

  return (<>
            <Modal
                isOpen={isModalOpen2}
                onClose={handleCloseModal}
                onConfirm={modalConfig.onConfirm}
                title={modalConfig.title}
                message={modalConfig.message}
                isConfirmation={modalConfig.isConfirmation}
                type={modalConfig.modalType}
            />
            <div className="flex flex-col p-6 gap-6 bg-white drop-shadow rounded-xl">
            <span className="text-2xl">Transactions</span>
            <div className="border-2 border-b-2 rounded-sm"></div>

            <div className="scrollView h-[65vh] md:h-[65vh] overflow-y-auto">
                <table className="w-full md:w-full divide-y divide-gray-200">
                    <thead className="sticky top-0 bg-gray-50">
                        <tr>
                            <th
                                scope="col"
                                className="cursor-pointer px-2 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider relative"
                                onClick={() => setOrderDate(!orderDate)}
                            >
                                <span>Date</span>
                                <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                    {orderDate ? <ChevronUpIcon className="w-5 inline" /> : <ChevronDownIcon className="w-5 inline" />}
                                </span>
                            </th>
                            <th
                                scope="col"
                                className="cursor-pointer px-2 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider relative"
                            >
                                <span>Amount</span>
                                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 translate-x-6">
                                    {/* {orderAmount ? <ChevronUpIcon className="w-5 inline" /> : <ChevronDownIcon className="w-5 inline" />} */}
                                </span>
                            </th>
                            <th
                                scope="col"
                                className="cursor-pointer px-2 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider relative"
                            >
                                <span>Category</span>
                                <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                    {/* {orderCategory ? <ChevronUpIcon className="w-5 inline" /> : <ChevronDownIcon className="w-5 inline" />} */}
                                </span>
                            </th>
                            <th
                                scope="col"
                                className="cursor-pointer hidden md:table-cell px-2 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider relative"
                            >
                                <span>Description</span>
                            </th>
                            <th
                                scope="col"
                                className="px-2 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider"
                            >
                                <span>Actions</span>
                            </th>
                        </tr>
                    </thead>
                    {filteredData.length > 0 ? (
                        <tbody>
                            {filteredData.map((person, id) => (
                                <tr
                                    key={id}
                                    className={`${id % 2 === 0 ? 'bg-gray-100' : 'bg-white'} text-center text-sm md:text-base cursor-pointer`}
                                    onDoubleClick={() => handleEdit(person)}
                                >
                                    <td className="px-2 md:px-6 py-2 text-left">
                                        {new Date(person.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                    </td>
                                    <td
                                        className={`text-right md:text-center ${
                                            person.type === 'Expense' ? 'text-red-500' : 'text-green-500'
                                        }`}
                                    >
                                        {person.type === 'Expense' ? '-' : '+'}₹{person.amount}
                                    </td>
                                    <td className="text-right md:text-center">{person.category}</td>
                                    <td className="hidden md:table-cell">{person.description.length <= 28 ? person.description : `${person.description.substring(0, 22)}...`}</td>
                                    <td className="flex justify-center items-center space-x-4 my-4">
                                        <PencilSquareIcon
                                            className="w-5 h-5 text-blue-500 cursor-pointer"
                                            onClick={() => handleEdit(person)}
                                        />
                                        <TrashIcon
                                            className="w-5 h-5 text-red-500 cursor-pointer"
                                            onClick={() => openConfirmationModal(person.type, person._id)}
                                            // onClick={() => handleDelete(person.type, person._id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    ) : (
                        <tbody>
                            <tr>
                                <td className="text-center" colSpan="5">
                                <div className="flex flex-col items-center justify-center mt-[25vh]">
                                    <p className="text-gray-600 text-lg">No transactions available</p>
                                </div>
                                </td>
                            </tr>
                        </tbody>
                    )}
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4 text-center">Edit Transaction</h2>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                {/* <input type="text" value={currentItem._id} id="id" /> */}
                                <label htmlFor="amount" className="block mb-1">Amount</label>
                                <input
                                    type="number"
                                    id="amount"
                                    value={currentItem.amount}
                                    onChange={(e) => setCurrentItem({ ...currentItem, amount: e.target.value })}
                                    className="w-full border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                                    placeholder="Enter amount"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="category" className="block mb-1">Category</label>
                                <div className="relative">
                                    <select
                                        id="category"
                                        value={currentItem.category}
                                        onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })}
                                        className="w-full border px-3 py-2 rounded focus:outline-none focus:border-blue-500 appearance-none"
                                        required
                                    >
                                        {currentItem.type == "Expense" ?
                                        (<>
                                        <option value="" disabled>Select category</option>
                                        <option value="Gas/Fuel">Gas/Fuel</option>
                                        <option value="Public Transportation">Public Transportation</option>
                                        <option value="Maintenance/Repairs">Maintenance/Repairs</option>
                                        <option value="Groceries">Groceries</option>
                                        <option value="Dining Out">Dining Out</option>
                                        <option value="Utilities">Utilities (Electricity, Water, Gas)</option>
                                        <option value="Medical Bills">Medical Bills</option>
                                        <option value="Movie Tickets">Movie Tickets</option>
                                        <option value="Subscriptions">Subscriptions</option>
                                        <option value="Haircuts">Haircuts</option>
                                        <option value="Others">Others</option>
                                        </>)
                                        :
                                        (<>
                                        <option value="" disabled>Select category</option>
                                        <option value="Salary">Salary</option>
                                        <option value="Bonus">Bonus</option>
                                        <option value="Freelance">Freelance</option>
                                        <option value="Rental Income">Rental Income</option>
                                        <option value="Pension">Pension</option>
                                        <option value="Account Transfer">Account Transfer</option>
                                        <option value="Dividends">Dividends</option>
                                        <option value="Gifts/Inheritance">Gifts</option>
                                        <option value="Investment Income">Investment Income</option>
                                        <option value="Insurance Benefits">Insurance Benefits</option>
                                        <option value="Grants/Scholarships">Grants/Scholarships</option>
                                        <option value="Other">Other</option>
                                        </>)
                                    }
                                    </select>
                                    <svg
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                                        width="16"
                                        height="16"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="description" className="block mb-1">Description</label>
                                <textarea
                                    id="description"
                                    value={currentItem.description}
                                    onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                                    className="w-full border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                                    placeholder="Enter description"
                                    rows="3"
                                ></textarea>
                            </div>
                            <div>
                                <label htmlFor="date" className="block mb-1">Date</label>
                                <input
                                    type="date"
                                    id="date"
                                    value={currentItem.date}
                                    onChange={(e) => setCurrentItem({ ...currentItem, date: e.target.value })}
                                    className="w-full border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={handleModalClose}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
  </>)
}

export default Logs;