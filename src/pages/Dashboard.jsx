import {   
    ChartPieIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    WalletIcon,
    UserGroupIcon,
    CreditCardIcon,
    CurrencyRupeeIcon,
 } from '@heroicons/react/24/outline'
 

//  import { Chart } from "react-google-charts";
import { Chart as ChartJS, defaults }from 'chart.js/auto';
import { Bar, PolarArea } from 'react-chartjs-2';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import { useState, Suspense, useEffect } from 'react';
import axios from "axios"
import LoadingSpinner from '../components/Loading';
import AuthUser from "../components/AuthUser";



defaults.maintainAspectRatio = false;
defaults.responsive = true;
 


const subtractDay = 31; // Number of Days back than current date.
const startDate = new Date(new Date().getTime() - subtractDay * 24 * 60 * 60 * 1000); // Date of when user started using application.

export default function Dashboard() {
    const { getToken } = AuthUser();
    const [transactions, setTransactions] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [balance, setBalance] = useState(0);
    const [selectedFilter, setSelectedFilter] = useState('Income');
    const [initialData, setInitialData] = useState([]);
    const [date, setDate] = useState(new Date());
    const [modalData, setModalData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('')
    const [totalMonthAmount, setTotalMonthAmount] = useState(0);
    const [chartKey, setChartKey] = useState(0);
    const [loading, setLoading] = useState(true);
    const [dataLabelsPlugin, setDataLabelsPlugin] = useState(null);
    


    const months = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];

      const options = {
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                const dataset = context.dataset;
                const currentValue = dataset.data[context.dataIndex];
                const percentage = Math.min((currentValue / totalMonthAmount) * 100, 100).toFixed(2) + '%';
                return `${dataset.data[context.dataIndex]} (${percentage})`;
              }
            },
            enabled: true
          },
          legend: {
            display: false,
            position: 'bottom'
          },
          dataLabelsPlugin: [dataLabelsPlugin]
        }
      };

      useEffect(() => {
        const token = localStorage.getItem("token");
        let totalAmount =  0;
        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/dashboardShow`, {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  },
                  params: {
                    type: selectedFilter
                }
                });
                // setChartKey(prevKey => prevKey + 1)
                setInitialData(response.data)
            } catch (error) {
              console.log(error)
            }
        };
        const wholeData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/sortByDate/asc`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                const data = response.data;
                // setModalData(data);
                
                let totalIncome = 0;
                let totalExpense = 0;
            
                const summary = data.reduce((acc, curr) => {
                    const formattedDate = new Date(curr.date).toISOString().split('T')[0];
                    if (!acc[formattedDate]) {
                        acc[formattedDate] = { income: 0, expense: 0 };
                    }
                    if (curr.type === "Income") {
                        acc[formattedDate].income += curr.amount;
                        totalIncome += curr.amount;
                    } else {
                        acc[formattedDate].expense += curr.amount;
                        totalExpense += curr.amount;
                    }
                    return acc;
                }, {});
                
                // Calculate total transactions
                const totalTransactions = Object.values(summary).reduce((acc, curr) => {
                    return acc + curr.income + curr.expense;
                }, 0);
                
                // Calculate balance
                const balance = totalIncome - totalExpense;
                setTransactions(summary);
                setTotalIncome(totalIncome);
                setTotalExpense(totalExpense);
                setTotalTransactions(totalTransactions);
                setBalance(balance);
                // setChartKey(prevKey => prevKey + 1)
            } catch (error) {
                console.log("Date Sorted Error", error);
            }
        };
        const fetchMonthlyData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/filterByMonth`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        type: selectedFilter,
                        month: months.indexOf(selectedMonth) + 1, // Current month
                        year: new Date().getFullYear(),   // Current year
                    }
                });
                
                response.data.forEach((item) => {
                    totalAmount += item.totalAmount;
                })

                setTotalMonthAmount(totalAmount)
                setModalData(response.data);
                // setChartKey(prevKey => prevKey + 1);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching monthly data:", error);
            }
        };
        if(getToken) {
            fetchData();
            wholeData();
            fetchMonthlyData();
            setTimeout(
                () => {
                    setChartKey(prevKey => prevKey + 1);
                }, 100);
        }
        
        }, [selectedFilter, selectedMonth]);

        useEffect(() => {
            const currentMonth = new Date().toLocaleString('default', { month: 'long' });
            setSelectedMonth(currentMonth);
        }, []);
         
        if (initialData.length === 0) {
            return <div>Loading...</div>;
        }

        const labels = modalData.map(item  => item.category);
        const dataC = modalData.map(item => item.totalAmount);

        const chartLabels = initialData.map(item => item.date);
        const chartData = initialData.map(item => item.amount);

        const optionsMain = {
            plugins: { 
                legend: {
                    display: false // Disable legend
                }
            }
        }
        const items = {
            labels: chartLabels,
            datasets: [
                {
                    data: chartData,
                    borderRadius: 50
                }
            ]
        }

        const tileContent = ({ date, view }) => {
            if (view === 'month') {
                const formattedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
                const dailyTotal = transactions[formattedDate];
        
                if (dailyTotal) {
                    const total = dailyTotal.income - dailyTotal.expense;
                    return (
                        <div>
                            <span
                                className={`text-[10px] ${total <= 0 ? 'text-red-600' : 'text-green-600'}`}
                                // onClick={() => handleDateClick(formattedDate)}
                            >
                                {formatNumber(total)}
                            </span>
                        </div>
                    );
                }
            }
            return null;
        };  
    
        const formatNumber = (num) => {
            // Check if the number is negative
            const isNegative = num < 0;
            // Take the absolute value of the number for formatting
            const absNum = Math.abs(num);
            
            if (absNum < 1000) {
                return (isNegative ? '-₹' : '₹') + absNum;
            } else if (absNum < 1000000) {
                return (isNegative ? '-₹' : '₹') + (absNum / 1000).toFixed(2) + 'K';
            } else if (absNum < 1000000000) {
                return (isNegative ? '-₹' : '₹') + (absNum / 1000000).toFixed(2) + 'M';
            } else if (absNum < 1000000000000) {
                return (isNegative ? '-₹' : '₹') + (absNum / 1000000000).toFixed(2) + 'B';
            } else {
                return (isNegative ? '-₹' : '₹') + (absNum / 1000000000000).toFixed(2) + 'T';
            }
        };
    
    return (
        <>
        <div className="dashboard grid grid-cols-1 md:grid-cols-5 md:grid-row-5 gap-6">
            <div className="md:col-span-3 flex justify-center mt-8 md:mt-0 opacity-90 bg-[url('https://media.istockphoto.com/id/1474141135/vector/stock-market-trading-background-wallpaper-with-light-finance-banner-graph-vector-illustration.jpg?s=612x612&w=0&k=20&c=SrZF5sDNAABv0QokVPghRT8IHaTeJnYeMYO_4eTGMK8=')] bg-bottom">
                
            </div>
                <div className="">
                    <div className='flex flex-col px-4 py-6'>
                        <ChartPieIcon className='w-12 stroke-[#71DD37]'></ChartPieIcon>
                        <p className='text-sm text-[#3E4758]'>Expense</p>
                        <p className='text-2xl'>{formatNumber(totalExpense)}</p>
                        {/* <p className='flex text-base text-[#f14326]'><ArrowDownIcon className='w-4'></ArrowDownIcon> 75.8%</p> */}
                    </div>
                </div>

                <div className="">
                    <div className='flex flex-col px-4 py-6 justify-between'>
                        <WalletIcon className='w-12 stroke-[#9ae7f7]'></WalletIcon>
                        <p className='text-sm text-[#3E4758]'>Income</p>
                        <p className='text-2xl'>{formatNumber(totalIncome)}</p>
                        {/* <p className='flex text-base text-[#71DD37]'><ArrowUpIcon className='w-4'></ArrowUpIcon> 4.8%</p> */}
                    </div>
                </div>

                <div className="row-start-6 md:col-span-3 md:row-span-2 md:row-start-2">
                <div className='flex flex-col w-full justify-center items-center'>
                    <p className="text-3xl mt-4 uppercase">overview</p>
                    <div className='w-full text-center'>
                        <span className=''>{date.length > 0 ? date[0].toDateString() || date[0].toDateString() : date.toDateString()}</span>
                        <span className='absolute right-16 flex gap-4'>
                            <label htmlFor="Income">
                            <input
                                type="radio"
                                id="Income"
                                name="filters"
                                value="Income"
                                checked={selectedFilter === 'Income'}
                                onChange={() => setSelectedFilter('Income')}
                            />
                                <span> Income </span>
                            </label>
                            <label htmlFor="Expense">
                            <input
                                type="radio"
                                id="Expense"
                                name="filters"
                                value="Expense"
                                checked={selectedFilter === 'Expense'}
                                onChange={() => setSelectedFilter('Expense')}
                            />
                                <span> Expense </span>
                            </label>
                        </span>
                    </div>
                    <div className='w-[100%] md:w-[90%] p-8 md:px-16 md:mb-6'>
                        <Bar
                            className='h-[30vh]'
                            data={items}
                            options={optionsMain}
                        />
                    </div>
                </div>
            </div>
                <div className="">
                    <div className='flex flex-col px-4 py-6 justify-between'>
                        <CurrencyRupeeIcon className='w-12 stroke-[#f14326]'></CurrencyRupeeIcon>
                        <p className='text-sm text-[#3E4758]'>Your Balance</p    >
                        <p className={`text-2xl ${balance < 0 ? '' : ''}`}>{formatNumber(balance)}
                         {balance < 0 ? <ArrowDownIcon className='inline w-4 text-[#f14326]' /> : <ArrowUpIcon className='inline w-4 text-[#71DD37]' /> }
                        </p>
                    </div>
                </div>
                <div className="">
                    <div className='flex flex-col px-4 py-6 justify-between'>
                        <CreditCardIcon className='w-12 stroke-[#c3c3ff]'></CreditCardIcon>
                        <p className='text-sm text-[#3E4758]'>Total Transactions</p>
                        <p className='text-2xl'>{formatNumber(totalTransactions)}</p>
                    </div>
                </div>
                <div className="md:col-span-3 flex flex-col items-center">
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="mt-2 md:relative left-52 top-5 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 px-4 py-2 mb-4"
                    >
                        {months.map((month, index) => (
                            <option key={index} value={month}>{month}</option>
                        ))}
                    </select>
                    <div className="w-[300px] h-[300px]">
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                            <PolarArea 
                            key={chartKey}
                            data={{
                                labels: labels,
                                datasets: [{
                                    data: dataC,
                                    backgroundColor: [
                                        'rgba(255, 99, 132, 0.2)',
                                        'rgba(54, 162, 235, 0.2)',
                                        'rgba(255, 206, 86, 0.2)',
                                        'rgba(75, 192, 192, 0.2)',
                                        'rgba(153, 102, 255, 0.2)',
                                        'rgba(255, 159, 64, 0.2)'
                                    ],
                                    borderColor: [
                                        'rgba(255, 99, 132, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(255, 206, 86, 1)',
                                        'rgba(75, 192, 192, 1)',
                                        'rgba(153, 102, 255, 1)',
                                        'rgba(255, 159, 64, 1)'
                                    ],
                                    borderWidth: 1
                                }]}
                            } options={options} />
                        )}
                    </div>
                </div>
 {/* h-52 */}
                <div className="flex flex-col items-center justify-center  gap-8 md:gap-0 md:col-span-2 md:h-auto md:row-start-3 md:row-span-2 p-8 mb-16 md:mb-0">
                    <span className='text-4xl uppercase mb-12'>daily insights</span>
                    <Calendar
                        minDate={startDate}
                        minDetail={"year"}
                        maxDate={new Date()}
                        // onChange={ setDate }
                        value={date}
                        tileContent={tileContent}
                        // selectRange={true}
                        // tileDisabled={({activeStartDate, date, view }) => date.getDay() === 2}
                        // onClickDay={(value, event) => alert('Clicked day: '+ value.getDate())}
                        // onChange={handleDateChange}
                    />
                </div>
        </div>
        </>
)}