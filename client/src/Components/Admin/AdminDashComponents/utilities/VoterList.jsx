import UserABI from '../../../../../../smart_contract/build/contracts/Voters.json'
import { ContractAddress } from '../../../../config.js'
import {ethers} from 'ethers'
import {React,useState} from "react"
import { getText } from '../../../../ipfs/infura'
import { AESDecrypt } from '../../../../ipfs/crypt'
import { Oval } from 'react-loader-spinner'

const Loader=()=>{
  return(
    <div className='flex flex-col h-[70vh] items-center justify-center'>
      <Oval
      height={50}
      width={50}
      color="#4fa94d"
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
  const handleClick = (e,func,func1) => {
    e.preventDefault();
    if (e.target === e.currentTarget) {
        func(false)
        func1('')
    }
  }
  const handleClose = (func,func1) => {
    func(false)
    func1('')
  }
return (
  <>
    {props.showModal?(
      <>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none backdrop-blur-md" onClick={(e)=>handleClick(e,props.setShowModal,props.setImgData)}>
          <div className="relative w-3/4 my-6 mx-auto max-w-3xl">
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-slate-900 outline-none focus:outline-none">
              <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <div className=" mr-10">
                      <h3 className="text-3xl font-semibold text-white">PhotoID</h3>
                  </div>
                <button className="p-1 ml-auto bg-transparent border-0 text-white float-right text-3xl leading-none font-semibold outline-none focus:outline-none" onClick={()=>handleClose(props.setShowModal,props.setImgData)}>
                  <span className="bg-transparent text-white h-6 w-6 text-2xl block outline-none focus:outline-none">X</span>
                </button>
              </div>
              <div className="relative p-6 flex flex-col items-center justify-center">
              {props.imgData==''?<Loader/>:
                props.imgData.slice(props.imgData.indexOf(':')+1,props.imgData.indexOf(';'))=='application/pdf'?<iframe src={props.imgData+"#view=FitW"} width="100%" height="100%" className='h-[70vh]'/>:<img src={props.imgData}/>}
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


const VoterList = (props) => {  
  const [showModal,setShowModal]=useState(false)
  const [imgData,setImgData]=useState('') 
  const viewPhotoId=async()=>{
    setShowModal(true)
    await getText(props.cid).then((dat)=>{
      const decrypt=AESDecrypt(dat)
      let ext=decrypt.charAt(0)
      let path='/'
      if(ext==='/'){
        path="data:image/jpg;base64,"+decrypt
      }
      else if(ext==='i'){
        path="data:image/png;base64,"+decrypt
      }
      else if(ext==='J'){
        path="data:application/pdf;base64,"+decrypt
      }
      setImgData(path)
    })
  }

  return (  
    <>
      <div className="min-w-[420px] bg-white p-4 rounded-3xl shadow-2xl mb-8 gap-6 flex flex-col">
        <div className="grid grid-cols-5 items-center justify-items-center gap-4 mb-4">
          <div>
            <h3 className="py-1 px-3 rounded-full font-bold break-all flex items-center text-center">{props.name}</h3>
          </div>
          <div>
            <span className="bg-blue-100 text-cyan-800 py-1 px-3 rounded-full font-medium break-all flex items-center text-center">{props.aadhar}</span>
          </div>
          <div>
            <span className="bg-blue-100 text-cyan-800 py-1 px-3 rounded-full font-medium break-all flex items-center text-center">{props.email}</span>
          </div>
          <div>
            <button className="bg-blue-100 text-cyan-800 py-1 px-3 rounded-full font-medium" onClick={()=>viewPhotoId()}>View</button>
          </div>
          <div>
            <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full font-medium">Verified</span>
          </div>
        </div>
      </div>
      {showModal && <Popup setShowModal={setShowModal} showModal={showModal} imgData={imgData} setImgData={setImgData}/>}
    </>
  );
}

export default VoterList;