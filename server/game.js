// game logic
var noOfImages = 6;
var noOfCards  = 3;
var bonusLimit = 55;

var getResults = function(req,res){
  var resultArray = [];
  for(let i = 0; i <= noOfCards; i++){
    if(i !== noOfCards){
       resultArray.push(Math.floor(Math.random() * noOfImages));
    }else{
      //Logic for bonus
      var date = new Date().getSeconds();
      var bonus = (date * Math.random() > bonusLimit) ? 1 : 0;
      resultArray.push(bonus);
    }
  }
  res.json(resultArray);
}

module.exports = {
  getResults : getResults
}
