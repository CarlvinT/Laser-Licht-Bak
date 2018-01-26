app.service('loginService', function($http, $location) {

    var ls = this;
    var loggedInUser = {
      email : '',
    }

    ls.checkLogin = function() {
      if(!ls.getLocalData("loggedIn")) {
         $location.path( "/" );
      } 
    }
     
    ls.isAuthenticated = function() {
        return ls.getLocalData("loggedIn");
      }

    ls.saveLocalData = function(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  ls.getLocalData = function(key) {
    try {
      return JSON.parse(window.localStorage.getItem(key));
    } catch (e) {
      console.log('Unable to retrieve local data.');
    }
  }

   
});

