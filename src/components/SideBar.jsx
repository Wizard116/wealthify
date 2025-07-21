import {   
    HomeIcon, 
    Cog6ToothIcon, 
    BellIcon, 
    DocumentMagnifyingGlassIcon,
    DocumentDuplicateIcon,
    InformationCircleIcon,
    PlusIcon,
    MinusCircleIcon,
    GlobeAltIcon,
    FlagIcon,
 } from '@heroicons/react/24/outline'
import { HomeIcon as HomeIconSolid,
    Cog6ToothIcon as Cog6ToothIconSolid,
    BellIcon as BellIconSolid,
    DocumentDuplicateIcon as DocumentDuplicateIconSolid,
    DocumentMagnifyingGlassIcon as DocumentMagnifyingGlassIconSolid,
    InformationCircleIcon as InformationCircleIconSolid,
    PlusCircleIcon as PlusCircleIconSolid,
    MinusCircleIcon as MinusCircleIconSolid,
    FlagIcon as FlagIconSolid,
    GlobeAltIcon as GlobeAltIconSolid,
 } from '@heroicons/react/24/solid';
import { useState, Suspense} from 'react';
import { NavLink, useLocation  } from 'react-router-dom'


const SideBar = ({user, barstatus, loading}) => {
    const location = useLocation();
    const [activePage, setActivePage] = useState(location.pathname);
    
    const handleSetActivePage = (pageName) => {
        setActivePage(pageName);
      };

      function UserSkeleton() {
        return (
          <div className='flex items-center gap-3 w-full animate-pulse'>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-300"></div>
            <div className="flex flex-col">
              <div className="w-24 h-4 bg-gray-300 rounded mb-2"></div>
              <div className="w-32 h-4 bg-gray-300 rounded"></div>
            </div>
          </div>
        );
      }

    return (
        <>
        <Suspense fallback={<div>Loading...</div>}>
            <div className={`${barstatus ? 'visible' : 'hidden'} absolute md:static md:flex lg:flex w-[70vw] h-[100vh] md:w-[40vw] lg:w-[18vw] bg-white drop-shadow-md z-12`} id="sidebar">
                <div className="scrollView p-8 w-full overflow-y-auto h-[95vh] pb-28 md:pb-0">
                    {loading ? (
        <UserSkeleton />
      ) : (
                    <div className='flex items-center gap-3 w-full'>
                        <img
                            className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2"
                            src={user.imageUrl}
                            onError={(e) => { e.target.src = '/images/dummy.webp'; }}
                            alt="Profile"
                            loading="lazy"
                        />
                        <div className="flex flex-col">
                            <span className="">{user.username}</span>
                            <span className="text-slate-800 text-sm">{localStorage.getItem("username")}</span>
                        </div>
                    </div>
      )}

                    <NavLink to={"/dashboard"} onClick={() => {handleSetActivePage('/dashboard')}}>
                        <div className={`flex items-center justify-between w-full my-8`}>
                            <span className=''>Dashboard</span>
                            {activePage === '/dashboard' ? <HomeIconSolid className='w-4' /> : <HomeIcon className='w-4' />}
                        </div>
                    </NavLink>

                    <NavLink to={"/account"} onClick={() => {handleSetActivePage('/account')}}>
                        <div className={`flex items-center justify-between w-full my-8`}>
                            <span className=''>Account Settings</span>
                            {activePage === '/account' ? <Cog6ToothIconSolid className='w-4' /> : <Cog6ToothIcon className='w-4' />}
                        </div>
                    </NavLink>

                    <NavLink to={"/notifications"} onClick={() => {handleSetActivePage('/notifications')}}>
                        <div className='flex items-center justify-between w-full my-8'>
                            <span className=''>Audit Log</span>
                            {activePage === '/notifications' ? <BellIconSolid className='w-4' /> : <BellIcon className='w-4' />}
                        </div>
                    </NavLink>

                    {/* Divider */}
                    {/* <span className='text-slate-600 text-base md:text-lg'>Money Management</span>  */}

                    <NavLink to={"/register"} onClick={() => {handleSetActivePage('/register')}}>
                        <div className='flex items-center justify-between w-full my-8'>
                            <span className=''>Income</span>
                            {activePage === '/register' ? <PlusCircleIconSolid className='w-4' /> : <PlusIcon className='w-4' />}
                        </div>
                    </NavLink>

                    <NavLink to={"/expense"} onClick={() => {handleSetActivePage('/expense')}}>
                        <div className='flex items-center justify-between w-full my-8'>
                            <span className=''>Expense</span>
                            {activePage === '/expense' ? <MinusCircleIconSolid className='w-4' /> : <MinusCircleIcon className='w-4' />}
                        </div>
                    </NavLink>

                    <NavLink to={"/logs"} onClick={() => {handleSetActivePage('/logs')}}>
                        <div className='flex items-center justify-between w-full my-8'>
                            <span className=''>Transactions</span>
                            {activePage === '/logs' ? <DocumentDuplicateIconSolid className='w-4' /> : <DocumentDuplicateIcon className='w-4' />}
                        </div>
                    </NavLink>

                    {/* <span className='text-slate-600 text-base md:text-lg'>Reporting and Analytics</span>  */}

                    <NavLink to={"/report"} onClick={() => {handleSetActivePage('/report')}}>
                        <div className='flex items-center justify-between w-full my-8'>
                            <span className=''>Generate Reports</span>
                            {activePage === '/report' ? <DocumentMagnifyingGlassIconSolid className='w-4' /> : <DocumentMagnifyingGlassIcon className='w-4' />}
                        </div>
                    </NavLink>

                    {/* <span className='text-slate-600 text-8 text-base md:text-lg'>User Support & Others</span>  */}
                    <NavLink to={"/goals"} onClick={() => {handleSetActivePage('/goals')}}>
                        <div className='flex items-center justify-between w-full my-8'>
                            <span className=''>Goals</span>
                            {activePage === '/goals' ? <FlagIconSolid className='w-4' /> : <FlagIcon className='w-4' />}
                        </div>
                    </NavLink>

                    <NavLink to={"/explore"} onClick={() => {handleSetActivePage('/explore')}}>
                        <div className='flex items-center justify-between w-full my-8'>
                            <span className=''>Explore</span>
                            {activePage === '/explore' ? <GlobeAltIconSolid className='w-4' /> : <GlobeAltIcon className='w-4' />}
                        </div>
                    </NavLink>

                    <NavLink to={"/helpdesk"} onClick={() => {handleSetActivePage('/helpdesk')}}>
                        <div className='flex items-center justify-between w-full my-8'>
                            <span className=''>HelpDesk</span>
                            {activePage === '/helpdesk' ? <InformationCircleIconSolid className='w-4' /> : <InformationCircleIcon className='w-4' />}
                        </div>
                    </NavLink>
                    {/* presentation */}

                    {/* <div className='w-full border-2 border-slate-100'></div> */}

                </div>
            </div>
        </Suspense>
        </>
    )
}

export default SideBar