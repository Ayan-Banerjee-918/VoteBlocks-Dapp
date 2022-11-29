import React from 'react'
import {Dna,ThreeDots} from 'react-loader-spinner'

const Loading = () => {
  return (
    <div className='flex flex-col items-center justify-center hscreen bg-gradient-to-r from-slate-900 via-[#12211c] to-[#15013d]'>
        <Dna
            visible={true}
            height="100"
            width="100"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
        />
        <h1 className='text-2xl font-bold text-white' >Loading</h1>
        <ThreeDots 
            height="30" 
            width="30" 
            radius="2"
            color="#56a0f5" 
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClassName=""
            visible={true}
        />
    </div>
  )
}

export default Loading