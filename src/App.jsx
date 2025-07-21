import { useState, useEffect, lazy } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useNavigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
const Sidebar = lazy(() => import('./components/SideBar'));
import Calculator from "./components/Calculator";
import Login from "./components/Login"
import SingUp from "./components/Register"
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Notifications from "./pages/Notifications";
import NotFound  from "./pages/NotFound";
import Register from "./pages/Register";
import Expense from "./pages/Expense";
import Permissions from "./pages/Permissions";
import Goals from "./pages/Goals";
import Logs from "./pages/Logs";
import Report from "./pages/Report";
import Explore from "./pages/Explore";
import HelpDesk from "./pages/HelpDesk";
import AuthUser from "./components/AuthUser";
import { CalculatorIcon } from "@heroicons/react/24/outline";
import Protected from "./components/Protected";
import axios from "axios"


const data = [
["Year", "Sales", "Expenses", "Profit"],
["2014", 1000, 400, 200],
["2015", 1170, 460, 250],
["2016", 660, 1120, 300],
["2017", 1030, 540, 350],
];



export default function App() {
  // const navigate = useNavigate();
  const { getToken } = AuthUser();
  const [barstatus, setBarstatus] = useState(false);
  const [isCalOpen, setCal] = useState(false);
  const [loginstatus, setLoginStatus] = useState(false);
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    username: '',
    imageUrl: '',
    userId: localStorage.getItem("username"),
  })
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = response.data; // Assuming the response contains user data in JSON format
        setUserData({
          username: `${data.firstName} ${data.lastName}`,
          imageUrl: data.imageUrl,
          userId: localStorage.getItem("username"),
        })
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // setLoading(false);
      }
    };

    const fetchIncome = async () => {
      try {
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/getIncome`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setIncomeData(response.data);
          // setLoading(false);
          // response.data
      } catch (error) {
        console.log(error)
          // setError(error.message);
      }
    }; 

    const fetchExpense = async () => {
      try {
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/getExpense`, {
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          });
          setExpenseData(response.data);
          // setLoading(false);
      } catch (error) {
          console.log(error);
          // setError(error.message);
      }
    };
    if(getToken()) {
      fetchProfile();
      fetchIncome();
      fetchExpense();
    }

    const viewArea = document.querySelector("#viewArea") ?? document;
    const handleBodyClick = () => {
      setBarstatus(false);
      setCal(false);
    };
    
    if(barstatus || isCalOpen) {
      viewArea.addEventListener('click', handleBodyClick);
    }
    else {
      viewArea.removeEventListener('click', handleBodyClick);
    }


    return () => {
      viewArea.removeEventListener('click', handleBodyClick);
    };
  }, [barstatus, isCalOpen])
  
  const handleAction = () => {
    setBarstatus(!barstatus);
  }
  const handleLogout = () => {
    localStorage.setItem("token", '');
    localStorage.setItem("username", '')
    location.href = "/"
  }

  const openCalc = () => {
    setCal(!isCalOpen);
  }

  const handleLogin = (data) => {
    if(data.length) {
      setLoginStatus(true)
      // window.location.reload()
      // location.href="/dashboard"
      // navigate('/dashboard')
    }
  }

  if(!getToken() || loginstatus) {
    return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path='/*' element={<Login handleLogin={handleLogin} /> } />
            <Route path='/login' element={<Login handleLogin={handleLogin}/>} />
            <Route path='/register' element={<SingUp />} />

          </Routes>
        
        </BrowserRouter>
      </>
    )
  }
  else {

  return (
    <>
      <BrowserRouter>
      {/* <div className="">{loading ? "Loading..." : incomeData.map((data, idx) => {
            return <p key={idx}>
              {new Date(data.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              <span> # </span>
              {data.amount}
              <span> # </span>
              {data.category}
              <span> # </span>
              {data.description}
            </p>
        })}
      </div> */}
        {isCalOpen ? <Calculator /> : ''}
        <CalculatorIcon className="fixed right-8 bottom-8 border-2 rounded-xl w-8 cursor-pointer z-10 bg-white" onClick={openCalc}/>
        <Navbar user={userData} barstatus={barstatus} handleClick={handleAction} handleLogout={handleLogout}/>
        {/* <Navbar user={userData} barstatus={barstatus} handleClick={handleAction} /> */}
        <div className="flex flex-row-reverse bg-blue-50">
          {/* bg-[#f6f7fb] */}
        {/* <PullToRefresh onRefresh={handleRefresh}> */}
          <div className="scrollView overflow-y-auto h-[90vh] pb-10 m-3 lg:m-6 w-full md:w-[80vw] lg:w-[80vw] z-99" id="viewArea">
            <Routes>
              {/* <Route path="/login" element={<Login />} /> */}
              <Route path="/*" element={<NotFound />} />
              <Route path="/" element={<Dashboard />} />
              {/* <Route path="/login" element={<Login />} /> */}
              <Route path="/dashboard" element={<Dashboard /> } />
              <Route path="/account" element={<About setUserData={setUserData} />} />
              <Route path="/notifications" element={<Notifications />}/>
              <Route path="/register" element={<Register />}/>
              <Route path="/expense" element={<Expense />}/>
              <Route path="/permissions" element={<Permissions />}/>
              <Route path="/goals" element={<Goals />}/>
              <Route path="/logs" element={<Logs />}/>
              <Route path="/report" element={<Report incomeData={incomeData} setIncomeData={setIncomeData} expenseData={expenseData} setExpenseData={setExpenseData}/>}/>
              <Route path="/explore" element={<Explore />}/>
              <Route path="/helpdesk" element={<HelpDesk />}/>
            </Routes>
          </div>
          <Sidebar user={userData} barstatus={barstatus} loading={loading}/>
        </div>
      </BrowserRouter>
    </>
  )
  }
}
