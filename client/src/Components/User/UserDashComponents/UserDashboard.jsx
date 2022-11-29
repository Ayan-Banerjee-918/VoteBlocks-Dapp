import { useEffect,useState } from "react"
import UserABI from '../../../../../smart_contract/build/contracts/Voters.json'
import { ContractAddress } from '../../../config.js'
import {ethers} from 'ethers'
import {Pie} from "react-chartjs-2"
import AuthConsumer from "../../../auth/useAuth"
import {
    Chart as ChartJS,ArcElement,CategoryScale,LinearScale,Tooltip
} from 'chart.js'

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    Tooltip
)

const DrawList=(props)=>{
    const [flg,setflg]=useState(false)
    const [chk,setChk]=useState(0)
    const [role,setRole]=useState("")

    useEffect(()=>{
        getRole(props.id).then(()=>{
            setflg(true)
        })
    },[chk])

    const switchRole=async(id)=>{
        try{
            if(window.ethereum){
                const provider=new ethers.providers.Web3Provider(ethereum)
                const signer=provider.getSigner()
                const UserContract=new ethers.Contract(
                    ContractAddress,
                    UserABI.abi,
                    signer
                )          
                setflg(false)
                await UserContract.switchRole(id.toNumber()).then((log)=>{
                    provider.waitForTransaction(log.hash,1).then((receipt)=>{
                        if(receipt){
                          if(receipt.status==1)
                            setChk(prevChk=>prevChk+1);
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
            error=error.data.message.toString()
            console.log(error)
            if (error.indexOf('revert') > -1) {
                setChk(prevChk=>prevChk+1);
                error = error.replace(/^.*revert/, '')
                alert(error) 
            }
            }
    }

    const getRole=async (id)=>{
        try{
            if(window.ethereum){
                const provider=new ethers.providers.Web3Provider(ethereum)
                const signer=provider.getSigner()
                const UserContract=new ethers.Contract(
                    ContractAddress,
                    UserABI.abi,
                    signer
                )          

                setflg(false)
                await UserContract.getUserRole(id.toNumber()).then((val)=>{
                    if(val===true){
                        setRole("Admin")
                    }
                    else{
                        setRole("User")
                    }
                })
            }
            else{
                console.log("Ethereum object does not exist!")
            }
        }catch(error){
            console.log(error)
        }
    }

    return(
        <div className="grid items-center justify-items-center grid-cols-3 gap-4 mb-4">
          <div className='flex items-center gap-4'>
           <span className="bg-blue-100 text-cyan-800 py-1 px-3 rounded-full font-medium">{props.name}</span>
          </div>
          <div className='flex items-center gap-4'>
           {flg?<span className="bg-purple-100 text-orange-800 py-1 px-3 rounded-full font-medium">{role}</span>:<span className="text-green-200 py-1 px-3 rounded-full font-medium">Changing...</span>}
          </div>
          <div className='flex items-center gap-4'>
            <button className=" bg-red-900 rounded-md p-2 text-white font-bold" onClick={()=>switchRole(props.id)}>Switch Role</button>
          </div>
        </div>
    );
}

const Child=(props)=>{
    return (
      <>
        {props.list.map(item=>(
                <DrawList name={item.name} id={item.id} key={item.id}/>
        ))}
      </>
    );
  }

const UserDashboard = () => {

    const {user}=AuthConsumer()
    const [data,setData]=useState([])
    const [voteCnt,setVoteCnt]=useState(0)
    const [history,setHistory]=useState([])
    const [flg,setFlg]=useState(false)
    const [registeredData,setRegistered]=useState([])

    const linedata={
        labels: ["Voted","Not Voted"],
        datasets: [{
            data: [voteCnt,data.length-voteCnt],
            backgroundColor: [
                'rgba(75, 192, 192, 0.2)',  
                'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: [
                'rgba(75, 192, 192, 0.7)',  
                'rgba(255, 99, 132, 0.7)',
            ],
            pointBorderWidth: 4,
            tension: 0.5
        }]
    }
    
    useEffect(()=>{
        getElectionList()
    },[])

    const convertTimestamp = timestamp => {
      var monArr=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
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

      time = dd + '-' + monArr[mm-1] + '-' + yyyy + ', ' + h + ':' + min + ' ' + ampm;
      return time;
  }

    const getElectionList = async () => {
        try{
            if(window.ethereum){
                const provider=new ethers.providers.Web3Provider(ethereum)
                const signer=provider.getSigner()
                const UserContract=new ethers.Contract(
                    ContractAddress,
                    UserABI.abi,
                    signer
                )          
                await UserContract.getMappedElections(user.id.toNumber()).then((elections)=>{
                  setData(elections)
                  elections.map(async(item,index)=>{
                    await UserContract.checkVote(user.id,item.id.toNumber()).then((res)=>{
                      if(res){
                        if(voteCnt<=elections.length){
                            setVoteCnt(prevCnt=>prevCnt+1)
                        }
                      }
                    })
                })
                })
                await UserContract.getHistory(user.id.toNumber()).then((data)=>{
                  setHistory(data)
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
            <div className="bg-gradient-to-r mt-6 p-4 rounded-3xl from-slate-800 via-cyan-800 to-fuchsia-800">
                <div className="grid grid-rows-2 gap-6 sm:grid-cols-1 md:grid-cols-2">
                    <div className="row-span-2 bg-gradient-to-r from-gray-900 to-slate-800 p-8 rounded-3xl flex flex-col shadow-2xl gap-6 border-4 border-slate-900">
                        <div className="grid grid-cols-2 gap-y-4 items-center">
                            <h1 className="text-white text-xl font-bold grid justify-items-center">Total Active Elections</h1>
                            <div className="grid justify-items-center">
                                <h1 className="text-[#9de4f8] text-2xl font-bold">{data.length}</h1>
                            </div>
                            <h1 className="text-white text-lg font-bold grid justify-items-center">Voted</h1>
                            <div className="grid justify-items-center">
                                <h1 className="text-[#c4f5b9] text-2xl font-bold">{voteCnt}</h1>
                            </div>
                            <h1 className="text-white text-lg font-bold grid justify-items-center">Not Voted</h1>
                            <div className="grid justify-items-center">
                                <h1 className="text-[#f5b9b9] text-2xl font-bold">{data.length-voteCnt}</h1>
                            </div>
                            <div className="col-span-2 bg-gradient-to-r from-white to-slate-300 p-4 rounded-3xl shadow-2xl mt-2 gap-6 flex flex-col border-4 border-slate-900">
                                <Pie className="lg:max-h-72" data={linedata}></Pie>
                            </div>
                        </div>
                    </div>
                    <div className=" grid items-center bg-gradient-to-r from-gray-900 to-slate-800 p-8 rounded-3xl shadow-2xl gap-6 border-4 border-slate-900">
                        <div className="grid grid-cols-2 gap-y-4 items-center">
                            <h1 className="text-white text-xl font-bold grid justify-items-center">Lifetime Votes</h1>
                            <div className="grid justify-items-end">
                                <h1 className="text-[#9de4f8] text-2xl font-bold">{history.length}</h1>
                            </div>
                            <h1 className="text-white text-lg font-bold grid justify-items-center">First Vote:</h1>
                            <div className="grid justify-items-end">
                                {flg && history[0] && <h1 className=" text-[#f5b9b9] text-lg font-bold">{convertTimestamp(history[0].time.toNumber())}</h1>}
                            </div>
                            <h1 className="text-white text-lg font-bold grid justify-items-center">Last Vote:</h1>
                            <div className="grid justify-items-end">
                                {flg && history[0] && <h1 className="text-[#c4f5b9] text-lg font-bold">{convertTimestamp(history[history.length-1].time.toNumber())}</h1>}
                            </div>
                        </div>
                    </div>
                    <div className=" grid items-center justify-center bg-gradient-to-r from-gray-900 to-slate-800 p-6 rounded-3xl shadow-2xl gap-6 border-4 border-slate-900">
                      <h1 className="text-[#5fffa7] text-xl font-bold grid justify-items-center">User Details</h1>
                      <div className="grid grid-cols-2 gap-4 items-center">
                              <h1 className="text-white text-lg font-bold grid text-center">Name</h1>
                              <h1 className="text-[#9de4f8] text-lg font-bold text-start">{user.name}</h1>
                              <h1 className="text-white text-lg font-bold grid text-center">Aadhar Number</h1>
                              <h1 className="text-[#9de4f8] text-lg font-bold text-start">{user.aadhar}</h1>
                              <h1 className="text-white text-lg font-bold grid text-center">Email</h1>
                              <h1 className="text-[#9de4f8] text-lg font-bold text-start">{user.email}</h1>
                        </div>
                    </div>
                </div>
            </div>
        )
}

export default UserDashboard