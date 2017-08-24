var JackPot = function(config) {
  this.noOfImages = (config.noOfImages) ? config.noOfImages : 6;
  this.timeDelay = (config.timeDelay) ? config.timeDelay : 1000;
  this.bigWinMessage = (config.bigWinMessage) ? config.bigWinMessage : "Big Win !!!";
  this.smallWinMessage = (config.smallWinMessage) ? config.smallWinMessage : "Small Win !!!";
  this.noWinMessage = (config.noWinMessage) ? config.noWinMessage : "Bad Luck, Try Again !!!";
  this.bonusWinMessage = (config.bonusWinMessage) ? config.bonusWinMessage : "You have a bonus chance !!!";
  this.bonus = false;
  this.resultSet = [];
}
// method to update the text messages
JackPot.prototype.updateUserMessage = function(message, type) {
  let $el = this.clearUserMessage(),
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
JackPot.prototype.showResults = function(result) {
  let count = {}
  result.forEach((item) => {
    count[item] = (count[item] || 0) + 1;
  });
  let prizeCategory = Math.max.apply(Math, Object.keys(count).map((key) => {
    return count[key]
  }));

  switch (prizeCategory) {
    case 3:
      this.updateUserMessage(this.bigWinMessage, "h1")
      break;
    case 2:
      this.updateUserMessage(this.smallWinMessage, "h1")
      break;
    default:
      this.updateUserMessage(this.noWinMessage, "h1");
      break;
  }

  if (this.bonus) {
    setTimeout(() => {
      this.showBonus();
    }, 2000)
  }

};

// handle bonus condition
JackPot.prototype.showBonus = function() {
  document.querySelector('.icon-continer').classList.add('blinker-bg');
  this.updateUserMessage(this.bonusWinMessage, "h1");
  setTimeout(() => {
    document.querySelector('.start-game-button').click();
  }, 5000)
}

// clear the message and returns the element
JackPot.prototype.clearUserMessage = function() {
  let $el = document.getElementsByClassName('icon-continer')[0];
  if ($el.querySelector('.user-alert')) {
    $el.querySelector('.user-alert').remove();
  }
  return $el;
};

// method to add the images , handle promises
JackPot.prototype.createElm = function(imgList) {
  let $el = this.clearUserMessage().getElementsByClassName('image-wrap')[0];
  let self = this;
  $el.innerHTML = '';
  $el.parentElement.classList.remove('blinker-bg');

  let sliderPromise = Promise.all(imgList.map((item, index) => self.imageLooping(item, index, $el)));
  sliderPromise.then(() => {
    self.showResults(self.resultSet);
    self.enableDisbaleButton('enable');
  })

};

// Creating the image rotation and appending the icons in the dom
JackPot.prototype.imageLooping = function(item, index, $el) {
  let totalTime = 0;
  let self = this;
  $el.innerHTML += `<div class='item-${index}'></div>`
  return new Promise(resolve => setTimeout(() => {
    let imageEl = `item-${index}`;
    let imageSlider = setInterval(function() {
      totalTime += 100;
      let randomImageId = Math.floor(Math.random() * self.noOfImages);
      if (totalTime === self.timeDelay) {
        clearInterval(imageSlider);
        randomImageId = item;
        resolve();
      }
      $el.getElementsByClassName(imageEl)[0].innerHTML = `<img src=assets/Symbol_${randomImageId}.png>`;
    }, 100)
  }, self.timeDelay * index));
};

//quick button handler
JackPot.prototype.enableDisbaleButton = function(status) {
  document.querySelector('.start-game-button').disabled = (status === 'enable') ? false : true;
};

//grabing data from the api and firing callback
JackPot.prototype.getResults = function(callback,error) {
  let self = this;
  let req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (req.readyState === 4) {
      if(req.status === 200){
        self.resultSet = JSON.parse(req.responseText);
        self.bonus = (self.resultSet.pop() === 1) ? true : false;
        callback.apply(self, [self.resultSet]);
      } else{
        error.apply(self)
      }
    }
  }
  req.open("GET", apiEndpoints.getResults, true);
  req.send(null);
};

JackPot.prototype.showError = function() {
  this.updateUserMessage("Something went wrong, try again");
  this.enableDisbaleButton('enable');
};

// init method, setting the config values here
this.init = function(config) {
  var jackpot = new JackPot(config);
  jackpot.updateUserMessage("Click on the below button to start !!");

  this.startGame = function(e) {
    e.preventDefault();
    jackpot.enableDisbaleButton('disable');
    jackpot.getResults(jackpot.createElm,jackpot.showError);
  };

  return jackpot
};
