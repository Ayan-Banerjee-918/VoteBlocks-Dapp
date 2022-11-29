import { Outlet } from "react-router-dom"
import Header from "./AdminDashComponents/Header"
import Sidebar from "./AdminDashComponents/Sidebar"
import AuthConsumer from "../../auth/useAuth"

export const AdminLayout = () => {
    const {admin,adminAddress}=AuthConsumer()
    return (
        <div className="grid lg:grid-cols-4 xl:grid-cols-6 min-h-screen"><Sidebar name={admin.name} address={adminAddress}/>
            <main className="lg:col-span-3 xl:col-span-5 bg-gray-100 p-8 xl:p-12 h-[100vh] overflow-y-scroll"><Header name={admin.name} address={adminAddress}/>
                <Outlet/>
            </main>
        </div>    
    )
}