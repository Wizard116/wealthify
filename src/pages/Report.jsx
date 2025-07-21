import { MagnifyingGlassIcon, ArrowDownTrayIcon, ChevronUpDownIcon, ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react";
import axios from "axios";
import tabledata from "../db.json";

import pdfMake from "pdfmake/build/pdfmake"
import pdfFonts from "pdfmake/build/vfs_fonts"
import {font} from './Ubuntu' 
pdfMake.vfs = pdfFonts.pdfMake.vfs   
window.pdfMake.vfs["TiroTamil-Regular.ttf"] = font


export default function Report() {
    const [searchText, setSearchText] = useState("");
    const [wholeData, setwholeData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [orderDate, setOrderDate] = useState(true);
    const [orderAmount, setOrderAmoumt] = useState(true);
    const [orderCategory, setOrderCategory] = useState(true);
    const [orderDescription, setOrderDescription] = useState(true);

    
    const token = localStorage.getItem("token");

    

    useEffect(() => {
        const sortByDate = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/sortByDate/${orderDate ? 'desc' : 'asc'}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setwholeData(response.data)
                setFilteredData(response.data)
            } catch(error) {
                console.log("Date Sorted Error", error);
            }
        };
        sortByDate();
        // setFilteredData(wholeData.concat(expenseData));
    }, [orderDate]);

    
    

    const handleSearch = () => {
        if (searchText.trim() === '') {
            setFilteredData(wholeData);
        } else {
            console.log(new Date(wholeData[0].date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }))
            const searchData = wholeData.filter(item =>
                // item.date.includes(searchText) ||
                new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toLowerCase().includes(searchText) ||
                item.amount.toString().includes(searchText) || // Convert amount to string before comparison
                item.category.toLowerCase().includes(searchText.toLowerCase()) ||
                item.description.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredData(searchData);
        }
    };
    
    const handleDownload = () => {
        const tableRows = filteredData.map((item, index) => {
            const color = index % 2 === 0 ? '#FFFFFF' : '#F0F0F0'; // Alternate row colors
            return [
                { text: `${index + 1}.`, alignment: 'center', fillColor: color },
                { text: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }), alignment: 'center', fillColor: color },
                { text: item.type == "Expense" ? -item.amount : item.amount, alignment: 'center', fillColor: color, color: item.type == "Expense" ? "#ef4444" : "#22c55e" },
                { text: item.category, alignment: 'center', fillColor: color },
                { text: item.description, alignment: 'center', fillColor: color },
            ];
        });
    
        const defDoc = {
            pageSize: {
                width: 430,
                height: 'auto',
            },
            content: [
                {
                    text: 'Transactions',
                    style: 'header',
                    margin: [0, 0, 0, 10]
                },
                {
                    table: {
                        headerRows: 1,
                        widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
                        body: [
                            [
                                { text: 'Index', style: 'tableHeader' },
                                { text: 'Date', style: 'tableHeader' },
                                { text: 'Amount', style: 'tableHeader' },
                                { text: 'Category', style: 'tableHeader' },
                                { text: 'Description', style: 'tableHeader' }
                            ],
                            ...tableRows
                        ]
                    }
                }
            ],
            styles: {
                header: {
                    fontSize: 16,
                    bold: true,
                    alignment: 'center',
                    color: '#000'
                },
                tableHeader: {
                    bold: true,
                    fontSize: 12,
                    color: 'black'
                }
            }
        };
    
        pdfMake.createPdf(defDoc).download(`Report_${new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}.pdf`)
    };
    
    
    return (
        <div className="flex flex-col p-6 gap-6 bg-white drop-shadow rounded-xl">
            <span className="text-2xl">Custom Reports</span>

            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex border-2 rounded-md justify-between md:w-max px-5 py-1 bg-[#f8f9fd]">
                    <input className="p-1 focus:outline-none bg-[#f8f9fd] border-none" type="text"
                    placeholder="Search"
                    value={searchText}
                    onChange={(e) => {setSearchText(e.target.value); }} // handleSearch();
                    />
                    <MagnifyingGlassIcon className="w-6 text-slate-300 cursor-pointer focus:outline-none" onClick={handleSearch} tabIndex={0}/>
                </div>

                <div className="flex items-center justify-center space-x-6 md:mr-12 p-3 px-4 text-white bg-[#0f0f0f] border-2 rounded-md cursor-pointer hover:bg-gray-800"
                    onClick={handleDownload}
                    >
                    <button className="uppercase">Generate Report</button>
                    <ArrowDownTrayIcon className="w-6"/>
                </div>
            </div>

            <div className="border-2 border-b-2 rounded-sm"></div>

            <div className="scrollView h-[35vh] md:h-[55vh] overflow-y-auto">
            <table className="w-full md:w-full divide-y divide-gray-200">
                <thead className="sticky top-0 bg-gray-50">
                    <tr className="">
                    <th scope="col" className="cursor-pointer px-2 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider relative" onClick={() => {setOrderDate(!orderDate);}}> { /* onClick={sortByDate} */}
                        <span>Date</span>
                        <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        {orderDate ? <ChevronUpIcon className="w-5 inline"/> : <ChevronDownIcon className="w-5 inline"/>}
                        </span>
                    </th>
                    <th scope="col" className="cursor-pointer px-2 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider relative">
                        <span>Amount</span>
                        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 translate-x-6">
                        {/* {orderAmount ? <ChevronUpIcon className="w-5 inline"/> : <ChevronDownIcon className="w-5 inline"/>} */}
                        </span>
                    </th>
                    <th scope="col" className="cursor-pointer px-2 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider relative">
                        <span>Category</span>
                        <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        {/* {orderCategory ? <ChevronUpIcon className="w-5 inline"/> : <ChevronDownIcon className="w-5 inline"/>} */}
                        </span>
                    </th>
                    <th scope="col" className="cursor-pointer hidden md:block px-2 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider relative">
                        <span>Description</span>
                        <span className="absolute right-8 top-1/2 transform -translate-y-1/2 -translate-x-8">
                        {/* {orderDescription ? <ChevronUpIcon className="w-5 inline"/> : <ChevronDownIcon className="w-5 inline"/>} */}
                        </span>
                    </th>
                    </tr>
                </thead>
                {filteredData.length > 0 ? (
                        <tbody>
                            {filteredData.map((person, id) => (
                                <tr key={id} className={`${id % 2 === 0 ? 'bg-gray-100' : 'bg-white'} text-center text-sm md:text-base`}>
                                    <td className="px-2 md:px-6 py-2 text-left">{new Date(person.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</td>
                                    {/* <td className={`text-right md:text-center ${person.amount <= 0 ? 'text-red-600' : 'text-green-600'}`}>₹{person.amount}</td> */}
                                    <td className={`text-right md:text-center ${person.type == "Expense" ? "text-red-500" : "text-green-500"}`}>{person.type == "Expense" ? "-" : "+"}₹{person.amount}</td>
                                    <td className="text-right md:text-center">{person.category}</td>
                                    <td className={`hidden md:flex md:items-center md:justify-center md:mt-1.5`}>{person.description.length <= 28 ? person.description : `${person.description.substring(0, 22)}...`}</td>
                                </tr>
                            ))}
                        </tbody>
                     ) : (
                        <tbody>
                            <tr>
                                <td className="text-center" colSpan="4">
                                    {/* No Result Found */}
                                    <div className="flex flex-col items-center justify-center mt-[10vh] md:mt-[25vh]">
                                        <p className="text-gray-600 text-lg">No transactions available</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    )}
            </table>

            </div>

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
                    <button className="text-xs md:text-base border-2 rounded-md py-2 px-3 md:px-4 md:py-2 capitalize text-white bg-[#0f0f0f]">Next </button>
                </div>
            </div> */}
        </div>
    );
}
