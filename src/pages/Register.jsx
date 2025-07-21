import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (parseFloat(amount) < 0) {
      setErrorMessage('Amount cannot be negative');
      return;
    }
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/putIncome`, {
        amount,
        category,
        "description": description.length <=0 ? "-" : description,
        date
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data.message);
      // location.href = '/register';
      navigate('/register')
    } catch (error) {
      console.error("Failed ", error);
      setErrorMessage('Failed to add income. Please try again.');
    }
    // Reset form fields after submission
    setAmount('');
    setCategory('');
    setDescription('');
    // setDate('');
  };
  
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">Add Income</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block mb-1">Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
            placeholder="Enter amount"
          />
        </div>
        <div>
          <label htmlFor="category" className="block mb-1">Category</label>
          <div className="relative">
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:border-blue-500 appearance-none"
              required
            >
              <option value="">Select category</option>
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
              {/* Add more categories as needed */}
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600 w-full">Add Transaction</button>
      </form>
    </div>
  );
};

export default Register;
