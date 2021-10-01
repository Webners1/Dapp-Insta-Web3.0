import React, { Component, useState } from 'react';
import Identicon from 'identicon.js';

function Main(props) {

  let [value, setValue] = useState('')
  let [desc, setDesc] = useState('')
 
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
            <div className="content mr-auto ml-auto">
              <h2>Share Image</h2>
              <form onSubmit={(e)=>{
                e.preventDefault()
                props.uploadImage(desc.value)
              }}>
<input type='file' accept='.jpg, .jpeg, .png, .bmp, .gif' onChange={props.captureFile}/>
<div className='form-group mr-sm-2'>
<br></br>
<input
  id='imageDescription'
  type='text'
  ref={(e) => setDesc(e)}
  className='form-control'
  placeholder='Image description'
  required
/>
</div>
<button type='submit' className='bt btn-primary bt-block btn-lg'>Upload</button>
              </form>
              
{props.images? props.images.map((image,key)=>{
  return(
    <div className='card mb-4' key={key}>
<div className='card-header'>
  <img
  className='mr-2'
  width='30'
  height='30'
  src={`data:image/png;base64,${new Identicon(image.author,30).toString()}`}
/>
<small className='text-muted'>{image.author}</small>
</div>
<ul id='imageList' className='list-group list-group-flush'>
<li className='list-group-item'>
<p className='text-center'><img src={`https://ipfs.io/ipfs/${image.hash}`} style={{width:'300px'}}/></p>
<p>{image.description}</p>
</li>
<li key={key}className='list-group-item py-2'>
<small className='float-left mt-11 text-muted'>
  TIPS:{window.web3.utils.fromWei(image.tipAmount.toString(),'Ether')} Ether
</small>
<button
className='btn btn-link btn-sm float-right pt-0'
name={image.id}
onClick={(e)=>{
  let tipAmount = window.web3.utils.toWei('0.1','Ether')
console.log(e.target.name,tipAmount)
props.tipImageOwner(e.target.name,tipAmount)
}}>0.1ETH
</button>
</li>
</ul>
    </div>
  )
}):null}
            </div>
          </main>
        </div>
      </div>
    );
  
}

export default Main;