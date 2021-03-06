// game logic
var noOfImages = 6;
var noOfCards  = 3;
var bonusLimit = 50;

var getResults = function(req,res){
  var resultArray = [];
  for(let i = 0; i <= noOfCards; i++){
    if(i !== noOfCards){
       resultArray.push(Math.floor(Math.random() * noOfImages));
    }else{
      //Logic for bonus
      // bonus will be given last item in the response array is truthy 
      var bonus = (100 * Math.random() > bonusLimit) ? 1 : 0;
      resultArray.push(bonus);
    }
  }
  res.json(resultArray);
}

module.exports = {
  getResults : getResults
}
