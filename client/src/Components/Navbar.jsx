import {AiOutlineClose,AiOutlineMenu} from 'react-icons/ai'
import { useState,useEffect } from 'react'
import {Link} from 'react-router-dom'

const Navbar = () => {
    const [nav,setNav] = useState(false)
    const [visibility,setVisibility] = useState(true)
    const handleNav = () => {
        setNav(!nav)
    }
    return (
        <>
        {visibility?
        <div className="flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-white">
            <h1 className='w-full text-3xl font-bold text-[#00df9a]'><Link to="/">VoteBlocks</Link></h1>
            <ul className="hidden md:flex">
                <li className="p-4"><Link to="/">Home</Link></li>
                <li className="p-4"><Link to="/register">Register</Link></li>
                <li className="p-4"><Link to="/login">Login</Link></li>
                <li className="p-4"><Link to="/help">Help</Link></li>
            </ul>
            <div onClick={handleNav} className='block md:hidden'>
                {nav?<AiOutlineClose size={20}/>:<AiOutlineMenu size={20} />}
            </div>
            <div className={nav?'fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-900 backdrop-blur-md ease-in duration-500 block md:hidden':'fixed left-[-100%] top-0 w-[60%] h-full border-r border-r-gray-900 backdrop-blur-md ease-in duration-500'}>
                <ul className='uppercase text-lg font-semibold m-4 p-4'>
                    <li className="p-4 border-b-2 border-gray-600"><Link to="/">Home</Link></li>
                    <li className="p-4 border-b-2 border-gray-600"><Link to="/register">Register</Link></li>
                    <li className="p-4 border-b-2 border-gray-600"><Link to="/login">Login</Link></li>
                    <li className="p-4"><Link to="/help">Help</Link></li>
                </ul>
            </div>
        </div>
        :<></>}
        </> 
    )
}
  
export default Navbar