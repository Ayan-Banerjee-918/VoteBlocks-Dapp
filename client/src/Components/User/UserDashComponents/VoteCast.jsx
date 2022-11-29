import { React, useState, useEffect } from 'react'
import AuthConsumer from '../../../auth/useAuth'
import UserABI from '../../../../../smart_contract/build/contracts/Voters.json'
import { ContractAddress } from '../../../config.js'
import {ethers} from 'ethers'
import { Oval } from 'react-loader-spinner'

const Loader=()=>{
    return(
      <div className='flex flex-col items-center justify-center'>
        <Oval
        height={30}
        width={30}
        color="lime"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel='oval-loading'
        secondaryColor="green"
        strokeWidth={2}
        strokeWidthSecondary={2}
        />
      </div>
    )
  }

const Child=(props)=>{
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
                <label htmlFor={item.id} className="flex cursor-pointer items-center gap-4 rounded-xl bg-indigo-100 bg-opacity-90 p-4 shadow-xl backdrop-blur-2xl transition border-2 border-current hover:bg-opacity-75 peer-checked:bg-gradient-to-r from-slate-900 to-teal-900 peer-checked:border-cyan-400 peer-checked:text-white">
                    <div>
                    <h6 className="text-base font-bold">{item.name}</h6>
                    {item.regNo!=0?<span className="text-sm opacity-80">Registration Number: {item.regNo.toNumber()}</span>:
                    <span className="text-sm opacity-80">Registration Number: NIL</span>}
                    </div>
                </label>
                <div className="flex absolute top-0 right-4 bottom-0 w-7 h-7 my-auto rounded-full bg-gray-700 scale-100 peer-checked:bg-green-700 transition delay-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5 text-white my-auto mx-auto" viewBox="0 0 16 16">
                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
                    </svg>
                </div>
                </div>
            )}
        </>
    )
}

