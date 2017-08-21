(function(root) {

  let init = function() {
    updateUserMessage("Click on the below button to start !!");
  }

  let updateUserMessage = function(message) {
    let $el = clearUserMessage()
    let html = `<h2 class="user-alert"> ${message} </h2>`;
    $el.innerHTML = html
  }
  let clearUserMessage = function(){
    let $el = document.getElementsByClassName('icon-continer')[0];
    $el.innerHTML = '';

    return $el;
  }
  createElm = function(imgList){
    let $el = clearUserMessage();

    imgList.forEach(function(item,index){
        setTimeout(function(){
          $el.innerHTML += `<img src=assets/Symbol_${item}.png>`
        },1000*index)
    })
  }
  this.startGame = function(e){
      let response = [0,2,3]
      createElm(response)
  }

  return public = {
    init: init
  }

})(this);

window.onload = function() {
  public.init();
}
