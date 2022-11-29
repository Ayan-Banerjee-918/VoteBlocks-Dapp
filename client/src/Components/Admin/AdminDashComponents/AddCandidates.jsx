import React from 'react'
import {useForm} from "react-hook-form"
import {useState,useEffect} from 'react'
import UserABI from '../../../../../smart_contract/build/contracts/Voters.json'
import { ContractAddress } from '../../../config.js'
import {ethers} from 'ethers'
import DropDown from './utilities/DropDown'

const Child=(props)=>{
  return (
    <>
    <DropDown data={props.dat} onSelect={props.func}/>
    </>
  );
} 

const AddCandidates = () => {
  const [electionData,setData]=useState([])
  const [chk,setChk]=useState(0)
  const [selected,setSelected]=useState([])
  const [flg,setFlg]=useState(false)
  const [candidateName,setName]=useState("")
  const [candidateRegNo,setRegNo]=useState(0)

  const handleCallback = (childData) =>{
    setFlg(false)
    reset()
    setSelected(childData)
  }

  const onSubmit = async () => {
    await addCandidate().then(()=>{reset()})
  }

  const {register,handleSubmit,reset,formState:{errors,isValid}}= useForm({
    mode: "all"
  }
  )

  useEffect(()=>{
    let e = async() => {await getElectionList()}
      e().then(()=>{
        console.log("Election data retrieved")
        setChk(1)
      })
  },[])

  const selectCandidate=()=>{
    setFlg(true)
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
            await UserContract.getElectionList().then((election)=>{
              setData(election)
            })
        }
        else{
            console.log("Ethereum object does not exist!")
        }
    }catch(error){
        console.log(error)
    }
    }

    const addCandidate = async () => {
      if(selected.length!=0){
        try{
          if(window.ethereum){
              const provider=new ethers.providers.Web3Provider(ethereum)
              const signer=provider.getSigner()
              const UserContract=new ethers.Contract(
                  ContractAddress,
                  UserABI.abi,
                  signer
              )          
              await UserContract.addCandidate(candidateName,candidateRegNo,selected.id.toNumber()).then((log)=>{
                provider.waitForTransaction(log.hash,1).then((receipt)=>{
                  if(receipt){
                    if(receipt.status==1)
                      alert("Candidate added successfully")
                  }
                })
              })
          }
          else{
              console.log("Ethereum object does not exist!")
          }
      }catch(error){
          error=error.data.message.toString()
          console.log(error)
          if (error.indexOf('revert') > -1) {
            error = error.replace(/^.*revert/, '')
            alert("Candidate "+error) 
          }
      }
      }
      }

  return (
    <div>
    <section className="mt-6 gap-8">
        <h1 className="text-2xl font-bold mb-6">Add Candidates</h1>
        <div className='w-full mx-auto rounded-lg bg-cyan-900 p-8 px-8'>
                <div className='flex flex-col text-[#e4d7ff] py-2'>
                <div className='grid items-center grid-cols-4 gap-4'>
                    <label className='grid justify-items-center font-bold text-xl text-white'>Select Election</label>
                    <div className='col-span-2' key="9087">    
                    <div>{chk && <Child dat={electionData} func={handleCallback}/>}</div>
                    </div>
                    <div>
                    <button id='wallet-id' className='w-full p-2 bg-teal-500 shadow-lg shadow-teal-500/50 hover:shadow-teal-500/40 text-white font-semibold rounded-lg' onClick={selectCandidate}>Select</button>
                    </div>
                </div>
                </div>
            </div>
    </section>
    <section className='mt-6 gap-8'>
        <h1 className="text-2xl font-bold mb-6">Candidate Details</h1>
        {flg?<>
          <form id='form' onSubmit={handleSubmit(onSubmit)} className='w-full mx-auto rounded-lg bg-gradient-to-r from-cyan-900 to-purple-900 p-8 px-8'>
                <div className='p-4 grid grid-rows-4 grid-cols-2 items-center text-[#e4d7ff] py-2'>
                    <label className='font-bold text-xl text-white'>Candidate Name</label>  
                    <input className='rounded-lg w-full bg-gray-800 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none' type="text" {...register("candidateName", { required: true, setValueAs:"" })} onChange={(e)=>setName(e.target.value)}/>
                    <h1 className='col-end-3 col-span-1 text-red-500 font-bold'>{errors.candidateName?.type === "required" && "Candidate Name is required"}</h1>
                    <label className='font-bold text-xl text-white'>Candidate Registration Number</label>  
                    <input className='rounded-lg w-full bg-gray-800 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none' type="number" onKeyDown={ (evt) => (evt.key==='e' || evt.key==='.') && evt.preventDefault() } {...register("candidateRegNo", { required: true,minLength: 6, maxLength:6, setValueAs: "" })} onChange={(e)=>setRegNo(e.target.value)}/>
                    <h1 className='col-end-3 col-span-1 text-red-500 font-bold'>
                      {errors.candidateRegNo?.type === "required" && "Candidate Registration Number is required"}
                      {errors.candidateRegNo?.type === "minLength" && "Registration Number can't be less than 6 digits"}
                      {errors.candidateRegNo?.type === "maxLength" && "Registration Number can't be more than 6 digits"}
                    </h1>
                    <button className='col-span-2 justify-items-center items-center mt-2 p-2 bg-teal-500 shadow-lg shadow-teal-500/50 hover:shadow-teal-500/40 text-white font-semibold rounded-lg'>Add</button>
                </div>                
            </form> </>:console.log("No Election Selected") 
          } 
    </section>
    </div>
  )
}

export default AddCandidates