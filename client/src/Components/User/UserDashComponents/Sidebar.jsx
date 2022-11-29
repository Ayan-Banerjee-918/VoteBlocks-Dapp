import React, { useState,useEffect } from 'react';
import userPic from '../../../assets/userPic.png'  
import { Link,useNavigate } from 'react-router-dom';
import AuthConsumer from '../../../auth/useAuth';

import {
    RiHomeLine,
    RiUser3Line,
    RiPieChartLine,
    RiCloseLine,
    RiLogoutBoxLine
} from "react-icons/ri";

import {
    MdHowToVote, MdMenuOpen,
} from "react-icons/md"

import {
    FaUserSecret,
    FaVoteYea
} from "react-icons/fa"

import{
    FiUsers
} from "react-icons/fi"

const Sidebar = (props) => {

    const [showMenu, setShowMenu] = useState(false)
    const {user,logoutUser}=AuthConsumer()
    const navigate=useNavigate()

    const signout=()=>{
        logoutUser().then(()=>{
            navigate('../login')
            alert("Logged Out!")
        })
    }

  return (
    <>
        <div
            className = {
                ` bg-gradient-to-l from-gray-900 to-black h-full fixed lg:static w-[80%] md:w-[60%] lg:w-full transition-all z-50 duration-300
                ${showMenu ? "left-0" : "-left-full"}`
            }
        >
            <div className = "flex flex-col items-center justify-center p-8 gap-4 h-[30vh]">

                <img
                    src={userPic}
                    alt="profile picture"
                    className="w-20 h-20 object-cover rounded-full ring-2 ring-gray-300"
                />

                <h1 className="text-xl uppercase text-white font-bold">
                    {props.name}
                </h1>
                <div className="md:hidden bg-[#2a565ba8] text-white rounded-2xl p-1">
                    <h1 className="text-green-400 text-sm font-bold " >{props.address}</h1>
                </div>
            </div>

            <div className = " bg-gradient-to-l from-cyan-900 to-slate-900 p-8 pt-9 rounded-tr-[100px] h-[70vh] flex flex-col justify-between gap-10">
                {user.isValidated==true?
                <nav className="flex flex-col gap-7">

                    <Link to="./userDashboard" className="flex items-center gap-4 text-white py-2 px-4 rounded-2xl hover:bg-primary-900/50 transition-colors">
                        <RiHomeLine /> Dashboard
                    </Link>

                    <Link to="./voteCast" className="flex items-center gap-4 text-white py-2 px-4 rounded-2xl hover:bg-primary-900/50 transition-colors">
                        <MdHowToVote /> Cast Vote
                    </Link>

                    <Link to="./viewHistory" className="flex items-center gap-4 text-white py-2 px-4 rounded-2xl hover:bg-primary-900/50 transition-colors">
                        <FaVoteYea /> Participation History
                    </Link>

                    <Link to="./viewResults" className="flex items-center gap-4 text-white py-2 px-4 rounded-2xl hover:bg-primary-900/50 transition-colors">
                        <RiPieChartLine /> View Results
                    </Link>

                    <button className="flex items-center gap-4 text-white py-2 px-4 rounded-2xl hover:bg-primary-900/50 transition-colors" onClick={signout}>
                        <RiLogoutBoxLine /> Logout
                    </button>
                </nav>:
                    <nav className="flex flex-col gap-7">

                    <div className="flex items-center gap-4 text-gray-500 py-2 px-4 rounded-2xl">
                        <RiHomeLine /> Dashboard
                    </div>

                    <div className="flex items-center gap-4 text-gray-500 py-2 px-4 rounded-2xl">
                        <MdHowToVote /> Cast Vote
                    </div>

                    <div className="flex items-center gap-4 text-gray-500 py-2 px-4 rounded-2xl">
                        <FaVoteYea /> Participation History
                    </div>

                    <div className="flex items-center gap-4 text-gray-500 py-2 px-4 rounded-2xl">
                        <RiPieChartLine /> View Results
                    </div>

                    <button className="flex items-center gap-4 text-white py-2 px-4 rounded-2xl hover:bg-primary-900/50 transition-colors" onClick={signout}>
                        <RiLogoutBoxLine /> Logout
                    </button>
                </nav>
                }

            </div>

        </div>

        <button onClick={() => setShowMenu(!showMenu)}
                className = "lg:hidden fixed right-4 bottom-4 text-2xl bg-primary-900 p-2.5 rounded-full text-white z-50">

            {showMenu ? <RiCloseLine /> : <MdMenuOpen />}

        </button>
    </>
  )
}

export default Sidebar;