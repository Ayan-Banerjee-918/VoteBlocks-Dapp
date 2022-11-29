import AdminDashboard from './AdminDashComponents/AdminDashboard'
import Header from './AdminDashComponents/Header'
import Sidebar from './AdminDashComponents/Sidebar'
import ValidateUsers from './AdminDashComponents/ValidateUsers'
import AddCandidates from './AdminDashComponents/AddCandidates'
import AddElections from './AdminDashComponents/AddElections'
import ViewResults from './AdminDashComponents/ViewResults'
import ViewVoterList from './AdminDashComponents/ViewVoterList'
import AuditElections from './AdminDashComponents/AuditElections'
import AdminLogin from './AdminDashComponents/AdminLogin'
import AdminLoginAuth from '../../auth/AdminLoginAuth'
import AuthConsumer from '../../auth/useAuth'
import { Routes,Route,useNavigate } from 'react-router-dom'
import {ethers} from 'ethers'
import { useEffect } from "react"
import { Layout } from '../Layout'
import { AdminLayout } from './AdminLayout'
import { NotFound } from '../NotFound'

const AdminApp = () => {
    const navigate=useNavigate();
    const {adminAddress,logoutAdmin}=AuthConsumer();
    const handleChange=(accounts)=>{
      if(adminAddress!=="" && adminAddress!==accounts[0]){
        logoutAdmin().then(()=>{
            alert("Logged Out!")
            navigate('/')
        })
      }
    }

    const checkChange=()=>{
      if (window.ethereum) {
        window.ethereum.on("accountsChanged", handleChange)
      }
    }
    
    useEffect(() => {
      checkChange()
      return () => {
        window.ethereum.removeListener("accountsChanged",handleChange)
      }
    })

  return (
    <>
      <Routes>
        <Route element={<AdminLoginAuth/>}>
          <Route element={<AdminLayout/>}>
            <Route exact path='/' element={<AdminDashboard/>}/>
            <Route exact path='/AdminDashboard' element={<AdminDashboard/>}/>
            <Route exact path='/ValidateUsers' element={<ValidateUsers/>}/>
            <Route exact path='/ViewVoterList' element={<ViewVoterList/>}/>
            <Route exact path='/AddElections' element={<AddElections/>}/>
            <Route exact path='/AddCandidates' element={<AddCandidates/>}/>
            <Route exact path='/AuditElections' element={<AuditElections/>}/>
            <Route exact path='/ViewResults' element={<ViewResults/>}/>
          </Route>
        </Route>
        <Route element={<Layout/>}>
          <Route path='/adminLogin' element={<AdminLogin/>}/>
        </Route>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </>
  )
}

export default AdminApp
