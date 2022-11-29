import UserABI from '../../../smart_contract/build/contracts/Voters.json'
import { ContractAddress } from '../config.js'
import {ethers} from 'ethers'
import {useState,useRef,useEffect} from 'react'
import {useForm} from 'react-hook-form'
import {generatePassword} from './pass.js'
import {useNavigate} from 'react-router-dom'
import { saveText } from '../ipfs/infura'
import { AESEncrypt } from '../ipfs/crypt'
import {auth2fa,verify2Fa} from '../2fa/authenticate'
import OtpInput from "react18-input-otp"
import { Oval } from 'react-loader-spinner'
import "./otp.css"

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

const Loader=()=>{
    return(
      <div className='flex flex-col items-center h-[70vh] justify-center'>
        <Oval
        height={50}
        width={50}
        color="magenta"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel='oval-loading'
        secondaryColor="#4fa94d"
        strokeWidth={2}
        strokeWidthSecondary={2}
        />
      </div>
    )
  }

const Popup=(props)=>{
    const [otpModal,setShowOTPModal]=useState(false)
    const [otp,setOTP]=useState('')
    const [otpsuccess,setOTPSuccess]=useState(false)
    let status=false
    const handleClick=()=>{
        setShowOTPModal(true)
    }
    const checkOTP=async(token,secret)=>{
        let tmp=verify2Fa(token,secret)
        status=tmp
        if(status==false){
            document.getElementById('error-otp').innerText="Error: Incorrect OTP"
            setOTP('')
        }
        else{
            document.getElementById('error-otp').innerText=""
            document.getElementById('otp-button').innerText="Verified"
            setOTPSuccess(true)
            await props.addUser()
        }
    }
  return (
    <>
      {props.showModal?(
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-hidden fixed inset-0 z-50 outline-none focus:outline-none backdrop-blur-md">
            <div className="relative w-3/4 my-6 mx-auto">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-slate-900 outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                    <div className=" mr-10">
                        <h3 className="text-3xl font-semibold text-white">Two Factor Authentication Setup</h3>
                    </div>
                </div>
                {!otpModal?
                    <>
                        <div className="p-6 flex flex-col items-center justify-center">
                        {props.qrData==''?<Loader/>:<>
                        <h1 className='text-lg font-bold pb-6 break-all'>Password : {props.passWd}</h1>
                        <h1 className='text-xl font-bold pb-6'>Setup Key : {props.secret}</h1>
                        <img className='pb-6' src={props.qrData}/>
                        <h1 className='text-md text-teal-500 font-bold pb-6'>Scan QR Code Or Enter Setup Key into Google Authenticator App! Once added, click on Next</h1>
                        <h1 className='text-lg font-bold pb-6 blink-slow'>Note: Store your password and Setup Key! This will not be displayed again!</h1>
                        </>}
                        </div>
                        <div className="flex items-center justify-center p-3 border-t border-solid border-slate-200 rounded-b">
                            <button className='bg-green-400 font-bold text-lg text-sky-800 rounded-lg p-2' onClick={()=>handleClick()}>Next</button>
                        </div>
                    </>:
                    <>
                    {!otpsuccess?<>
                        <div className="pt-6 px-6 pb-2 flex flex-col items-center justify-center">
                            {props.qrData==''?<Loader/>:<OTP otp={otp} setOTP={setOTP}/>}
                            <h1 id='error-otp' className='p-2 text-red-700 font-bold text-xl'></h1>
                        </div>
                        <div className="flex items-center justify-center p-3 border-t border-solid border-slate-200 rounded-b">
                            {otp.length==6?<button id="otp-button" className='bg-green-400 font-bold text-lg text-sky-800 rounded-lg py-2 px-4' onClick={()=>checkOTP(otp,props.secret)}>Verify OTP</button>:<h1 className='bg-gray-600 font-bold text-lg text-gray-400 rounded-lg py-2 px-4'>Verify OTP</h1>}
                        </div></>:
                        <>
                        <div className="pt-6 px-6 pb-2 flex flex-col items-center justify-center">
                            <h1 className='p-2 text-green-700 font-bold text-xl'>Confirming Registration!</h1>
                            <Loader/>
                        </div>
                        <div className="flex items-center justify-center p-3 border-t border-solid border-slate-200 rounded-b">
                        </div></>
                    }
                    </>
                }
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ):null}
    </>
  )
}  

