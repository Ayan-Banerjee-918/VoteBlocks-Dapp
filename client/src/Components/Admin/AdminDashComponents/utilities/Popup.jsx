import {React} from "react";
import UserABI from '../../../../../../smart_contract/build/contracts/Voters.json'
import { ContractAddress } from '../../../../config.js'
import {ethers} from 'ethers'

const ShowList=(props)=>{
    const removeCandidate=async ()=>{
        try{
            if(window.ethereum){
                const provider=new ethers.providers.Web3Provider(ethereum)
                const signer=provider.getSigner()
                const UserContract=new ethers.Contract(
                    ContractAddress,
                    UserABI.abi,
                    signer
                )     
                await UserContract.mapCandidate(props.regNo.toNumber(),props.electionID.toNumber(),props.id.toNumber()).then(
                    (log)=>{
                        provider.waitForTransaction(log.hash,1).then((receipt)=>{
                          if(receipt){
                            if(receipt.status==1)
                              props.func()
                            else if(receipt.status==0)
                              console.log("Transaction Failed!");
                          }
                        })
                      }
                )
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
        <div className="my-4 text-blue-100 text-lg pb-2 leading-relaxed border-b-2">
            <h1>{props.data}</h1>
        </div>
        <div className="grid justify-items-end item-center my-4 text-blue-100 text-lg">
            <button className=" bg-red-900 rounded-md p-1" onClick={removeCandidate}>Remove</button>
        </div>
        </>
    )
}

const Child=(props)=>{
    return (
        <>
            {props.data.map(item=>(<ShowList data={item.name} regNo={item.regNo} id={item.id} electionID={props.electionID} func={props.func} key={item.id}/>))}
        </>
    )
}

const handleClick = (e,func) => {
    e.preventDefault();
    if (e.target === e.currentTarget) {
        func(false);
    }
}

const Popup=(props)=>{
  return (
    <>
      {props.showModal?(
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none backdrop-blur-md" onClick={(e)=>handleClick(e,props.setShowModal)}>
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-gradient-to-r from-[#00374a] to-[#51182d] outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <div className=" mr-10">
                        <h3 className="text-3xl font-semibold text-white">Candidates</h3>
                    </div>
                  <button className="p-1 ml-auto bg-transparent border-0 text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none" onClick={() => props.setShowModal(false)}>
                    <span className="bg-transparent text-white h-6 w-6 text-2xl block outline-none focus:outline-none">X</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 relative p-6 flex-auto">
                  <Child data={props.data} electionID={props.electionID} func={props.func}/>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ):null}
    </>
  )
}

export default Popup