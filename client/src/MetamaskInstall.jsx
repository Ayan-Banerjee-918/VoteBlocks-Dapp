import React from 'react'
import { useState } from 'react'
import MetamaskLogo from './Components/MetamaskLogo'
import './logo.css'

const MetamaskInstall = () => {
    const disF="Install Metamask"
    const disC="Refresh once Installed"
    const [chk,setChk]=useState(false)

    return (
        <div className='flex flex-col bg-gradient-to-r from-teal-900 via-cyan-900 to-slate-900 w-full hscreen justify-center items-center'>
            <div>
                <h1 className='text-3xl font-bold text-center text-cyan-100 '>Oops! Seems like you do not have Metamask installed!</h1>
                <div className='flex flex-col justify-center items-center p-8'><MetamaskLogo/></div>
                <div className='flex flex-col justify-center items-center p-8'>
                    {!chk?
                        <a href='https://metamask.io/download/' target="_blank" rel="noopener noreferrer" className='bg-indigo-600 font-bold text-xl rounded-lg w-fit p-4 shadow-md shadow-slate-900' onClick={()=>setChk(true)}>
                            {disF}
                        </a>:
                        <h1 className='bg-green-600 font-bold text-xl rounded-lg w-fit p-4 shadow-md shadow-slate-900'>{disC}</h1>
                    }
                </div>
            </div>
        </div>
    )
}

export default MetamaskInstall