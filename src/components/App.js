import React, { Component, useEffect, useState } from 'react';
import Web3 from 'web3';
import Identicon from 'identicon.js';
import './App.css';
import Decentragram from '../abis/Decentragram.json'
import Navbar from './Navbar'
import Main from './Main'
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({host:'ipfs.infura.io',port:5001,protocol:'https'})


function App() {
  let[account,setAccount] = useState()
  let [decentra, setDecentragram] = useState('')
  let [Image, setImage] = useState('')
  let [images, setImages] = useState([])
  let [loading, setLoading] = useState(true)
  let [buffer, setBuffer] = useState(true)

  const loadBlockChainData = async()=>{
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts();
    setAccount(account = accounts[0])
    const networkId = await web3.eth.net.getId()
    const networkData = Decentragram.networks[networkId]
    if(networkData){
      const decentragram = web3.eth.Contract(Decentragram.abi, networkData.address)
      const imageCount = await decentragram.methods.imageCount().call();
      setDecentragram(decentra = decentragram);
      
    
      console.log(imageCount)
      setLoading(loading= false);
      for(let i=0; i<=imageCount;i++){
        const image = await decentra.methods.image(i).call()
       
        setImages(images= [...images,image])
        console.log(images)
      }
    
  }
    else{
window.alert('The contract is not deployes')
    }

  }
  const loabWeb3 = async()=>{
if(window.ethereum){
  window.web3 = new Web3(window.ethereum);
  await window.ethereum.enable();
}
else if(window.web3){
window.web3 = new Web3(window.web3.currentProvider)
}
else{
  window.alert('Non-Ethereum Browser Detected')
}}
const captureFile=(e)=>{
e.preventDefault()
const file = e.target.files[0]
const reader = new window.FileReader()
reader.readAsArrayBuffer(file)
reader.onloadend=()=>{
setBuffer(buffer = Buffer(reader.result))

}
}
const tipImageOwner=async (id,tipAmount)=>{
  
  console.log(id)
setLoading(true)
decentra.methods.tipImageOwner(id).send({from:account, value:tipAmount})
.on('transactionHash', (hash)=>{
  setLoading(false)

})
}
const uploadImage=(desc)=>{
  console.log(desc)
  ipfs.add(buffer,(err,result)=>{
    console.log('IPFS RESULT',result)

    if(err){
return
    }
    setLoading(true)
    const results = result[0].hash
    decentra.methods.uploadImage(results, desc,0)
    .send({from: account})
    .on('transactionHash',(hash)=>{
      setLoading(false)
    })
  })
}
const init=async()=>{
await loabWeb3()
await loadBlockChainData()
}
useEffect(() => {
  init();
}, [])
    return (
      <div>
        <Navbar account={account} />
        {loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
          images={images}
            captureFile={captureFile}
            uploadImage={uploadImage}
            tipImageOwner={tipImageOwner}
            />
            // Code...
          }
        
      </div>
    );
  
}

export default App;