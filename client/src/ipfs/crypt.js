import CryptoJS from 'crypto-js'
import { Buffer } from 'buffer'

export const AESEncrypt = (data) => {
    const wrdArr = CryptoJS.lib.WordArray.create(data)
    const str=CryptoJS.enc.Hex.stringify(wrdArr)
    const enc = CryptoJS.AES.encrypt(str,'encrypt')
    return enc.toString()           
}

export const AESDecrypt = (data) => {
    const dec=CryptoJS.AES.decrypt(data,'encrypt')
    const str=dec.toString(CryptoJS.enc.Utf8)
    const wrdArr=CryptoJS.enc.Hex.parse(str)
    const wordArrayToByteArray=(wordArray)=>{
        const l = wordArray.sigBytes;                                                                                                        
        const words = wordArray.words;                                                                                                       
        const result = new Uint8Array(l);                                                                                                    
        var i=0, j=0;
        while(true) {
            if (i==l)
                break;
            var w = words[j++];
            result[i++] = (w & 0xff000000) >>> 24;
            if (i==l)
                break;
            result[i++] = (w & 0x00ff0000) >>> 16;                                                                                            
            if (i==l)                                                                                                                        
                break;                                                                                                                       
            result[i++] = (w & 0x0000ff00) >>> 8;
            if (i==l)
                break;
            result[i++] = (w & 0x000000ff);                                                                                                  
        }
        return result;
    }
    const arrBytes=wordArrayToByteArray(wrdArr)
    const result=Buffer.from(arrBytes).toString('base64');
    return result
}