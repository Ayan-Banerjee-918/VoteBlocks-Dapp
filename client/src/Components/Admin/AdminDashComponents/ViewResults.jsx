import { React, useState, useEffect, Fragment } from 'react'
import AuthConsumer from '../../../auth/useAuth'
import UserABI from '../../../../../smart_contract/build/contracts/Voters.json'
import { ContractAddress } from '../../../config.js'
import {ethers} from 'ethers'

const Child3=(props)=>{
  const handleClick=(item)=>{
      if(item===props.selected)
          props.setSelected(null)
      else
          props.setSelected(item)
  }

  return(
      <>
          {props.data.map((item)=>
              <div key={item.id} className="relative py-2">
              <input type="radio" name="candidate" id={item.id} className="peer hidden" checked={props.selected!=null && props.selected.name===item.name} onChange={()=>handleClick(item)} onClick={()=>handleClick(item)}/>
              <label htmlFor={item.id} className="flex cursor-pointer items-center gap-4 rounded-xl bg-indigo-100 bg-opacity-90 p-4 shadow-xl backdrop-blur-2xl transition border-2 border-current hover:bg-opacity-75 peer-checked:bg-gradient-to-r from-slate-900 to-sky-900 peer-checked:border-cyan-400 peer-checked:text-white">
                  <div>
                  <h6 className="text-base font-bold">{item.name}</h6>
                  <span className="text-sm opacity-80">Votes Received: {item.voteCount.toNumber()}</span>
                  </div>
              </label>
              <div className="flex absolute top-0 right-4 bottom-0 w-7 h-7 my-auto rounded-full bg-gray-700 scale-100 peer-checked:bg-sky-500 transition delay-100">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5 text-white my-auto mx-auto" viewBox="0 0 16 16">
                  <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
                  </svg>
              </div>
              </div>
          )}
      </>
  )
}