const VotingModal=(props)=>{
    const [selected,setSelected]=useState(null)
    const [chk,setChk]=useState(false)
    const handleClick = (e,func) => {
        if(chk==false){
            e.preventDefault();
            if (e.target === e.currentTarget) {
                func(false);
                props.setElectionModalID(0);
            }
        }
    }
    const handleClose=()=>{
        if(chk==false){
            props.setElectionModalID(0);
            props.setShowModal(false);
        }
    }
    const castUserVote=async(userID,electionID,candidateID)=>{
        setChk(true)
        try{
            if(window.ethereum){
                const provider=new ethers.providers.Web3Provider(ethereum)
                const signer=provider.getSigner()
                const UserContract=new ethers.Contract(
                    ContractAddress,
                    UserABI.abi,
                    signer
                )
                await UserContract.castVote(userID,electionID,candidateID).then((log)=>{
                    provider.waitForTransaction(log.hash,1).then((receipt)=>{
                        if(receipt){
                            setChk(false)
                            if(receipt.status==1){
                                alert("Voted successfully")
                                handleClose()
                            }
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
            alert(error) 
            handleClose()
          }
        }
    }
    return(
        <>
        {props.showModal?(
            <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none backdrop-blur-md" onClick={(e)=>handleClick(e,props.setShowModal)}>
                <div className="relative w-full my-6 mx-auto max-w-3xl px-7">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-gradient-to-r from-[#032632] to-[#171f20] outline-none focus:outline-none">
                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                        <div className=" mr-10">
                            <h3 className="text-3xl font-semibold text-white">Choose candidate</h3>
                        </div>
                    {!chk?<button className="p-1 ml-auto bg-transparent border-0 text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none" onClick={()=>handleClose()}>
                        <span className="bg-transparent text-white h-6 w-6 text-2xl block outline-none focus:outline-none">X</span>
                    </button>:null}
                    </div>
                    <div className=" px-6 flex-auto" onClick={(e)=>e.stopPropagation()}>
                        <Child data={props.data} setSelected={setSelected} selected={selected}/>
                    </div>
                    <div className="flex items-center justify-center p-2 border-t border-solid border-slate-200 rounded-b">
                    {!chk?selected!=null?<button className="bg-teal-500 rounded-xl p-2 text-slate-800 font-bold text-xl shadow-md shadow-gray-900 " onClick={()=>castUserVote(props.userID.toNumber(),props.electionID.toNumber(),selected.id.toNumber())}>Confirm Selection</button>:
                    <h1 className="bg-slate-500 rounded-xl p-2 text-gray-400 font-bold text-xl shadow-md shadow-gray-900 ">Select one of the candidates</h1>:<Loader/>}
                    </div>
                </div>
                </div>
            </div>
            </>
        ):null}
        </>
    )
}

const VoteCast = () => {
    const {user}=AuthConsumer()
    const [elections,setElections]=useState([])
    const [candidates,setCandidates]=useState([])
    const [flg,setFlg]=useState(false)
    const [buttonFlg,setButtonFlg]=useState([])
    const [electionModalID,setElectionModalID]=useState(0)
    const [showModal,setShowModal]=useState(false)

    useEffect(()=>{
        getUserElections()
        setFlg(true)
        checkVote()
    })

    const castVote=async (electionID)=>{
        await getMappedCandidates(electionID).then(()=>{
            setElectionModalID(electionID)
            setShowModal(true)
        })
    }

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
                })
              }
            else{
                console.log("Ethereum object does not exist!")
            }
        }catch(error){
            console.log(error)
        }
    }

    const checkVote=async()=>{
        try{
            if(window.ethereum){
                const provider=new ethers.providers.Web3Provider(ethereum)
                const signer=provider.getSigner()
                const UserContract=new ethers.Contract(
                    ContractAddress,
                    UserABI.abi,
                    signer
                )
                elections.map(async(item,index)=>{
                    await UserContract.checkVote(user.id,item.id.toNumber()).then((res)=>{
                        if(buttonFlg.length<elections.length)
                            setButtonFlg(buttonFlg=>[...buttonFlg,res])
                        else
                            buttonFlg[index]=res
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
              await UserContract.getMappedElections(user.id).then((data)=>{
                setElections(data)
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
        <div className="mt-10 gap-8">
            <h1 className="text-2xl font-bold mb-8 text-gray-300">Open Polls</h1>
            {flg && elections.length==0?
                <div className='flex flex-col justify-center items-center m-2'>
                    <h2 className="text-gray-300">No Polls Available</h2>
                </div>:
                <div className='grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
                    {
                        elections.map((item,index)=>(
                            <div key={item.id} className='rounded-3xl bg-gradient-to-r from-[#6EE7B7] via-[#3B82F6] to-[#9333EA] p-[3px] shadow-lg shadow-gray-700 h-60'>
                                <div className="bg-gradient-to-l from-slate-900 to-slate-800 p-6 rounded-3xl gap-6 h-full flex flex-col justify-between">
                                    <span className="text-cyan-200 font-bold text-2xl flex flex-col items-center justify-center">{item.name}</span>
                                    <span className="text-blue-100 font-bold text-xl">Total Votes: {item.totalVote.toNumber()}</span>
                                    <span className="text-blue-100 font-bold text-xl">Candidate Count: {item.candidateCount.toNumber()}</span>
                                    {!buttonFlg[index]?<button className="bg-red-500 rounded-xl p-1 text-slate-800 font-bold text-xl uppercase shadow-md shadow-gray-900" onClick={()=>castVote(item.id.toNumber())}>Vote</button>:
                                    <h1 className="bg-slate-500 rounded-xl p-1 text-gray-400 font-bold text-xl text-center uppercase shadow-md shadow-gray-900">Already Voted</h1>}  
                                    {showModal && electionModalID===item.id.toNumber()?<VotingModal showModal={showModal} setShowModal={setShowModal} setElectionModalID={setElectionModalID} data={candidates.slice().reverse()} electionID={item.id} userID={user.id}/>:null}
                                </div>
                            </div>
                        ))
                    }
                </div>
            }
        </div>
    )
}

export default VoteCast