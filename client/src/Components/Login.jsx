import {useState,useRef,useEffect} from 'react'
import {useForm} from 'react-hook-form'
import {useNavigate,useLocation} from 'react-router-dom'
import UserABI from '../../../smart_contract/build/contracts/Voters.json'
import { ContractAddress } from '../config.js'
import {ethers} from 'ethers'
import AuthConsumer from '../auth/useAuth'
import "./otp.css"
import OtpInput from "react18-input-otp"
import { verify2Fa } from '../2fa/authenticate'
import {generatePassword} from './pass.js'
import { Oval } from 'react-loader-spinner'

const Loader=()=>{
    return(
      <div className='flex flex-col items-center h-[70vh] justify-center'>
        <Oval
        height={80}
        width={80}
        color="cyan"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel='oval-loading'
        secondaryColor="#4fa94d"
        strokeWidth={3}
        strokeWidthSecondary={3}
        />
      </div>
    )
  }

const OTP=(props)=>{
    const handleChange = (enteredOtp) => {
        props.setOTP(enteredOtp)
        document.getElementById('error-otp').innerText=""
    }
    return (
         <div className="card">
            <form>
              <label htmlFor="otp-input-0">Enter 6 digit OTP</label>
                <OtpInput
                    value={props.otp}
                    onChange={handleChange}
                    numInputs={6}
                    isInputNum={true}
                    separator={<pre> </pre>}
                    shouldAutoFocus
                    className="mt-2 font-bold text-3xl text-black items-center justify-center"
                />
            </form>
        </div>
    )
}

