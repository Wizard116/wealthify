import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import axios from "axios";

// -----------------------------
// pdfMake setup
// -----------------------------
import pdfMake from "pdfmake/build/pdfmake";
// vfs_fonts attaches itself to window.pdfMake, so we just need to import it
import "pdfmake/build/vfs_fonts";
import { font as tamilFont } from "./Ubuntu";

// Merge the default vfs provided by pdfMake with the one attached to the window
if (typeof window !== "undefined" && window.pdfMake) {
  pdfMake.vfs = window.pdfMake.vfs;
}
// Add your custom font to the virtual file system
pdfMake.vfs["TiroTamil-Regular.ttf"] = tamilFont;

export default function Report() {
  const [searchText, setSearchText] = useState("");
  const [wholeData, setWholeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [orderDate, setOrderDate] = useState(true);
  const token = localStorage.getItem("token");

  // --------------------------------------------------
  // Fetch & sort data by date (asc / desc)
  // --------------------------------------------------
  useEffect(() => {
    const sortByDate = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/sortByDate/${orderDate ? "desc" : "asc"}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setWholeData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Date Sorted Error", error);
      }
    };
    sortByDate();
  }, [orderDate, token]);

  // --------------------------------------------------
  // Search handler
  // --------------------------------------------------
  const handleSearch = () => {
    if (searchText.trim() === "") {
      setFilteredData(wholeData);
      return;
    }

    const searchData = wholeData.filter((item) =>
      new Date(item.date)
        .toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      item.amount.toString().includes(searchText) ||
      item.category.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredData(searchData);
  };

  // --------------------------------------------------
  // Generate & download PDF report
  // --------------------------------------------------
  const handleDownload = () => {
    const tableRows = filteredData.map((item, index) => {
      const isEven = index % 2 === 0;
      const bgColor = isEven ? "#FFFFFF" : "#F0F0F0";
      return [
        { text: `${index + 1}.`, alignment: "center", fillColor: bgColor },
        {
          text: new Date(item.date).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
          alignment: "center",
          fillColor: bgColor,
        },
        {
          text: item.type === "Expense" ? -item.amount : item.amount,
          alignment: "center",
          fillColor: bgColor,
          color: item.type === "Expense" ? "#ef4444" : "#22c55e",
        },
        { text: item.category, alignment: "center", fillColor: bgColor },
        { text: item.description, alignment: "center", fillColor: bgColor },
      ];
    });

    const docDefinition = {
      pageSize: {
        width: 430,
        height: "auto",
      },
      content: [
        { text: "Transactions", style: "header", margin: [0, 0, 0, 10] },
        {
          table: {
            headerRows: 1,
            widths: ["auto", "auto", "auto", "auto", "auto"],
            body: [
              [
                { text: "Index", style: "tableHeader" },
                { text: "Date", style: "tableHeader" },
                { text: "Amount", style: "tableHeader" },
                { text: "Category", style: "tableHeader" },
                { text: "Description", style: "tableHeader" },
              ],
              ...tableRows,
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          alignment: "center",
          color: "#000",
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: "black",
        },
      },
    };

    pdfMake
      .createPdf(docDefinition)
      .download(
        `Report_${new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })}.pdf`
      );
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------
  return (
    <div className="flex flex-col p-6 gap-6 bg-white drop-shadow rounded-xl">
      <span className="text-2xl">Custom Reports</span>

      {/* Search + Download */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        {/* Search box */}
        <div className="flex border-2 rounded-md justify-between md:w-max px-5 py-1 bg-[#f8f9fd]">
          <input
            className="p-1 focus:outline-none bg-[#f8f9fd] border-none"
            type="text"
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <MagnifyingGlassIcon
            className="w-6 text-slate-300 cursor-pointer"
            onClick={handleSearch}
          />
        </div>

        {/* Download button */}
        <div
          className="flex items-center justify-center space-x-2 md:mr-12 p-3 px-4 text-white bg-[#0f0f0f] border-2 rounded-md cursor-pointer hover:bg-gray-800"
          onClick={handleDownload}
        >
          <span className="uppercase">Generate Report</span>
          <ArrowDownTrayIcon className="w-6" />
        </div>
      </div>

      <div className="border-b-2 rounded-sm" />

      {/* Transactions table */}
      <div className="scrollView h-[35vh] md:h-[55vh] overflow-y-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="sticky top-0 bg-gray-50">
            <tr>
              {/* Date */}
              <th
                className="cursor-pointer px-2 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider relative"
                onClick={() => setOrderDate(!orderDate)}
              >
                <span>Date</span>
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  {orderDate ? (
                    <ChevronUpIcon className="w-5 inline" />
                  ) : (
                    <ChevronDownIcon className="w-5 inline" />
                  )}
                </span>
              </th>

              {/* Amount */}
              <th className="px-2 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>

              {/* Category */}
              <th className="px-2 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>

              {/* Description */}
              <th className="hidden md:table-cell px-2 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
            </tr>
          </thead>

          {filteredData.length > 0 ? (
            <tbody>
              {filteredData.map((item, idx) => (
                <tr
                  key={idx}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } text-center text-sm md:text-base`}
                >
                  <td className="px-2 md:px-6 py-2 text-left">
                    {new Date(item.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td
                    className={`text-right md:text-center ${
                      item.type === "Expense" ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {item.type === "Expense" ? "-" : "+"}₹{item.amount}
                  </td>
                  <td className="text-right md:text-center">{item.category}</td>
                  <td className="hidden md:table-cell text-center">
                    {item.description.length <= 28
                      ? item.description
                      : `${item.description.substring(0, 22)}...`}
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td className="text-center" colSpan="4">
                  <div className="flex flex-col items-center justify-center mt-10 md:mt-20">
                    <p className="text-gray-600 text-lg">No transactions available</p>
                  </div>
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
