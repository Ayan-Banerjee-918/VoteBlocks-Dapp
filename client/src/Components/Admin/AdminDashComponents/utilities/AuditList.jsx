import UserABI from '../../../../../../smart_contract/build/contracts/Voters.json'
import { ContractAddress } from '../../../../config.js'
import {ethers} from 'ethers'
import {React,useState,useEffect,useRef} from 'react'
import Popup from './Popup'
import UserPopup from './UserPopup'

const AuditList = (props) => {
    const [candidateList,setCandidateList]=useState([])
    const [unaddedUserList,setUUserList]=useState([])
    const [addedUserList, setAUserList]=useState([])
    const [showModal, setShowModal] = useState(false)
    const [showUserModal,setShowUserModal]=useState(false)
    const [flg,setFlg]=useState(0)
    const [flg1,setFlg1]=useState(0)

    const changeStatus=(func)=>{
        func()
    }

    const initialRender=useRef(true);
    const initialRender1=useRef(true);

    useEffect(()=>{
      if(initialRender.current){
        initialRender.current=false;
      }
      else{
      let e = async() => {await getCandidateList()}
      e().then(()=>{
        console.log("Candidate data retrieved")
      }
      )
    }},[flg])

    useEffect(()=>{
      if(initialRender1.current){
        initialRender1.current=false;
      }
      else{
      let e = async() => {await getUserList()}
      e().then(()=>{
        console.log("Unadded:"+unaddedUserList)
        console.log("Added:"+addedUserList)
        console.log("UserList retrieved")
      }
      )
    }},[flg1])

    const changeStat=()=>{
      setFlg(previousFlg=>previousFlg+1)
    }

    const changeStat1=()=>{
      console.log("State changing")
      setFlg1(previousFlg1=>previousFlg1+1)
    }

    const getUserList=async()=>{
      await userListHelper().then(()=>{setShowUserModal(true)})
    }

    const userListHelper=async()=>{
      await viewUnaddedUserList();
      await viewAddedUserList();
    }

    const viewUnaddedUserList=async()=>{
      try{
        if(window.ethereum){
            const provider=new ethers.providers.Web3Provider(ethereum)
            const signer=provider.getSigner()
            const UserContract=new ethers.Contract(
                ContractAddress,
                UserABI.abi,
                signer
            )     
            await UserContract.getUnaddedUserToElection(props.electionID).then((list)=>{
              setUUserList(list)
            })
          }
        else{
            console.log("Ethereum object does not exist!")
        }
      }catch(error){
          console.log(error)
      }
    }
    const viewAddedUserList=async()=>{
      try{
        if(window.ethereum){
            const provider=new ethers.providers.Web3Provider(ethereum)
            const signer=provider.getSigner()
            const UserContract=new ethers.Contract(
                ContractAddress,
                UserABI.abi,
                signer
            )     
            await UserContract.getAddedUserToElection(props.electionID).then((list1)=>{
              setAUserList(list1)
            })
          }
        else{
            console.log("Ethereum object does not exist!")
        }
      }catch(error){
          console.log(error)
      }
    }
    const removeElection=async()=>{
      try{
        if(window.ethereum){
            const provider=new ethers.providers.Web3Provider(ethereum)
            const signer=provider.getSigner()
            const UserContract=new ethers.Contract(
                ContractAddress,
                UserABI.abi,
                signer
            )     
            await UserContract.removeElection(props.electionID).then((log)=>{
              provider.waitForTransaction(log.hash,1).then((receipt)=>{
                if(receipt){
                  if(receipt.status==1)
                    changeStatus(props.changeStatus)
                  else if(receipt.status==0)
                    console.log("Transaction Failed!");
                }
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

    const getCandidateList=async()=>{
      await viewCandidates()    
      setShowModal(true)
    }
    
    const viewCandidates = async () => {
      try{
          if(window.ethereum){
              const provider=new ethers.providers.Web3Provider(ethereum)
              const signer=provider.getSigner()
              const UserContract=new ethers.Contract(
                  ContractAddress,
                  UserABI.abi,
                  signer
              )     
              await UserContract.getCandidates(props.electionID).then((list)=>{
                setCandidateList(list)
              })
            }
          else{
              console.log("Ethereum object does not exist!")
          }
      }catch(error){
          console.log(error)
      }
    }

    const auditElections = async () => {
        try{
            if(window.ethereum){
                const provider=new ethers.providers.Web3Provider(ethereum)
                const signer=provider.getSigner()
                const UserContract=new ethers.Contract(
                    ContractAddress,
                    UserABI.abi,
                    signer
                )     
                await UserContract.auditElections(props.electionID).then(async(log)=>{
                    await provider.waitForTransaction(log.hash,1).then((receipt)=>{
                      if(receipt){
                        if(receipt.status==1)
                          changeStatus(props.changeStatus)
                        else if(receipt.status==0)
                          console.log("Transaction Failed!");
                      }
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
    
    return (  
        <div>
          <div className="grid items-center justify-items-center sm:grid-cols-1 md:grid-cols-8 gap-4 mb-4">
          <div className='col-span-2 flex items-center gap-4'>
           <span className="bg-blue-100 text-cyan-800 py-1 px-3 rounded-full font-medium">{props.name}</span>
          </div>
          <div className='col-span-2 flex items-center gap-4'>
            {!props.isActive?<button className="bg-green-100 text-green-800 py-1 px-3 rounded-full font-medium" onClick={()=>{auditElections()}}>Activate</button>:<button className="bg-red-100 text-red-800 py-1 px-3 rounded-full font-medium" onClick={()=>{auditElections()}}>De-activate</button>}
          </div>
          <div className='col-span-4 flex items-center gap-4'>
            <div className='col-span-1'>
                
            </div>
            <div className='col-span-1'>
                
            </div>
            <div className='col-span-1'>
                <button className="bg-purple-100 text-purple-800 py-1 px-3 rounded-full font-medium" onClick={()=>{removeElection()}}>Remove</button>
            </div>
            <div className='col-span-1'>
                <button className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full font-medium" onClick={()=>{getCandidateList()}}>View Candidates</button>
                <Popup showModal={showModal} setShowModal={setShowModal} data={candidateList} electionID={props.electionID} func={changeStat}/>
            </div>
            <div className='col-span-1'>
                <button className="bg-cyan-100 text-cyan-800 py-1 px-3 rounded-full font-medium" onClick={()=>{getUserList()}}>Manage Voters</button>
                <UserPopup showUserModal={showUserModal} setShowUserModal={setShowUserModal} udata={unaddedUserList} adata={addedUserList} electionID={props.electionID} func={changeStat1} func1={viewUnaddedUserList}/>
            </div>
          </div>
          </div>
        </div>
      );
}

export default AuditList