const Popup=(props)=>{
    const [otp,setOTP]=useState('')
    const [secretKey,setSecretKey]=useState('')
    const [account,setAccount]=useState('0x0')
    const [pass,setGenPass]=useState(false)
    const [newPass,setNewPass]=useState('')
    const [wait,setWait]=useState(false)
    let status=false

    const handleClick = (e,func) => {
        e.preventDefault();
        if (e.target === e.currentTarget) {
            func(false);
        }
    }

    const handleChange=(e)=>{
        document.getElementById('error-otp').innerText=""
        setSecretKey(e.target.value)
    }

    const checkOTP=async(token,secret)=>{
        const provider=new ethers.providers.Web3Provider(ethereum)
        const signer=provider.getSigner()
        const UserContract=new ethers.Contract(
            ContractAddress,
            UserABI.abi,
            signer
        )
        const accounts=await window.ethereum.request({method: 'eth_requestAccounts'})
        setAccount(accounts[0])
        await UserContract.getUserDetails().then(async(user)=>{
            if(secret!==user.key){
                document.getElementById('error-otp').innerText="Error: Invalid Setup Key!"
                document.getElementById('setup-key').value=''
                setOTP('')
                setSecretKey('')
            }
            else{
                let tmp=verify2Fa(token,secret)
                status=tmp
                if(status==false){
                    document.getElementById('error-otp').innerText="Error: Incorrect OTP"
                    setOTP('')
                }
                else{
                    setGenPass(true)
                }
            }
        })
    }
    const genPass=async()=>{
        setWait(true)
        document.getElementById('otp-button').innerText="Generating"
        const provider=new ethers.providers.Web3Provider(ethereum)
        const signer=provider.getSigner()
        const UserContract=new ethers.Contract(
            ContractAddress,
            UserABI.abi,
            signer
        )
        let pwd=generatePassword(account,32)
        await UserContract.setPass(pwd).then(()=>{
            setNewPass(pwd)
        })
    }
  return (
    <>
      {props.showModal?(
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none backdrop-blur-md" onClick={(e)=>handleClick(e,props.setShowModal)}>
            <div className="relative w-3/4 my-6 mx-auto">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-slate-900 outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <div className=" mr-10">
                        <h3 className="text-3xl font-semibold text-white">Two Factor Authentication</h3>
                    </div>
                    <button className="p-1 ml-auto bg-transparent border-0 text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none" onClick={() => props.setShowModal(false)}>
                        <span className="bg-transparent text-white h-6 w-6 text-2xl block outline-none focus:outline-none">X</span>
                    </button>
                </div>
                {!wait?<>
                <div className='flex flex-cols text-gray-400 mt-1 px-10 py-2 w-full justify-center'>
                    <h1 className='font-bold text-xl p-2'>Setup Key</h1>
                    <input id='setup-key' className='p-2 rounded-lg bg-gray-700 mt-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none' type="text" onChange={(e)=>handleChange(e)}/>
                </div>
                <div className="pt-6 px-6 pb-2 flex flex-col items-center justify-center">
                    <OTP otp={otp} setOTP={setOTP}/>
                    <h1 id='error-otp' className='p-2 text-red-700 font-bold text-lg'></h1>
                </div></>:
                    <div className="flex flex-col items-center justify-center">
                        {newPass==''?<Loader/>:<>
                        <h1 className='p-2 text-white font-bold text-lg'>Your New Password :</h1>
                        <h1 className='p-2 text-purple-500 font-bold text-lg'>{newPass}</h1>
                        <h1 className='p-2 text-red-700 font-bold text-lg blink-slow'>Note: Store your password! It will be displayed only once!</h1>
                        </>}
                    </div>
                }
                <div className="flex items-center justify-center p-3 border-t border-solid border-slate-200 rounded-b">
                    {newPass!==''?<h1 className='bg-green-500 font-bold text-lg text-slate-900 rounded-lg py-2 px-4'>Success!!</h1>:pass==true?<button id="otp-button" className='bg-green-400 font-bold text-lg text-sky-800 rounded-lg py-2 px-4' onClick={()=>genPass()}>Generate New Password</button>:otp.length==6 && secretKey.length==16?<button id="otp-button" className='bg-green-400 font-bold text-lg text-sky-800 rounded-lg py-2 px-4' onClick={()=>checkOTP(otp,secretKey)}>Verify</button>:<h1 className='bg-gray-600 font-bold text-lg text-gray-400 rounded-lg py-2 px-4'>Verify</h1>}
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

const OtpModal=(props)=>{
    const [otp,setOTP]=useState('')
    const navigate=useNavigate();
    const {loginUser,setAddressUser}=AuthConsumer()
    const location=useLocation();
    const from=location.state?.from?.pathname || "../userApp";
    const handleClick = (e,func) => {
        e.preventDefault();
        if (e.target === e.currentTarget) {
            func(false);
        }
    }
    const checkOTP=async(token)=>{
        const provider=new ethers.providers.Web3Provider(ethereum)
        const signer=provider.getSigner()
        const UserContract=new ethers.Contract(
            ContractAddress,
            UserABI.abi,
            signer
        )
        await UserContract.getUserDetails().then(async(user)=>{
            let tmp=verify2Fa(token,user.key)
            let status=tmp
            if(status==false){
                document.getElementById('error-otp').innerText="Error: Incorrect OTP"
                setOTP('')
            }
            else{
                let res=await props.signinUser()
                if(res==true){
                    alert("Logged In!")
                    loginUser(props.address).then(()=>{
                        navigate(from,{replace:true})
                    })
                }
                else if(res==false)
                    alert("Invalid Aadhar/Login Key")
                else
                    alert("User Not Registered!")
            }
        })
    }
    return (
        <>
          {props.showModal?(
            <>
              <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none backdrop-blur-md" onClick={(e)=>handleClick(e,props.setShowModal)}>
                <div className="relative w-3/4 my-6 mx-auto">
                  <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-slate-900 outline-none focus:outline-none">
                    <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                        <div className=" mr-10">
                            <h3 className="text-3xl font-semibold text-white">Two Factor Authentication</h3>
                        </div>
                        <button className="p-1 ml-auto bg-transparent border-0 text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none" onClick={() => props.setShowModal(false)}>
                            <span className="bg-transparent text-white h-6 w-6 text-2xl block outline-none focus:outline-none">X</span>
                        </button>
                    </div>
                    <div className="pt-6 px-6 pb-2 flex flex-col items-center justify-center">
                        <OTP otp={otp} setOTP={setOTP}/>
                        <h1 id='error-otp' className='p-2 text-red-700 font-bold text-lg'></h1>
                    </div>
                    <div className="flex items-center justify-center p-3 border-t border-solid border-slate-200 rounded-b">
                        {otp.length==6?<button className='bg-green-400 font-bold text-lg text-sky-800 rounded-lg py-2 px-4' onClick={()=>checkOTP(otp)}>Verify</button>:<h1 className='bg-gray-600 font-bold text-lg text-gray-400 rounded-lg py-2 px-4'>Verify</h1>}
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

const Login = () => {
    const [aadhar,setAadhar]=useState("")
    const [loginKey,setLoginKey]=useState("")
    const [account,setAccount]=useState("0x0")
    const [forgot,setForgot]=useState(false)
    const [acceptOTP,setAcceptOTP]=useState(false)
    const [metaBool,setmetaBool]=useState(0)

    const navigate=useNavigate();
    const {loginUser,setUser,setAddressUser}=AuthConsumer()
    const location=useLocation();
    const from=location.state?.from?.pathname || "../userApp";

    const {register,handleSubmit,formState:{errors,isValid}}= useForm({
        mode: "all"
    }
    )

    const forgotPassword=()=>{
        setForgot(true)
    }

    const onSubmit = data => {
        if(document.getElementById('wallet-id').innerText!=='Connect Wallet'){
            setAcceptOTP(true)
        }
    }

    const signinUser = async () => {
        try{
            if(aadhar=="000000000000"){
                alert("This aadhar id is invalid!")
                return 'regErr'
            }
            else if(window.ethereum){
                const provider=new ethers.providers.Web3Provider(ethereum)
                const signer=provider.getSigner()
                const UserContract=new ethers.Contract(
                    ContractAddress,
                    UserABI.abi,
                    signer
                )
                let res=await UserContract.loginUser(loginKey,aadhar)
                await UserContract.getUserDetails().then((user)=>{
                    setUser(user)
                    setAddressUser(account)
                })
                return res
            }
            else{
                console.log("Ethereum object does not exist!")
            }
        }catch(error){
            console.log(error)
            return "regErr"
        }
    }

    const ConnectWallet = async(e)=>{
        if(document.getElementById('wallet-id').innerText=='Connect Wallet'){
            setmetaBool(prev=>prev+1)
        }
    }

    const initialRender=useRef(true);

    useEffect(()=>{
        if(initialRender.current){
            initialRender.current=false;
        }
        else{
        if(!window.ethereum){
            console.log('Metamask not installed')
        }
        else{
        const accountWasChanged = (accounts) => {
            if(accounts[0]==undefined){
                document.getElementById('walletfield').value='0x0';
                document.getElementById('wallet-id').innerText='Connect Wallet';
            }
            else{
                document.getElementById('walletfield').value=accounts[0];
                document.getElementById('wallet-id').innerText='Login';
            }
            setAccount(accounts[0]);
            console.log('account was changed',accounts[0]);
        }
        window.ethereum.on('accountsChanged',accountWasChanged)
        window.ethereum.request({method: 'eth_requestAccounts'}).then(accounts=>{
            if(accounts[0]!=undefined){
            setAccount(accounts[0])
            document.getElementById('walletfield').value=accounts[0]
            document.getElementById('wallet-id').innerText='Login'
        }})
    }}},[metaBool])

    return (
    <div className="flex items-center justify-center text-white">
        <div className='bg-gradient-to-r from-gray-800 to-teal-900 h-screen flex flex-col justify-center w-full rounded-lg'>
            <form id='form' onSubmit={handleSubmit(onSubmit)} className='max-w-[455px] w-full mx-auto rounded-lg bg-gray-900 p-8 px-8'>
                <h2 className='text-4xl dark:text-white font-bold text-center'>LOGIN</h2>
                <div className='flex flex-col text-gray-400 mt-1 py-2'>
                    <div className='flex justify-between'>
                        <label>Aadhar ID</label>
                        <h1 className=' text-red-500'>{errors.aadhar?.type === "required" && "Aadhar number is required"}
                        {errors.aadhar?.type === "minLength" && "Aadhar number cannot be less than 12 digits"}
                        {errors.aadhar?.type === "maxLength" && "Aadhar number cannot be more than 12 digits"}</h1>
                    </div>
                    <input className='rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none' type="number" {...register("aadhar", { required: true, minLength: 12, maxLength:12})} onKeyDown={(e)=>(e.key==='e'||e.key==='.') && e.preventDefault()} onChange={(e)=>setAadhar(e.target.value)}/> 
                </div>
                <div className='flex flex-col text-gray-400 mt-1 py-2'>
                    <div className='flex justify-between'>
                        <label>Login Key</label>
                        <h1 className=' text-red-500'>{errors.loginKey?.type === "required" && "Login Key is required"}</h1>
                    </div>
                    <input className='p-2 rounded-lg bg-gray-700 mt-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none' type="text" {...register("loginKey", {required: true})} onChange={(e)=>setLoginKey(e.target.value)}/>
                </div>
                <div className='flex justify-end'>
                    <button type="button" className='text-blue-500 mt-1' onClick={forgotPassword}>Forgot Password</button>
                </div>
                <div className='flex flex-col text-gray-400 pb-2'>
                    <label>Wallet ID</label>
                    <input id='walletfield' className='p-2 rounded-lg bg-gray-700 mt-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none text-green-700 font-bold' type="text" readOnly={true} placeholder='0x0'/>
                </div>
                <div>
                    <button id='wallet-id' disabled={!isValid} className='register w-full my-5 py-2 bg-teal-500 shadow-lg shadow-teal-500/50 hover:shadow-teal-500/40 text-white font-semibold rounded-lg' onClick={(e)=>ConnectWallet(e)}>Connect Wallet</button>
                </div>
            </form>
        </div>
        {forgot && <Popup showModal={forgot} setShowModal={setForgot}/>}
        {acceptOTP && <OtpModal address={account} showModal={acceptOTP} setShowModal={setAcceptOTP} signinUser={signinUser}/>}
    </div>

  )
}

export default Login