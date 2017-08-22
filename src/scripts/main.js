(function(root) {
  var noOfImages = 6;
  var timeDelay = 1000;
  var bigWinMessage,smallWinMessage,noWinMessage,bonusWinMessage;
  var bonus = false;
  var resultSet = [];

  // init method, setting the config values here
  let init = function(config) {
    noOfImages = (config.noOfImages) ? config.noOfImages : 6;
    timeDelay = (config.timeDelay) ? config.timeDelay :1000;
    bigWinMessage = (config.bigWinMessage) ? config.bigWinMessage: "Big Win !!!";
    smallWinMessage = (config.smallWinMessage) ? config.smallWinMessage: "Small Win !!!";
    noWinMessage = (config.noWinMessage) ? config.noWinMessage: "Bad Luck, Try Again !!!";
    bonusWinMessage = (config.bonusWinMessage) ? config.bonusWinMessage: "You have a bonus chance !!!";
    updateUserMessage("Click on the below button to start !!");
  };

  // method to update the text messages
  let updateUserMessage = function(message, type) {
    let $el = clearUserMessage(),
      html;
    switch (type) {
      case "h2":
        html = `<${type} class="user-alert"> ${message} </${type}>`;
        break;
      case "h1":
        html = `<${type} class="user-alert user-success-alert"> ${message} </${type}>`;
        break;
      default:
        html = `<h2 class="user-alert"> ${message} </h2>`;
        break;
    }
    $el.innerHTML += html;
  };

  // find the result category and show the appropriate message
  showResults = function(result) {
    count = {}
    result.forEach((item) => {
      count[item] = (count[item] || 0) + 1;
    });
    var prizeCategory = Math.max.apply(Math, Object.keys(count).map((key) => {
      return count[key]
    }));

    switch (prizeCategory) {
      case 3:
        updateUserMessage(bigWinMessage, "h1")
        break;
      case 2:
        updateUserMessage(smallWinMessage, "h1")
        break;
      default:
        updateUserMessage(noWinMessage , "h1");
        break;
    }

    if(bonus){
      setTimeout(() => {
        showBonus();
      },2000)
    }

  };

  // handle bonus condition
  showBonus = function(){
    document.querySelector('.icon-continer').classList.add('blinker-bg');
    updateUserMessage(bonusWinMessage, "h1");
    setTimeout(() => {
      document.querySelector('.start-game-button').click();
    },5000)
  }

  let clearUserMessage = function() {
    let $el = document.getElementsByClassName('icon-continer')[0];
    if ($el.querySelector('.user-alert')) {
      $el.querySelector('.user-alert').remove();
    }
    return $el;
  };

  // method to add the images , handle promises 
  createElm = function(imgList) {
    let $el = clearUserMessage().getElementsByClassName('image-wrap')[0];
    $el.innerHTML = '';
    $el.parentElement.classList.remove('blinker-bg');

    let sliderPromise = Promise.all(imgList.map((item, index) => imageLooping(item, index, $el)));
    sliderPromise.then(() => {
      showResults(resultSet);
      enableDisbaleButton('enable');
    })

  };

  imageLooping = function(item, index, $el) {
    let totalTime = 0;
    $el.innerHTML += `<div class='item-${index}'></div>`
    return new Promise(resolve => setTimeout(() => {
      let imageEl = `item-${index}`;
      let imageSlider = setInterval(function() {
        totalTime += 100;
        let randomImageId = Math.floor(Math.random() * noOfImages);
        if (totalTime === timeDelay) {
          clearInterval(imageSlider);
          randomImageId = item;
          resolve();
        }
        $el.getElementsByClassName(imageEl)[0].innerHTML = `<img src=assets/Symbol_${randomImageId}.png>`;
      }, 100)
    }, timeDelay * index));
  };

  enableDisbaleButton = function(status) {
    document.querySelector('.start-game-button').disabled = (status === 'enable') ? false : true;
  };

  getResults = function(callback) {
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if (req.readyState == 4 && req.status == 200){
        resultSet = JSON.parse(req.responseText);
        bonus = (resultSet.pop() === 1) ? true : false;
        callback(resultSet);
      }
    }
    req.open("GET",'/api/getResults' , true);
    req.send(null);
  };

  this.startGame = function(e) {
    e.preventDefault();
    enableDisbaleButton('disable');
    getResults(createElm);
  };

  return public = {
    init: init
  }

})(this);

window.onload = function() {
  public.init({
    noOfImages : 6,
    timeDelay : 1500,
    bigWinMessage : "You have won !!"
  });
}
