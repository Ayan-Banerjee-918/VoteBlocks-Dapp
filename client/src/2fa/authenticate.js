import {authenticator} from '@otplib/preset-default'
import qrcode from 'qrcode'
import base32 from './base32'
let secKey='';
let qrdata='';
let verifyStatus=false;

const reg2FaAuth=(user,pass)=>{
    const txt=pass.replace(/[^a-zA-Z0-9]/g,'')
    const start=parseInt(Math.random()*100)%64
    const secret=base32.toBase32(txt.slice(start,start+10))
    const otpauth=authenticator.keyuri(user,"VoteBlocks",secret)
    qrcode.toDataURL(otpauth,(err,data)=>{
        secKey=secret
        qrdata=data
    })
}

const check2FaAuth=(token,secret)=>{
    try{
        verifyStatus=authenticator.verify({token,secret})
        return verifyStatus
    }
    catch(err){
        console.log(err)
    }
}

export const auth2fa=(user,pass)=>{
    reg2FaAuth(user,pass)
    return [qrdata,secKey]
}

export const verify2Fa=(token,secret)=>{
    check2FaAuth(token,secret)
    return verifyStatus
}