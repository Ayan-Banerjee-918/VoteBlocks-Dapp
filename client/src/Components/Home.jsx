import Typed from 'react-typed'
import { Link } from 'react-router-dom'
import React from 'react'

const Home = () => {
  return (
    <div className="flex items-center justify-center custom-img text-white">
        <div className="max-w-[800px] w-full h-screen mx-auto text-center flex flex-col justify-center">
            <p className="text-[#00df9a] font-bold p-2 text-lg">THE NEXT GENERATION OF E-VOTING</p>
            <h1 className="md:text-6xl sm:text-4xl font-bold md:py-6 text-[#35bab3]">WITH THE POWER OF BLOCKCHAIN</h1>
            <div className='flex justify-center items-center py-1.5'>
                <p className="md:text-5xl sm:text-4xl font-bold">Vote with</p>
                <Typed className='md:text-5xl sm:text-4xl text-xl font-bold pl-3 text-[#7040ff]'
                    strings={['Safety','Security','Anonymity','Transparency','Reliability']}
                    typeSpeed={100}
                    backSpeed={120}
                    loop={true}
                />
            </div>
            <button className='bg-gradient-to-r from-cyan-700 to-teal-300 w-[200px] rounded-xl font-bold my-6 mx-auto py-3 text-black'><Link to="/register">Get Started</Link></button>
        </div>
    </div>
  )
}

export default Home