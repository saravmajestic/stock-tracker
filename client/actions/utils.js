const ROOT_URL = location.href.indexOf('localhost') > 0 ? 'http://localhost:3001/api' : '/api';

export function getGraph(payload){
  let token = sessionStorage.getItem('jwtToken');

  var headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Authorization', `Bearer ${token}`);
  
  var options = {
    method: 'POST',
    headers: headers,
    mode: 'cors',
    cache: 'default',
    body: JSON.stringify(payload)
  };

  var request = new Request(`${ROOT_URL}/graphql`, options);
  return fetch(request);
}