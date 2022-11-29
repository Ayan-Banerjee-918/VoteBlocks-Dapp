import React from 'react'
import {useState,useEffect} from 'react'
import UserABI from '../../../../../smart_contract/build/contracts/Voters.json'
import { ContractAddress } from '../../../config.js'
import {ethers} from 'ethers'
import AuditList from './utilities/AuditList'
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
              <>{item.name!="" && <AuditList name={item.name} isActive={item.isActive} electionID={item.id} changeStatus={props.statChange} key={item.id}/>}</>
      ))}
    </>
  );
} 

const AuditElections = () => {
  const [data,setData]=useState([])
  const [chk,setChk]=useState(0)
  const [st,setSt]=useState(0)

  useEffect(()=>{
    let e = async() => {await getElectionList()}
    e().then(()=>{
      console.log("Election data retrieved")
      setChk(1)
    }
    )
  },[st])

  const statusChange=()=>{
    setSt(previousSt=>previousSt+1)
  }

  const getElectionList = async () => {
    try{
        if(window.ethereum){
            const provider=new ethers.providers.Web3Provider(ethereum)
            const signer=provider.getSigner()
            const UserContract=new ethers.Contract(
                ContractAddress,
                UserABI.abi,
                signer
            )          
            let elections=await UserContract.getElectionList()
            setData(elections)
        }
        else{
            console.log("Ethereum object does not exist!")
        }
    }catch(error){
        console.log(error)
    }
    }

  return (
    <section className='mt-10 gap-8'>
    <h1 className="text-2xl font-bold mb-8">Elections List</h1>
    <div className="min-w-[320px] pl-8 pr-8 gap-3 flex flex-col">
        <div className="grid  items-center justify-items-center grid-cols-8 gap-4 mb-4">
          <div className="col-span-2 flex items-center gap-4">
            <span className="py-1 px-3 rounded-full font-bold">Election Name</span>
          </div>
          <div className='col-span-2 flex items-center gap-4'>
            <span className="py-1 px-3 rounded-full font-bold">Status</span>
          </div>
          <div className='col-span-4 flex items-center gap-4'>
            <span className="py-1 px-3 rounded-full font-bold">Actions</span>
          </div>
          </div>
        </div>
    <div className="min-w-[320px] bg-white p-8 rounded-3xl shadow-2xl mb-8 gap-6 flex flex-col">
        {chk?<Child list={data} statChange={statusChange}/>:<Loader/>}
    </div>   
  </section>
  )
}

export default AuditElections