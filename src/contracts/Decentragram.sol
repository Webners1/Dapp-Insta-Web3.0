pragma solidity >=0.4.21 <0.9.0;
contract Decentragram {
  string public name = 'MuzammilGram';
  uint public imageCount=0;
  // Code goes here...
  //store Image
  mapping(uint =>Image) public image;
  struct Image{
    uint id;
    string hash;
    string description;
    uint tipAmount;
    address payable author;
  }
   event imageCreated(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author
  );
  event  ImageTipped(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author
  );
//Create Images

function uploadImage(string memory _imgHash,string memory _desc,uint _tipAmount) public {
require(bytes(_desc).length >0);
require(bytes(_imgHash).length >0);
require(msg.sender != address(0x0)); 
imageCount ++;
image[imageCount] = Image(imageCount,_imgHash,_desc,_tipAmount, msg.sender);
emit imageCreated(imageCount, _imgHash, _desc, _tipAmount, msg.sender);
}


function tipImageOwner(uint _id) public payable{
  require(_id >0 && _id <= imageCount);
  Image memory _image = image[_id];
  
  address payable _author = _image.author;
  
  _author.transfer(msg.value);

  _image.tipAmount = _image.tipAmount + msg.value;

  image[_id] = _image;
emit ImageTipped(_id, _image.hash, _image.description, _image.tipAmount, _author);
}
}