const ResolveTie=(props)=>{
  const [selected,setSelected]=useState(null)
  const handleClick = (e,func) => {
      e.preventDefault();
      if (e.target === e.currentTarget) {
          func(false);
      }
  }
  const handleClose=()=>{
      props.setTieFlg(false);
  }
  const setWinner=async (id,data)=>{
    try{
      if(window.ethereum){
          const provider=new ethers.providers.Web3Provider(ethereum)
          const signer=provider.getSigner()
          const UserContract=new ethers.Contract(
              ContractAddress,
              UserABI.abi,
              signer
          )
          await UserContract.setTieWinner(id,data).then((log)=>{
            provider.waitForTransaction(log.hash,1).then((receipt)=>{
                if(receipt){
                    if(receipt.status==1){
                        alert("Tie Resolved successfully")
                        handleClose()
                        props.setFlg(prevFlg=>prevFlg+1)
                    }
                }
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

  return(
    <>
        {props.tieFlg?(
            <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none backdrop-blur-md" onClick={(e)=>handleClick(e,props.setTieFlg)}>
                <div className="relative w-full my-6 mx-auto max-w-3xl px-7">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-gradient-to-r from-[#1e204b] to-[#1c0639] outline-none focus:outline-none">
                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                        <div className=" mr-10">
                            <h3 className="text-3xl font-semibold text-white">Resolve Ties</h3>
                        </div>
                    <button className="p-1 ml-auto bg-transparent border-0 text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none" onClick={()=>handleClose()}>
                        <span className="bg-transparent text-white h-6 w-6 text-2xl block outline-none focus:outline-none">X</span>
                    </button>
                    </div>
                    <div className=" px-6 flex-auto" onClick={(e)=>e.stopPropagation()}>
                        <Child3 data={props.data} setSelected={setSelected} selected={selected}/>
                    </div>
                    <div className="flex items-center justify-center p-2 border-t border-solid border-slate-200 rounded-b">
                    {selected!=null?<button className="bg-teal-500 rounded-xl p-2 text-slate-800 font-bold text-xl shadow-md shadow-gray-900 " onClick={()=>setWinner(props.id,selected)}>Confirm Winner Selection</button>:
                    <h1 className="bg-slate-500 rounded-xl p-2 text-gray-400 font-bold text-xl shadow-md shadow-gray-900 ">Choose a candidate</h1>}
                    </div>
                </div>
                </div>
            </div>
            </>
        ):null}
        </>
  )
}

const Child2=(props)=>{
  const [winner,setWinner]=useState(null)
  const [dat,setDat]=useState([])
  const [flg,setFlg]=useState(0)
  const [tieFlg,setTieFlg]=useState(false)
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

  const findWinner=async(id)=>{
    try{
      if(window.ethereum){
          const provider=new ethers.providers.Web3Provider(ethereum)
          const signer=provider.getSigner()
          const UserContract=new ethers.Contract(
              ContractAddress,
              UserABI.abi,
              signer
          )
          await UserContract.findWinner(id).then(async (data)=>{
            const res=await data.wait();
            const resData=res.events[0].args[0];
            setDat(resData)
            if(resData.length>1){
              alert("There has been a tie! Resolve it by choosing a winner!")
              setTieFlg(true)
            }
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
    <>
    {
      tieFlg && <ResolveTie id={props.id} data={dat} tieFlg={tieFlg} setTieFlg={setTieFlg} setFlg={setFlg}/>
    }
    {flg && winner=="null"?
      <>
      <div className="flex flex-col items-center justify-center">
        <button className="font-bold text-xl w-fit text-center bg-red-800 text-red-100 rounded-lg py-2 px-4" onClick={()=>findWinner(props.id)}>Set Winner</button>
      </div>
      </>:
      <div className="grid grid-cols-2 items-center justify-items-center">
        {winner!="No Winner"?<>
          <h1 className="font-bold text-xl text-white rounded-lg py-2 px-4">Winner : </h1>
          <h1 className="font-bold text-xl text-emerald-500 rounded-lg py-2 pr-4">{winner}</h1></>
        :<h1 className="col-span-2 font-bold text-xl text-emerald-500 rounded-lg py-2 pr-4">{winner}</h1>}
      </div>
    }
    </>
  )
}

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
                    <span className="text-blue-100 font-bold text-md">{item.name}</span>
                    <span className="text-blue-100 font-bold text-md text-center">{item.regNo.toNumber()}</span>
                    <span className="text-blue-100 font-bold text-md text-center">{item.voteCount.toNumber()}</span>
                </>
            }
            </Fragment>
        ))}
        </div>
    )
}

const Child = (props) => {
    return(
        <div className='grid gap-5 md:grid-cols-2 xl:grid-cols-3'>
                    {
                        props.elections.map((item,index)=>(
                            <Fragment key={index}>
                            {item.totalVote>0?
                                <div className="bg-gradient-to-l from-slate-900 to-slate-800 border-2 border-gray-900 p-6 rounded-3xl gap-6 h-full flex flex-col justify-between">
                                    <span className="text-cyan-200 font-bold text-2xl flex flex-col items-center justify-center">{item.name}</span>
                                    <span className="text-blue-100 font-bold text-xl">Total Votes: {item.totalVote.toNumber()}</span>
                                    <div className="bg-gradient-to-l from-black via-gray-900 border-2 border-gray-900 p-4 rounded-3xl flex flex-col h-[30vh]">    
                                        <Child1 id={item.id}/>
                                    </div>
                                    {item.isActive==true?<span className="font-bold text-xl text-center text-green-400">Voting in Progress</span>:
                                      <Child2 id={item.id} />
                                    }
                                </div>:null}
                            </Fragment>
                        ))
                    }
                </div>
    )
}

const ViewResults = () => {

    const {user}=AuthConsumer()
    const [elections,setElections]=useState([])
    const [flag,setFlg]=useState(false)

    useEffect(()=>{
        getUserElections()
    },[])

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
              await UserContract.getElectionList().then((data)=>{
                setElections(data)
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
        <h1 className="text-2xl font-bold mb-6">Poll Results</h1>
        {flag?<div className='mt-4 rounded-3xl p-8 bg-white shadow-2xl overflow-y-auto scrollbar h-[70vh]'>
            <Child elections={elections}/>
        </div>:null}
    </div>
  )
}

export default ViewResults