const Register = () => {
    const [name,setName]=useState("")
    const [aadhar,setAadhar]=useState("")
    const [email,setEmail]=useState("")
    const [cid,setCID]=useState("")
    const [password,setPassword]=useState("")
    const [metaBool,setmetaBool]=useState(0)
    const [account,setAccount]=useState('0x0')
    const [showModal,setShowModal]=useState(false)
    const [qrData,setQrData]=useState('')
    const [sec,setSec]=useState('')
    const navigate=useNavigate()

    const {register,handleSubmit,formState:{errors,isValid}}= useForm({
        mode: "all"
    }
    )

    const onSubmit = async data => {
        if(document.getElementById('wallet-id').innerText!=='Connect Wallet'){
            let chk = await checkUser()
            if(chk){
                console.log("Already Registered!")
                navigate('/login')
            }
            else{
                document.getElementById('wallet-id').innerText='Processing...'
                let fr = new FileReader();
                fr.readAsArrayBuffer(data.photoID[0]);
                fr.onload = async(e) => {
                    let encFile=AESEncrypt(e.target.result)
                    await saveText(encFile).then(async (res)=>{
                        setCID(res)
                        let pwd=generatePassword(account,32)
                        setPassword(pwd)
                        let tmpDat=auth2fa(name,pwd)
                        setQrData(tmpDat[0])
                        setSec(tmpDat[1])
                        setShowModal(true)
                    })
                }
            }
        }
    }

    const initialRender=useRef(true);

    const checkUser = async () =>{
        try{
            const {ethereum}=window;
            console.log("here")
            if(window){
                const provider=new ethers.providers.Web3Provider(ethereum)
                const signer=provider.getSigner()
                const UserContract=new ethers.Contract(
                    ContractAddress,
                    UserABI.abi,
                    signer
                )
                console.log(await UserContract.getSender())
                return await UserContract.isUserRegistered()
            }
            else{
                console.log("Ethereum object does not exist!")
                return
            }
        }catch(error){
            console.log(error)
            return
        }
    }

    const addUser = async () => {
        try{
            if(window.ethereum){
                const provider=new ethers.providers.Web3Provider(ethereum)
                const signer=provider.getSigner()
                const UserContract=new ethers.Contract(
                    ContractAddress,
                    UserABI.abi,
                    signer
                )
                await UserContract.addUser(aadhar,name,email,password,cid,sec,false).then((log)=>{
                    provider.waitForTransaction(log.hash,1).then((receipt)=>{
                        if(receipt){
                            if(receipt.status==1){
                                alert("DO NOT LOSE THIS! Your login key is: "+password)
                                navigate('/login')
                            }
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

    const ConnectWallet = async(e)=>{
        //e.preventDefault();
        if(document.getElementById('wallet-id').innerText=='Connect Wallet'){
            setmetaBool(metaBool+1)
            console.log(metaBool);
        }
    }

    useEffect(()=>{
        let chk = async () => {
            var res= await checkUser()
            return res
        }
        chk().then(res=>{
        console.log(res)
        if(res)
        {
            console.log("Already Registered!")
            alert("Wallet connected and already registered. Proceed with login!")
            navigate('/login')
        }})
    },[account])

    useEffect(()=>{
        if(initialRender.current){
            initialRender.current=false;
        }
        else{
        if(!window.ethereum){
            console.log('Metamask not installed')
            return
        }
        const accountWasChanged = (accounts) => {
            if(accounts[0]==undefined){
                document.getElementById('walletfield').value='0x0';
                document.getElementById('wallet-id').innerText='Connect Wallet';
            }
            else{
                document.getElementById('walletfield').value=accounts[0];
                document.getElementById('wallet-id').innerText='Sign Up';
            }
            setAccount(accounts[0]);
            console.log('account was changed',accounts[0]);
        }
        const getAndSetAccount = async () => {
            const accounts=await window.ethereum.request({method: 'eth_requestAccounts'})
            setAccount(accounts[0]);
            console.log('get and set account');
        }
        const clearAccount = () => {
            setAccount('0x0');
            console.log('clear account');
        }
        window.ethereum.on('accountsChanged',accountWasChanged)
        window.ethereum.on('connect',getAndSetAccount)
        window.ethereum.on('disconnect',clearAccount)
        window.ethereum.request({method: 'eth_requestAccounts'}).then(accounts=>{
            if(accounts[0]!=undefined){
            setAccount(accounts[0]);
            document.getElementById('walletfield').value=accounts[0];
            document.getElementById('wallet-id').innerText='Sign Up';
        }},{})
        }
    },[metaBool])

    return (
    <div className="flex items-center justify-center text-white">
        <div className='bg-gradient-to-r from-gray-800 to-teal-900 h-screen flex flex-col justify-center w-full rounded-lg'>
            <form id='form' onSubmit={handleSubmit(onSubmit)} className='max-w-[512px] w-full mx-auto rounded-lg bg-gray-900 p-8'>
                <h2 className='text-4xl dark:text-white font-bold text-center'>REGISTER</h2>
                <div className='flex flex-col text-gray-400 mt-1 py-2'>
                    <div className='flex justify-between'>
                        <label>Name</label>
                        <h1 className=' text-red-500'>{errors.name?.type === "required" && "Name is required"}</h1>
                    </div>
                    <input className='rounded-lg bg-gray-700 mt-1 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none' type="text" {...register("name", { required: true })} onChange={(e)=>setName(e.target.value)}/>
                </div>
                <div className='flex flex-col text-gray-400 mt-1 py-2'>
                    <div className='flex justify-between'>
                        <label>Aadhar ID</label>
                        <h1 className=' text-red-500'>{errors.aadhar?.type === "required" && "Aadhar number is required"}
                        {errors.aadhar?.type === "minLength" && "Aadhar number cannot be less than 12 digits"}
                        {errors.aadhar?.type === "maxLength" && "Aadhar number cannot be more than 12 digits"}</h1>
                    </div>
                    <input className='rounded-lg bg-gray-700 mt-1 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none' type="number" {...register("aadhar", { required: true, minLength: 12, maxLength:12})} onKeyDown={(e)=>(e.key==='e'||e.key==='.') && e.preventDefault()} onChange={(e)=>setAadhar(e.target.value)}/>
                </div>
                <div id='email' className='flex flex-col text-gray-400 mt-1 py-2'>
                    <div className='flex justify-between'>
                        <label>Email ID</label>
                        <h1 className=' text-red-500'>{errors.email?.type === "required" && "Email is required"}{errors.email?.type === "pattern" && "Entered email is in wrong format"}</h1>
                    </div>
                    <input className='p-2 rounded-lg bg-gray-700 mt-1 focus:border-blue-500 focus:bg-gray-800 focus:outline-none' type="text" {...register("email", {required: true,pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i})} onChange={(e)=>setEmail(e.target.value)}/>
                </div>
                <div id='fileproof' className='flex flex-col text-gray-400 mt-1 py-2'>
                    <div className='flex justify-between'>
                        <label>Photo ID</label>
                        <h1 className=' text-red-500'>
                            {errors.photoID?.type === "required" && "PhotoID is required"}
                            {errors.photoID?.type === "lessThan100KB" && "PhotoID size must be less than 100Kb"}
                            {errors.photoID?.type === "acceptedFormats" && "PhotoID can be jpg/png/pdf files only"}
                        </h1>
                    </div>
                    <input className='p-2 rounded-lg bg-gray-700 mt-1 focus:border-blue-500 focus:bg-gray-800 focus:outline-none' type="file" {...register("photoID", {required: true,validate:{lessThan100KB: files=>files[0]?.size<100000,acceptedFormats:files=>['image/jpeg','image/png','image/jpg','application/pdf'].includes(files[0]?.type)}})}/>            
                </div>
                <div className='flex flex-col text-gray-400 mt-1 py-2'>
                    <label>Wallet ID</label>
                    <input id='walletfield' className='p-2 rounded-lg bg-gray-700 mt-1 focus:border-blue-500 focus:bg-gray-800 focus:outline-none text-green-700 font-bold' type="text" readOnly={true} placeholder='0x0'/>
                </div>
                <div>
                    <button id='wallet-id' disabled={!isValid} className='register w-full my-5 py-2 bg-teal-500 shadow-lg shadow-teal-500/50 hover:shadow-teal-500/40 text-white font-semibold rounded-lg' onClick={(e)=>ConnectWallet(e)}>Connect Wallet</button>
                </div>
            </form>
        </div>
        {setShowModal && <Popup showModal={showModal} setShowModal={setShowModal} qrData={qrData} secret={sec} passWd={password} addUser={addUser}/>}
    </div>
  )
}

export default Register