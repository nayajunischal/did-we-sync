import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SideBar from '../components/core/sidebar';

export default function HomePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    useEffect(() => {
        const getUserInfo = async () => {
            const response = await fetch('https://did-we-sync-dev-157e15cae3f9.herokuapp.com/user', {
                credentials: 'include',
                headers: {
                    "Access-Control-Allow-Origin": "*",
                }
            })
            if (response.status === 500) {
                navigate('/auth/login');
            }
            const data = await response.json();
            const user = data.user;
            if (user) {
                setUser(user.name)
            }
        }
        getUserInfo();
    }, [])
    return user ? (
        <div className='flex w-screen h-screen'>
            <div className='flex-none grow-0 w-56 bg-[rgb(0,161,224)] h-screen '>
                <SideBar username={user} />
            </div>
            <div className='flex-1'>
                <Outlet />
            </div>
        </div>
    ) : (
        <div className="flex h-screen w-screen justify-center items-center gap-12 flex-col">
            <div>
                <h1 className="text-2xl text-[rgb(0,161,224)] font-medium">Loading...</h1>
            </div>
        </div>
    );
}