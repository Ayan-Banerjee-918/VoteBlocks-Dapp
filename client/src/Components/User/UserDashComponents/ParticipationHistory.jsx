import { React, useState, useEffect } from 'react'
import AuthConsumer from '../../../auth/useAuth'
import UserABI from '../../../../../smart_contract/build/contracts/Voters.json'
import { ContractAddress } from '../../../config.js'
import {ethers} from 'ethers'

const Child=(props)=>{

    const convertTimestamp = timestamp => {
        var d = new Date(timestamp * 1000),
            yyyy = d.getFullYear(),
            mm = ('0' + (d.getMonth() + 1)).slice(-2),
            dd = ('0' + d.getDate()).slice(-2),        
            hh = d.getHours(),
            h = hh,
            min = ('0' + d.getMinutes()).slice(-2),
            ampm = 'AM',
            time;
    
        if (hh > 12) {
            h = hh - 12;
            ampm = 'PM';
        } else if (hh === 12) {
            h = 12;
            ampm = 'PM';
        } else if (hh == 0) {
            h = 12;
        }

        time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;
        return time;
    }

    return(
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
            {props.history.map((item,index)=>(
                <div key={index} className='bg-gray-800 border-2 rounded-xl p-4 justify-items-center items-center shadow-lg shadow-slate-900'>
                    <div>
                        <h1 className='text-teal-200 font-bold capitalize text-lg' style={{display:'inline'}}>Poll Name : </h1>
                        <h1 className='text-green-400 font-bold capitalize text-lg' style={{display:'inline'}}>{item.poll}</h1>
                    </div>
                    <div>
                        <h1 className='text-teal-200 font-bold capitalize text-lg' style={{display:'inline'}}>Voted Candidate : </h1>
                        <h1 className='text-green-400 font-bold capitalize text-lg' style={{display:'inline'}}>{item.candidate=="None of the Above"?"NOTA":item.candidate}</h1>
                    </div>
                    <div>
                        <h1 className='text-teal-200 font-bold capitalize text-lg' style={{display:'inline'}}>Vote Time : </h1>
                        <h1 className='text-green-400 font-bold capitalize text-lg' style={{display:'inline'}}>{convertTimestamp(item.time.toNumber())}</h1>
                    </div>
                </div>
            ))}
        </div>
    )
}

const ParticipationHistory = () => {

    const {user}=AuthConsumer()
    const [history,sethistory]=useState([])
    const [flg,setFlg]=useState(false)

    useEffect(()=>{
        getHistory()
    },[])

    const getHistory=async()=>{
        try{
            if(window.ethereum){
                const provider=new ethers.providers.Web3Provider(ethereum)
                const signer=provider.getSigner()
                const UserContract=new ethers.Contract(
                    ContractAddress,
                    UserABI.abi,
                    signer
                )
                await UserContract.getHistory(user.id.toNumber()).then((data)=>{
                    sethistory(data)
                    if(data.length!==0)
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
    <div className='mt-10 gap-8'>
        <h1 className="text-2xl font-bold mb-8 text-gray-300">User History</h1>
        <div className='flex flex-col w-full h-full p-4 bg-gradient-to-r from-[#273e4a] to-slate-900 rounded-lg'>
            <div>
                <h1 className='font-bold text-xl text-white' style={{display:'inline'}}>Poll Participation Count : </h1>
                <h1 className='font-bold text-xl text-green-400' style={{display:'inline'}}>{history.length}</h1>
            </div>
            {flg?
            <div className='p-4 mt-4 rounded-xl border-slate-900 shadow-slate-900 shadow-md border-2 bg-cyan-800 overflow-y-auto h-full'>
                <Child history={history}/>
            </div>:null}
        </div>
        {!flg?
        <div className='p-4'>
            <h1 className='font-bold text-lg text-white text-center'>No Records Found</h1>
        </div>:null}
    </div>
  )
}

export default ParticipationHistory