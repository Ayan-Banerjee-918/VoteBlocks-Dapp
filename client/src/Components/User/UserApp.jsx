import {React,useEffect,useState} from 'react'
import { Routes,Route } from 'react-router-dom'
import UserDashboard from './UserDashComponents/UserDashboard'
import { NotFound } from '../NotFound'
import { UserLayout } from './UserLayout'
import ParticipationHistory from './UserDashComponents/ParticipationHistory'
import VoteCast from './UserDashComponents/VoteCast'
import {ethers} from 'ethers'
import { useNavigate } from 'react-router-dom'
import AuthConsumer from "../../auth/useAuth"
import UserValidateAuth from '../../auth/UserValidateAuth'
import Unverified from './UserDashComponents/Unverified'
import Results from './UserDashComponents/Results'
import UserLoginAuth from '../../auth/UserLoginAuth'

const UserApp = () => {

  const navigate=useNavigate();
  const {user,userAddress,logoutUser}=AuthConsumer()
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if(userAddress!=="" && userAddress!==accounts[0]){
          logoutUser().then(()=>{
              navigate('../login')
          })
        }
      })
    }
  })

  return(
  <>
  <Routes>
    <Route element={<UserLoginAuth/>}>
      <Route element={<UserLayout/>}>
        <Route element={<UserValidateAuth/>}>
          <Route exact path='/' element={<UserDashboard/>}/>
          <Route exact path='/UserDashboard' element={<UserDashboard/>}/>
          <Route exact path='/VoteCast' element={<VoteCast/>}/>
          <Route exact path='/viewHistory' element={<ParticipationHistory/>}/>
          <Route exact path='/viewResults' element={<Results/>}/>
        </Route>
        {!user.isValidated && <Route exact path='/unverified' element={<Unverified/>}/>}
      </Route>
    </Route>
    <Route path='*' element={<NotFound/>}/>
  </Routes>
  </>
  )
}

export default UserApp