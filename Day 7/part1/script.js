window.onload = function() {
    try{
        getAgencies(getToken())
    } catch (error){
        console.log(error)
    }
    
 // if(hasToken()) {
      // get agencies
    //  getAgencies(this.localStorage.getItem('token'))
 // }

//submit botton
  var submitButton = document.getElementById('submit')
  submitButton.addEventListener('click', function (event) {
      event.preventDefault()

      var clientId = getClientId()
      var clientSecret = getClientSecret()

      login(clientId, clientSecret)
  })
  
  var submitAgenciesButton = document.getElementById('submit-agency')
  submitAgenciesButton.addEventListener('click', function(event){
      event.preventDefault()

      var agencies = document.getElementById('agencies-select')
      var selectAgency = agencies.options[agencies.selectedIndex].value

      getLines(getToken(), selectAgency)
  })

//logout button
  var logooutButton = this.document.getElementById('submit-logout')
  logooutButton.addEventListener('click', function(event){
      event.preventDefault()
      localStorage.removeItem('token')
      localStorage.removeItem('storageDate')
  })
}

function getToken(){
    var token = this.localStorage.getItem('token')
    if(token == null || token == undefined || token == 'undefined'){
    throw new Error("this is an errror")
    }
    return token

}



function hasToken() {
  //CHECK if token exists in local storage

  var token = localStorage.getItem('token')

  if(token) {
      //hide the form if the token exists
      var loginForm = document.getElementById('login-form')
      // loginForm.classList.add('is-invisible')
      loginForm.style.display = 'none'
      return true
  }
  else {
      return false
  }
}

function getClientId() {
  var clientId = document.getElementById('client-id')
  return clientId.value
}

function getClientSecret() {
  var clientSecret = document.getElementById('client-secret')
  return clientSecret.value
}

function login(clientId, clientSecret) {
  //From whereismytransport developer page
  var CLIENT_ID = clientId;
  var CLIENT_SECRET = clientSecret;
  var payload = {
      'client_id': CLIENT_ID,
      'client_secret': CLIENT_SECRET,
      'grant_type': 'client_credentials',
      'scope': 'transportapi:all'
  };
  var request = new XMLHttpRequest();
  request.open('POST', 'https://identity.whereismytransport.com/connect/token', true);
  request.addEventListener('load', function () {
      var response = JSON.parse(this.responseText);
      var token = response.access_token;
      window.token = token;
      
      localStorage.setItem('token', token)
      localStorage.setItem('storageDate', Date.now().toLocaleString())
      
  });
  request.setRequestHeader('Accept', 'application/json');
  var formData = new FormData();

  for (var key in payload) {
      formData.append(key, payload[key]);
  }

  request.send(formData);
}

function getAgencies(token) {
  var request = new XMLHttpRequest();
  request.addEventListener('load', function () {
      var response = JSON.parse(this.responseText);
      // var agenciesList = document.getElementById('agencies-list')
      // agenciesList.textContent = this.responseText
      
      addAgenciesToDropDown(response)
  });
  request.open('GET', 'https://platform.whereismytransport.com/api/agencies', true);
  request.setRequestHeader('Accept', 'application/json');
  request.setRequestHeader('Authorization', 'Bearer ' + token);
  request.send();
}

function addAgenciesToDropDown(agenciesList) {
  var agenciesSelect = document.getElementById('agencies-select')
  agenciesSelect.options.length = 0
  agenciesSelect.options.add(new Option("Select an option", null, true, true))
  agenciesList.forEach(function(agency) {
      agenciesSelect.options.add(new Option(agency.name, agency.id, false, false))
  })
}

function getLines(token,agency){
    var request = new XMLHttpRequest();
    request.addEventListener('load', function (){
        var response = JSON.parse(this.responseText);
        var linesList = document.getElementById('lines-select')
        linesList.textContent =this.responseText
        addLinesToDropDown(response)
    })
    request.open('GET', 'https://platform.whereismytransport.com/api/lines?agencies=' + agency, true);
  request.setRequestHeader('Accept', 'application/json');
  request.setRequestHeader('Authorization', 'Bearer ' + token);
  request.send();
}
function addLinesToDropDown(linesList) {
    var linesSelect = document.getElementById('lines-select')
    linesSelect.options.length = 0
    linesSelect.options.add(new Option("Select an option", null, true, true))
    linesList.forEach(function(line) {
        linesSelect.options.add(new Option(line.name, line.id, false, false))
    })
  }