import { ethers } from "ethers";
import React from "react"
const ElectionList = (props) => {  

  return (  
    <div>
      <div className="grid items-center justify-items-center sm:grid-cols-1 md:grid-cols-3 gap-4 mb-4 ">
      <div>
       <span className="bg-blue-100 text-cyan-800 py-1 px-3 rounded-full font-medium ">{props.name}</span>
      </div>
      <div>
        <span className="bg-blue-100 text-cyan-800 py-1 px-3 rounded-full font-medium flex items-center text-center">{props.totVote.toNumber()}</span>
      </div>
      <div>
        {props.isActive?<span className="ml-10 bg-green-100 text-green-800 py-1 px-3 rounded-full font-medium">Active</span>:<span className="ml-10 bg-red-100 text-red-800 py-1 px-3 rounded-full font-medium">Inactive</span>}
      </div>
      </div>
    </div>
  );
}

export default ElectionList;