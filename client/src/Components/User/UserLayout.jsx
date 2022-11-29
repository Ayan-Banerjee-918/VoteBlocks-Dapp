import { Outlet } from "react-router-dom"
import Header from "./UserDashComponents/Header"
import Sidebar from "./UserDashComponents/Sidebar"
import AuthConsumer from "../../auth/useAuth"

export const UserLayout = () => {
    const {user,userAddress}=AuthConsumer()
    return (
        <div className="grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen"><Sidebar address={userAddress} name={user.name}/>
            <main className="lg:col-span-3 xl:col-span-5 bg-[#191b22] p-8 xl:p-12 h-[100vh] overflow-y-scroll"><Header address={userAddress} name={user.name}/>
                <Outlet/>
            </main>
        </div>
    )
}