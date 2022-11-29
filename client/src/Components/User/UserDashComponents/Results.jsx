import { React, useState, useEffect, Fragment } from 'react'
import AuthConsumer from '../../../auth/useAuth'
import UserABI from '../../../../../smart_contract/build/contracts/Voters.json'
import { ContractAddress } from '../../../config.js'
import {ethers} from 'ethers'

const Child1=(props)=>{
    const [candidates,setCandidates]=useState([])
    const [flg,setFlg]=useState(false)

    useEffect(()=>{
        getMappedCandidates(props.id)
    })

    const getMappedCandidates=async(id)=>{
        try{
            if(window.ethereum){
                const provider=new ethers.providers.Web3Provider(ethereum)
                const signer=provider.getSigner()
                const UserContract=new ethers.Contract(
                    ContractAddress,
                    UserABI.abi,
                    signer
                )
                await UserContract.getCandidates(id).then((data)=>{
                  setCandidates(data)
                  setFlg(true)
                })
              }
            else{
                console.log("Ethereum object does not exist!")
            }
        }catch(error){
            console.log(error)
        }
    }



    return(
        <div className='grid grid-cols-3 gap-4 overflow-y-auto scrollbar'>
        {flg && candidates.map((item,index)=>(
            <Fragment key={index}>
            {item.regNo!=0 && 
                <>
                    <span className="text-blue-100 font-bold text-xl">{item.name}</span>
                    <span className="text-blue-100 font-bold text-xl text-center">{item.regNo.toNumber()}</span>
                    <span className="text-blue-100 font-bold text-xl text-center">{item.voteCount.toNumber()}</span>
                </>
            }
            </Fragment>
        ))}
        </div>
    )
}

const ResChild = (props) => {
    const [winner,setWinner]=useState(null)
    const [flg,setFlg]=useState(0)
    
    useEffect(()=>{
       getWinner(props.id)
    },[flg])

    const getWinner=async(id)=>{
        try{
          if(window.ethereum){
              const provider=new ethers.providers.Web3Provider(ethereum)
              const signer=provider.getSigner()
              const UserContract=new ethers.Contract(
                  ContractAddress,
                  UserABI.abi,
                  signer
              )
              await UserContract.getWinner(id).then((data)=>{
                if(data.length==4){
                  if(data.name=="null"){
                    setWinner("null")
                  }
                  else{
                    setWinner(data.name)
                  }
                }
              })
              setFlg(prevFlg=>prevFlg+1)
            }
          else{
              console.log("Ethereum object does not exist!")
          }
        }catch(error){
            console.log(error)
        }
      }

    return(
        <>
        {flg && winner!=="null"?
        <div className="grid grid-cols-2 items-center justify-items-center">
            {winner!="No Winner"?<>
                <h1 className="font-bold text-xl text-white rounded-lg py-2 px-4">Winner : </h1>
                <h1 className="font-bold text-xl text-emerald-500 rounded-lg py-2 pr-4">{winner}</h1></>
            :<h1 className="col-span-2 font-bold text-xl text-emerald-500 rounded-lg py-2 pr-4">{winner}</h1>}
        </div>:
        <span className="font-bold text-xl text-center text-emerald-500">Winner to be declared soon!</span>}
        </>
    )
}

const Child = (props) => {
    return(
        <div className='grid gap-5 md:grid-cols-2 xl:grid-cols-3'>
                    {
                        props.elections.map((item,index)=>(
                            <Fragment key={index}>
                            {item.totalVote>0?
                                <div className="bg-gradient-to-l from-slate-900 to-slate-800 border-2 border-gray-900 p-5 rounded-3xl gap-6 h-full flex flex-col justify-between">
                                    <span className="text-cyan-200 font-bold text-2xl flex flex-col items-center justify-center">{item.name}</span>
                                    <span className="text-blue-100 font-bold text-xl">Total Votes: {item.totalVote.toNumber()}</span>
                                    <span className="text-blue-100 font-bold text-xl">Candidates</span>
                                    <div className="bg-gradient-to-l from-indigo-600 via-cyan-700 to-teal-800 border-2 border-gray-900 p-4 rounded-3xl flex flex-col h-[30vh]">    
                                        <Child1 id={item.id}/>
                                    </div>
                                    {item.isActive==true?<span className="font-bold text-xl text-center blink">Voting in Progress</span>:
                                        <ResChild id={item.id}/>
                                    }
                                </div>:null}
                            </Fragment>
                        ))
                    }
                </div>
    )
}

const Results = () => {

    const {user}=AuthConsumer()
    const [elections,setElections]=useState([])

    const [flag,setFlg]=useState(false)

    useEffect(()=>{
        getUserElections()
    })

    const getUserElections=async()=>{
        try{
          if(window.ethereum){
              const provider=new ethers.providers.Web3Provider(ethereum)
              const signer=provider.getSigner()
              const UserContract=new ethers.Contract(
                  ContractAddress,
                  UserABI.abi,
                  signer
              )
              await UserContract.getAllMappedElections(user.id).then((data)=>{
                setElections(data)
                if(data.length>0)
                    setFlg(true)
              })
            }
          else{
              console.log("Ethereum object does not exist!")
          }
      }catch(error){
          console.log(error)
      }
    }

  return (
    <div className='mt-8 gap-8'>
        <h1 className="text-2xl font-bold mb-6 text-gray-300">Poll Results</h1>
        {flag?<div className='p-4 mt-4 rounded-xl border-slate-900 shadow-slate-900 shadow-md border-2 bg-teal-800 overflow-y-auto scrollbar h-[70vh]'>
            <Child elections={elections}/>
        </div>:null}
    </div>
  )
}

export default Results