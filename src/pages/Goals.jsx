import { PlusIcon, PencilSquareIcon, XCircleIcon, TrashIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import axios from "axios";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Modal from '../components/Modal';


const Goals = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [newGoal, setNewGoal] = useState({
        name: '',
        description: '',
        targetAmount: '',
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        title: '',
        message: '',
        isConfirmation: false,
        onConfirm: () => {},
        modalType: ''
    });
    const [editGoal, setEditGoal] = useState(null);
    const [goals, setGoals] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/goals`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setGoals(response.data);
            } catch (error) {
                console.error('Error fetching goals:', error);
            }
        };

        fetchData(); // Call the fetchData function when the component mounts
    }, [goals]);
    const openConfirmationModal = (goal) => {
        setModalConfig({
            title: 'Confirm Action',
            message: 'Are you sure you want to perform this action?',
            isConfirmation: true,
            onConfirm: () => handleDeleteGoal(goal),
            modalType: 'question'
            // onConfirm: handleConfirmAction
        });
        setIsModalOpen(true);
    };

    const openNotificationModal = () => {
        // setModalConfig({
        //     title: 'Notification',
        //     message: 'Profile Updated Successfully',
        //     isConfirmation: false,
        //     onConfirm: () => {}
        // });
        setIsModalOpen(true);
    };

    const handleConfirmAction = () => {
        // Perform the confirm action here
        console.log('Action Confirmed!');
        setIsModalOpen(false);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCreateModalOpen = () => {
        setIsCreateModalOpen(true);
    };

    const handleCreateModalClose = () => {
        setIsCreateModalOpen(false);
        setNewGoal({ name: '', description: ' ', targetAmount: '' });
    };

    const handleEditModalOpen = (goal) => {
        setEditGoal(goal);
        setIsEditModalOpen(true);
    };

    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
        setEditGoal(null);
    };

    const handleCreateChange = (e) => {
        const { name, value } = e.target;
        setNewGoal((prevGoal) => ({ ...prevGoal, [name]: value }));
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditGoal((prevGoal) => ({ ...prevGoal, [name]: value }));
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/goals`, {
                name: newGoal.name,
                description: newGoal.description,
                targetAmount: newGoal.targetAmount
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            // Assuming the response contains the newly created goal object
            const createdGoal = response.data;
    
            // Handle the created goal as needed (e.g., update state, close modal)
            console.log("New Goal Created:", createdGoal);
            handleCreateModalClose();
        } catch (error) {
            console.error('Error creating goal:', error);
            // Handle error states, such as displaying error messages to the user
        }
    };
    // const addNotification = async (type, id) => {
    //     const token = localStorage.getItem("token");
    //     try {
    //         const responseFirst = await axios.get(`http://localhost:3000/api/getOne/${type}/${id}`,
    //         {
    //                 headers: {
    //                         'Authorization': `Bearer ${token}`
    //                     }
    //                 });

    //         console.log(JSON.stringify(responseFirst.data));
    //         console.log(`Deleted Transaction: ${responseFirst.data.amount}| ${responseFirst.data.type}`)
    //         const response = await axios.post('http://localhost:3000/api/notifications',
    //             {
    //                 type: 'delete',
    //                 message: `Deleted Transaction: ${responseFirst.data.amount}| ${responseFirst.data.type}`,

    //             },

    //             {
    //                 headers: {
    //                     'Authorization': `Bearer ${token}`
    //                 }
    //             });
    //     } catch (error) {
    //         console.error('Error creating notification:', error);
    //     }
    // };

    const handleAddAmount = async (e) => {
        e.preventDefault();
    
        const token = localStorage.getItem("token");
        try {
            // Make a POST request to your backend API endpoint
            const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/goals/${editGoal._id}/addAmount`, {
                amount: parseFloat(editGoal.amount || 0)
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    id: editGoal._id,
                }
            });
    
            // Assuming the API response contains the updated goal data
            const updatedGoal = response.data;

            // Update the goals state with the updated goal
            setGoals(prevGoals => prevGoals.map(goal => {
                return goal.id === updatedGoal.id ? updatedGoal : goal;
            }));
    
            // Clear the editGoal state
            setEditGoal(prevGoal => ({ ...prevGoal, amount: '' }));
            setIsEditModalOpen(false);
            console.log('Amount added successfully');
        } catch (error) {
            console.error('Failed to add amount:', error);
            // Handle error states, such as displaying error messages to the user
        }
    };

    const handleDeleteGoal = async (goalToDelete) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/goals/${goalToDelete._id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            setModalConfig({
                title: 'Notification',
                message: 'Entry Removed Successfull.',
                isConfirmation: false,
                onConfirm: () => {},
            });
            setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalToDelete.id));
            console.log('Goal deleted successfully');
            openNotificationModal();
        } catch (error) {
            setModalConfig({
                title: 'Error',
                message: 'Something went wrong.',
                isConfirmation: false,
                onConfirm: () => {},
                modalType: 'error'
            });
            openNotificationModal()
            console.error('Failed to delete goal:', error);
        }
    };

    const handleUndoLastTransaction = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/goals/${editGoal._id}/undoLastTransaction`, null, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const updatedGoal = response.data;
            setGoals(prevGoals => prevGoals.map(g => (g._id === updatedGoal._id ? updatedGoal : g)));
            setIsEditModalOpen(false);
            console.log('Last transaction undone successfully');
        } catch (error) {
            console.error('Failed to undo last transaction:', error);
        }
    };
    return (
        <div className="flex flex-col p-6 gap-6  h-[100vh]">
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={modalConfig.onConfirm}
                title={modalConfig.title}
                message={modalConfig.message}
                isConfirmation={modalConfig.isConfirmation}
                type={modalConfig.modalType}
            />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div
                className="flex items-center space-x-2 md:space-x-6 p-3 px-4 text-white bg-[#0f0f0f] border-2 rounded-md cursor-pointer hover:bg-gray-800"
                onClick={handleCreateModalOpen}
            >
                <button className="uppercase">Create goal</button>
                <PlusIcon className="w-6" />
            </div>
            <div className="flex gap-2 md:gap-5">
                <div className="flex border-2 rounded-md items-center justify-center md:w-max px-4 py-2 bg-[#f8f9fd]">
                    <span>Pending: {goals.filter(goal => goal.currentAmount < goal.targetAmount).length}</span>
                </div>
                <div className="flex border-2 rounded-md items-center justify-center md:w-max px-4 py-2 bg-[#f8f9fd]">
                    <span>Completed: {goals.filter(goal => goal.currentAmount >= goal.targetAmount).length}</span>
                </div>
            </div>
        </div>

        <div className="border-b-2 rounded-sm"></div>
        {goals.length === 0 ? 
        (
        <div className="flex flex-col items-center justify-center h-full">
            <p className="text-gray-600 text-lg">No goals available</p>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-24 w-24 text-gray-400 mt-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    onClick={handleCreateModalOpen}
                />
            </svg>
        </div>
        ) 
        :
        (
            <div className="scrollView h-[50vh] md:h-[70vh] overflow-y-auto">
            <div className="flex flex-wrap gap-10 px-4 md:px-3">
                {goals.map((goal, idx) => (
                    <div key={idx} className="relative w-full md:w-[30%] bg-white rounded-lg shadow-xl mb-4 overflow-hidden" onDoubleClick={() => handleEditModalOpen(goal)}>
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold text-lg text-blue-500 truncate">{goal.name}</span>
                            </div>
                            <p className="text-sm mt-1 mb-4 text-gray-600">{goal.description}</p>
                            <div className="w-[40%] h-auto mx-auto">
                                <CircularProgressbar
                                    value={(goal.currentAmount / goal.targetAmount) * 100}
                                    text={`${((goal.currentAmount / goal.targetAmount) * 100).toFixed(2)}%`}
                                    styles={buildStyles({
                                        strokeWidth: 9,
                                        textColor: "#000",
                                        textSize: "16px",
                                        // fontFamily: "Arial, sans-serif",
                                        pathColor: (goal.currentAmount / goal.targetAmount) * 100 < 50 ? "#ff5722" : (goal.currentAmount / goal.targetAmount) * 100 < 100 ? "#ffc107" : "#4caf50",
                                        trailColor: "#d6d6d6",
                                    })}
                                />
                            </div>
                            <PencilSquareIcon
                                    className="absolute bottom-4 right-12 w-5 h-5 text-blue-500 cursor-pointer"
                                    onClick={() => handleEditModalOpen(goal)}
                                    title="Edit Goal"
                                />
                            <TrashIcon
                                    className="absolute bottom-4 right-4 w-5 h-5 text-red-500 cursor-pointer"
                                    // onClick={() => handleDeleteGoal(goal)}
                                    onClick={() => openConfirmationModal(goal)}
                                    title="Delete Goal"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>

        
        )}

            {/* <div className="flex justify-between items-center text-sm md:text-base">
                <div className="space-x-2">
                    <span>Show</span>
                    <select className="px-2 py-2 md:px-3 md:py-2 border-2 rounded-md" defaultValue={"1"}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                    </select>
                    <span>entries</span>
                </div>
                <div className="space-x-4">
                    <button className="text-xs md:text-base border-2 rounded-md py-2 px-3 md:px-4 md:py-2 capitalize">Previous</button>
                    <button className="text-xs md:text-base border-2 rounded-md py-2 px-3 md:px-4 md:py-2 capitalize text-white bg-[#0f0f0f]">Next</button>
                </div>
            </div> */}

            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-[90vw]">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">Create New Goal</h2>
                            <XCircleIcon
                                className="w-6 h-6 text-gray-500 cursor-pointer"
                                onClick={handleCreateModalClose}
                            />
                        </div>
                        <form onSubmit={handleCreateSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block mb-1">Goal Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={newGoal.name}
                                    onChange={handleCreateChange}
                                    className="w-full border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                                    placeholder="Enter goal name"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block mb-1">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={newGoal.description}
                                    onChange={handleCreateChange}
                                    className="w-full border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                                    placeholder="Enter description"
                                    rows="3"
                                    // required
                                ></textarea>
                            </div>
                            <div>
                                <label htmlFor="targetAmount" className="block mb-1">Target Amount</label>
                                <input
                                    type="number"
                                    id="targetAmount"
                                    name="targetAmount"
                                    value={newGoal.targetAmount}
                                    onChange={handleCreateChange}
                                    className="w-full border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                                    placeholder="Enter target amount"
                                    required
                                    min="0.1"
                                    max="999999999"
                                    step="0.01"
                                />
                            </div>
                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={handleCreateModalClose}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isEditModalOpen && editGoal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-[95vw]">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">{editGoal.name}</h2>
                            <XCircleIcon
                                className="w-6 h-6 text-gray-500 cursor-pointer"
                                onClick={handleEditModalClose}
                            />
                        </div>
                        <form onSubmit={handleAddAmount} className="space-y-4">
                            <div>
                                <label htmlFor="amount" className="block mb-1 text-xl">Add Amount</label>
                                <div className="flex justify-center items-center gap-2">
                                    <input
                                        type="number"
                                        id="amount"
                                        name="amount"
                                        value={editGoal.amount || ''}
                                        onChange={handleEditChange}
                                        className="w-full border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                                        placeholder={`${editGoal.currentAmount >= editGoal.targetAmount ? "Target Completed !" : "Enter amount"}`}
                                        required
                                        disabled={editGoal.currentAmount >= editGoal.targetAmount}
                                        min="0.1"
                                        max="999999999"
                                        step="0.01"
                                    />
                                    <button
                                        type="submit"
                                        className={`bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600 flex items-center ${editGoal.currentAmount >= editGoal.targetAmount ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        disabled={editGoal.currentAmount >= editGoal.targetAmount}
                                    >
                                        Add
                                        <PlusIcon className="ml-2 w-5  mr-2" />
                                    </button>
                                </div>
                            </div>
                        </form>
                        <div className="mt-4">
                            <div className="flex justify-between items-center">
                            <p className="text-xl">Last Transaction: {editGoal.lastTransaction}</p>
                                <button
                                    className={`bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 focus:outline-none focus:bg-red-600 flex items-center ${editGoal.lastTransaction === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={editGoal.lastTransaction !== 0 ? handleUndoLastTransaction : null}
                                    disabled={editGoal.lastTransaction === 0}
                                >
                                    <ArrowUturnLeftIcon className="w-5 h-5 mr-2" />
                                    Undo
                                </button>
                            </div>
                        </div>
                        <div className="mt-4 text-xl" >
                            <p>Current Amount: {editGoal.currentAmount}</p>
                            <br />
                            <p>Target Amount: {editGoal.targetAmount}</p>
                        </div>
                        <div className="w-full h-4 bg-gray-300 rounded-full mb-4 mt-12 relative">
                            <div
                                className={`h-full bg-blue-500 rounded-full
                                ${ ((editGoal.currentAmount / editGoal.targetAmount) * 100) < 50 ? 'bg-red-500' : 
                                    ((editGoal.currentAmount / editGoal.targetAmount) * 100) >= 50 &&
                                    ((editGoal.currentAmount / editGoal.targetAmount) * 100) < 100 ? 'bg-yellow-500' : 'bg-green-500' 
                                }
                                `}
                                style={{ width: `${editGoal.currentAmount < editGoal.targetAmount ? (editGoal.currentAmount / editGoal.targetAmount) * 100 : 100}%` }}
                            >
                            </div>
                             <span className="absolute top-0 right-2 -mt-6 -mr-2 text-gray-700 text-md">{((editGoal.currentAmount / editGoal.targetAmount) * 100).toFixed(2)}%</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Goals;
