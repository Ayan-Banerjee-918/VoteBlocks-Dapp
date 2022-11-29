import { Home,Register,Login,Help } from './Components'
import { NotFound } from './Components/NotFound'
import { Routes,Route } from 'react-router-dom'
import { Layout } from './Components/Layout'
import AdminApp from './Components/Admin/AdminApp'
import UserApp from './Components/User/UserApp'
import detectEthereumProvider from '@metamask/detect-provider'
import { useState,useEffect } from 'react'
import MetamaskInstall from './MetamaskInstall'
import Loading from './Components/Loading'
import AuthConsumer from './auth/useAuth'
import UserABI from '../../smart_contract/build/contracts/Voters.json'
import { ContractAddress } from "./config.js"
import {ethers} from 'ethers'

const App = () => {
  const [flg,setFlg]=useState(true)
  const [loading,setLoading]=useState(true)
  const [user,setUser]=useState(null)
  const {role,setRole}=AuthConsumer()

  useEffect(()=>{
    checkProvider()
  },[])

  useEffect(()=>{
    getRole()
  },[user])

  const getRole=async ()=>{
    try{
        if(window.ethereum){
            const provider=new ethers.providers.Web3Provider(ethereum)
            const signer=provider.getSigner()
            const UserContract=new ethers.Contract(
                ContractAddress,
                UserABI.abi,
                signer
            )          
            await UserContract.getUserDetails().then(async (dat)=>{
                setUser(dat)
                user!=null && await UserContract.getUserRole(user.id).then((res)=>{
                    setRole(res)
                })
            })
        }
        else{
            console.log("Ethereum object does not exist!")
        }
    }catch(error){
        console.log(error)
    }
  }



  const checkProvider=async ()=>{
    const provider = await detectEthereumProvider()
    if (provider) {
      console.log('Ethereum successfully detected!')
      setFlg(true)
    } else {
      setFlg(false)
      console.error('Please install MetaMask!')
    }
    setLoading(false)
  }

  return (
    <>
    {loading?
      <Routes>
        <Route path='/' element={<Loading/>}/>
      </Routes>
    :flg?
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route index element={<Home/>}/>
          <Route exact path='/Register' element={<Register/>}/>
          <Route exact path='/Login' element={<Login/>}/>
          <Route exact path='/Help' element={<Help/>}/>
        </Route>
        <Route path='/UserApp/*' element={<UserApp/>}/>
        {role && <Route path='/AdminApp/*' element={<AdminApp/>}/>}
        <Route path='*' element={<NotFound/>}/>
      </Routes>:
      <Routes>
          <Route path='/' element={<MetamaskInstall/>}/>
      </Routes>
    }
    </>
  )
}

export default App
