import React from 'react';

const Header = (props) => {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between gap-4">

        <h1 className="text-2xl md:text-3xl font-bold text-white">
            Hey, <span className=" capitalize text-cyan-500">{props.name}</span>
        </h1>
        <div className="hidden md:block bg-gray-800 text-white rounded-2xl py-2 px-2 md:auto">
            <h1 className="text-green-400 text-sm font-bold " >{props.address}</h1>
        </div>
    </header>
  )
}

export default Header