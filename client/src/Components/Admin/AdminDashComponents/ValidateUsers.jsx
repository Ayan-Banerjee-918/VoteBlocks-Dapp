import React from 'react'
import {useState,useEffect} from 'react'
import UserABI from '../../../../../smart_contract/build/contracts/Voters.json'
import { ContractAddress } from '../../../config.js'
import {ethers} from 'ethers'
import List from './utilities/List'
import { Oval } from 'react-loader-spinner'

const Loader=()=>{
  return(
    <div className='flex flex-col items-center justify-center'>
      <Oval
      height={25}
      width={25}
      color="green"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
      ariaLabel='oval-loading'
      secondaryColor="lime"
      strokeWidth={2}
      strokeWidthSecondary={2}
      />
    </div>
  )
}

const Child=(props)=>{
  return (
    <>
      {props.list.map(item=>(
              <List name={item.name} aadhar={item.aadhar} email={item.email} flag={item.isValidated} id={item.id} cid={item.cid} func={props.func} key={item.id}/>
            ))}
    </>
  );
} 

const ValidateUsers = () => {
  const [data,setData]=useState([])
  const [chk,setChk]=useState(0)
  const [flg,setFlg]=useState(0)

  useEffect(()=>{
    let e = async() => {await getUserList()}
    e().then(()=>{
      console.log("Data retrieved")
      setChk(1)
    }
    )
  },[flg])

  const changeStatus=()=>{
    setFlg(previousflg=>previousflg+1)
  }

  const getUserList = async () => {
    try{
        if(window.ethereum){
            const provider=new ethers.providers.Web3Provider(ethereum)
            const signer=provider.getSigner()
            const UserContract=new ethers.Contract(
                ContractAddress,
                UserABI.abi,
                signer
            )          
            let users= await UserContract.getUserList()
            setData(users)
        }
        else{
            console.log("Ethereum object does not exist!")
        }
    }catch(error){
        console.log(error)
    }
  }

  return (
      <section className="mt-10 gap-8">
        <h1 className="text-2xl font-bold mb-8">Unvalidated Registered Users</h1>
        <div className="min-w-[420px] pl-4 pr-4 flex flex-col">
            <div className="grid grid-cols-5 items-center justify-items-center gap-4 mb-4">
              <div className="col-span-1 flex items-center gap-4">
                <span className="py-1 px-3 rounded-full font-bold">Name</span>
              </div>
              <div>
                <span className="py-1 px-3 rounded-full font-bold">Aadhar</span>
              </div>
              <div>
                <span className="py-1 px-3 rounded-full font-bold">Email</span>
              </div>
              <div>
                <span className="py-1 px-3 rounded-full font-bold">PhotoID</span>
              </div>
              <div>
                <span className="py-1 pr-3 rounded-full font-bold">Verification Status</span>
              </div>
              </div>
            </div>
          {chk?<Child list={data} func={changeStatus}/>:<Loader/> }
      </section>
  )
}

export default ValidateUsers