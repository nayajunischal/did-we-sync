import { Button } from "../../components/ui/button";
import { Key } from 'lucide-react';

export default function LoginPage() {
    const handleLogin = async () => {
        const response = await fetch('https://did-we-sync-dev-157e15cae3f9.herokuapp.com/login', {
            credentials: 'include',
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        })
        const data = await response.json();
        window.open(data.authUri, '_self');
    }

    return (
        <div className="flex h-screen w-screen justify-center items-center gap-12 flex-col bg-[rgb(0,161,224)]">
            <div className="flex flex-col gap-3">
                <h1 className="text-4xl text-white font-medium">Did we sync?</h1>
                <h3 className="text-2xl font-thin text-white">Seamlessly synchronize, create, update, delete your Salesforce records</h3>
                <h5 className="text-1xl font-extralight text-white">-React, Node.js, Salesforce and Postgres (AWS RDS)</h5>
            </div>
            <Button variant="outline" onClick={handleLogin}>
                <Key className="mr-2 h-4 w-4" /> Login with Salesforce
            </Button>
        </div>
    )
}