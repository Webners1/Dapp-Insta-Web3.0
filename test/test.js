const { assert } = require('chai')
const { default: Web3 } = require('web3')

const Decentragram = artifacts.require('./Decentragram.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Decentragram', ([deployer, author, tipper]) => {
  let decentragram

  before(async () => {
    decentragram = await Decentragram.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await decentragram.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await decentragram.name()
      assert.equal(name, 'MuzammilGram')
    })
  })
  describe("images", async()=>{
    let result, imageCount;
    let ImageDescription = 'Image Description'
    const hash = 'fgdfgdf4534' 
    before(async()=>{
      result = await decentragram.uploadImage(hash, ImageDescription,0,{from: author});
      imageCount = await decentragram.imageCount();
    })
    it('create images', async()=>{
assert(imageCount,1)
const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id IS correct')
assert.equal(event.hash,hash,'Hash IS correct')
      assert.equal(event.description, ImageDescription,'Description IS correct')
      assert.equal(event.tipAmount,'0','Tip IS correct')
      assert.equal(event.author, author, 'author IS correct')
    await decentragram.uploadImage('','',{from : author}).should.be.rejected;
    })
    it('list images',async()=>{
      const image = await decentragram.image(imageCount);
      assert.equal(image.id.toNumber(), imageCount.toNumber(), 'id IS correct')
      assert.equal(image.hash, hash, 'Hash IS correct')
      assert.equal(image.description, ImageDescription, 'Description IS correct')
      assert.equal(image.tipAmount, '0', 'Tip IS correct')
      assert.equal(image.author, author, 'author IS correct')
    })
    it('allow user to tip Image',async()=>{
      let oldAuthorBalance;
      oldAuthorBalance = await web3.eth.getBalance(author);
      oldAuthorBalance = new web3.utils.BN(oldAuthorBalance);
      result = await decentragram.tipImageOwner(imageCount,{from:tipper,value:web3.utils.toWei('1','Ether')})
    const event = result.logs[0].args;
      assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id IS correct')
      assert.equal(event.hash, hash, 'Hash IS correct')
      assert.equal(event.description, ImageDescription, 'Description IS correct')
      assert.equal(event.author, author, 'author IS correct')
    

      let newAuthorBalance;
      newAuthorBalance = await web3.eth.getBalance(author)
      newAuthorBalance = new web3.utils.BN(newAuthorBalance);

      let tipImageOwner;
      tipImageOwner = web3.utils.toWei('1', 'Ether')
      tipImageOwner = new web3.utils.BN(tipImageOwner)
      const expectedBalance = oldAuthorBalance.add(tipImageOwner);
      assert.equal(newAuthorBalance.toString(), expectedBalance.toString())
await decentragram.tipImageOwner(99,{from:tipper,value:web3.utils.toWei('1','Ether')}).should.be.rejected;
    })
  })

})