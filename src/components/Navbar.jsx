import { BellIcon, PowerIcon, MoonIcon, SunIcon, Bars3Icon } from '@heroicons/react/24/outline'
import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';


const changeMode = (e) => {
    // console.log(e.target.className.baseVal.includes('dark'));
    document.querySelector('.darkIcon').classList.toggle('hidden');
    document.querySelector('.lightIcon').classList.toggle('hidden');
}

export default function Navbar({user, handleClick, handleLogout}) {
    return (
        <>
            {/* UI may have some glitch that occured by p-3 px-4 */}
            <div className="bg-gray-800 p-3 px-4 flex items-center justify-between text-white sticky top-0"> 
                <NavLink to={"/"}>
                    <div className='flex items-center md:gap-3'>
                        <svg className='w-10' viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M32.07 5.66299H15.93C15.1647 5.66286 14.4129 5.86416 13.7501 6.24665C13.0873 6.62914 12.5368 7.17935 12.154 7.84199L4.084 21.821C3.70141 22.4836 3.5 23.2353 3.5 24.0005C3.5 24.7657 3.70141 25.5173 4.084 26.18L12.154 40.158C12.5367 40.8208 13.0871 41.3712 13.7499 41.7539C14.4128 42.1366 15.1646 42.338 15.93 42.338H32.07C32.8352 42.3378 33.5869 42.1363 34.2495 41.7536C34.9121 41.371 35.4624 40.8207 35.845 40.158L43.916 26.18C44.2988 25.5172 44.5003 24.7653 44.5003 24C44.5003 23.2346 44.2988 22.4828 43.916 21.82L35.846 7.84199C35.4633 7.17916 34.9129 6.62876 34.2501 6.24608C33.5872 5.86341 32.8354 5.66296 32.07 5.66299Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M7.32001 31.785H19.505M19.505 31.785L25.598 42.337M19.505 31.785L15.011 24L19.505 16.215M19.505 31.785H28.495L32.989 24M39.082 13.447L32.989 24M32.989 24L39.082 34.553M32.989 24L28.495 16.215H19.505M7.32001 16.215H19.505M19.505 16.215L25.598 5.66199" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <p className='text-2xl hidden md:block'>Wealthify</p>
                    </div>
                </NavLink>

                <div className='flex items-center gap-8'>
                    {/* <div className='flex items-center gap-3'>
                        <img className='w-10 h-10 rounded-full' src={user.imageUrl} alt="admin-img" loading='lazy'/>
                        <span className='hidden md:block'>{user.username}</span>
                    </div> */}
                    
                    {/* <MoonIcon className='darkIcon w-5 cursor-pointer' onClick={changeMode}></MoonIcon> */}
                    <SunIcon className='lightIcon hidden w-5 cursor-pointer' onClick={changeMode}></SunIcon>
                    <a href={"/notifications"}>
                        <BellIcon className='w-5 '></BellIcon>
                    </a>
                    <Bars3Icon className='w-[1.5rem] block md:hidden' onClick={handleClick}></Bars3Icon>
                    <div className='hidden md:flex items-center gap-3'>
                        <PowerIcon className='w-5 cursor-pointer' onClick={handleLogout}></PowerIcon>
                    </div>
                </div>

            </div>
        </>
    )
}