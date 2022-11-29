import {create} from 'ipfs-http-client'
import {Buffer} from 'buffer'
import { PROJECT_ID,API_KEY_SECRET } from './.infuraConfig'

const auth = 'Basic ' + Buffer.from(PROJECT_ID + ':' + API_KEY_SECRET).toString('base64')
const ipfsClient=async()=>{
    
    const ipfs = await create(
        {
            host: "ipfs.infura.io",
            port: 5001,
            protocol: 'https',
            apiPath:'/api/v0',
            headers: {
                authorization: auth
            }
        }
    );
    return ipfs;
}

export async function saveText(data) {
    try{
        let ipfs = await ipfsClient()
        let result = await ipfs.add(data)
        return result.path
    }
    catch(err){
        return err
    }
}

export async function getText(cid) {
    try{
        let ipfs = await ipfsClient()
        const stream=ipfs.cat(cid)
        const decoder=new TextDecoder()
        let data=''
        for await (const chunk of stream) {
            data += decoder.decode(chunk, { stream: true })
        }
        return data
    }
    catch(err){
        return err
    }
}