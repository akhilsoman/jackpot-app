describe("JackPot", function() {
  var jackpot;

  beforeEach(function() {
    jackpot = new JackPot({});
  });
  describe("handling ajax", function() {
    var doneFn,error;
    beforeEach(function() {
      jasmine.Ajax.install();
      doneFn = jasmine.createSpy("success");
      errorFn = jasmine.createSpy("error");
      // act
      jackpot.getResults(doneFn, errorFn);
    });
    afterEach(function() {
      jasmine.Ajax.uninstall();
    });
    it("should make a XHR request", function() {
      // assert
      expect(jasmine.Ajax.requests.mostRecent().url).toBe('/api/getResults');
      expect(doneFn).not.toHaveBeenCalled();
    });
    it("should call the success callback method on ajax-success", function() {
      jasmine.Ajax.requests.mostRecent().respondWith({
        "status": 200,
        "contentType": "application/json",
        "responseText": '[0,1,2,1]'
      });
      // assert
      expect(doneFn).toHaveBeenCalledWith([0,1,2,]);
      expect(errorFn).not.toHaveBeenCalledWith();
    });
    it("should call the error callback method on ajax-failure", function() {
      jasmine.Ajax.requests.mostRecent().respondWith({
        "status": 500
      });
      // assert
      expect(doneFn).not.toHaveBeenCalledWith();
      expect(errorFn).toHaveBeenCalledWith();
    });
  });
  describe("init", function() {
    var dom, initReturn;
    beforeEach(function() {
      dom = "<div class='icon-continer'></div>"
      document.body.innerHTML += dom;
      initReturn = init({
        noOfImages : 6,
        timeDelay : 1500,
        bigWinMessage : "You have won !!"
      })
    });
    afterEach(function(){
     document.body.querySelector(".icon-continer").remove();
     dom = null;
    });
    it("should set the custom config values", function() {
        expect(initReturn.noOfImages).toEqual(6);
        expect(initReturn.timeDelay).toEqual(1500);
        expect(initReturn.bigWinMessage).toEqual("You have won !!");
    });
  });
});
