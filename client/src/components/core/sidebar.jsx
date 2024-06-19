import { LogOutIcon, Building2, Crown, Handshake } from "lucide-react";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";

export default function SideBar({ username }) {
    const navigate = useNavigate();
    const handleLogout = async () => {
        const response = await fetch('https://did-we-sync-dev-157e15cae3f9.herokuapp.com/logout', {
            credentials: 'include',
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        })
        if (response.status === 200) {
            navigate('/auth/login');
        }
    }

    return (
        <div className="flex h-screen max-w-full justify-center">
            <div className="flex flex-col">
                <div className="mt-1 flex items-center justify-center">
                    <Handshake className="h-20 w-20 text-white" />
                </div>
                <nav className="flex flex-col gap-2">
                    <Link
                        to="/"
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
                    >
                        <Building2 className="h-5 w-5" />
                        Accounts
                    </Link>
                    <Link
                        to="/opportunities"
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
                    >
                        <Crown className="h-5 w-5" />
                        Opportunities
                    </Link>
                </nav>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="w-full mt-auto mb-5 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50">
                    <LogOutIcon className="h-5 w-5" />
                    {username}
                </Button>
            </div>
        </div>
    )
}