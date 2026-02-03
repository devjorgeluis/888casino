const someCommonValues = ['common', 'values'];

export const resolvePath = (object, path, defaultValue) => path
  .split('.')
  .reduce((o, p) => o ? o[p] : defaultValue, object)

export const capitalize = (string) => {
  return string && string[0].toUpperCase() + string.slice(1);
};

export const callApi = (contextData, method, methodUrl, callbackFunction, body) => {
  let token = contextData.session?.authorization?.token
  fetch(contextData.apiBaseUrl + methodUrl, {
    mode: 'cors',
    method: method,
    headers: {
      'Accept': 'application/json',
      Authorization: 'bearer ' + token
    },
    body: body
  }).then(res => {
    switch (res.status) {
      case 500: return { "status": 500, "message": "Ha ocurrido un error inesperado, contacte al administrador." }
      case 422: return { "status": 422, "message": "Los datos ingresados no son válidos." }
      case 401:
        localStorage.removeItem('session');
        window.location.reload();
        // var redirectUrl = window.location.origin + '/login';
        // window.location.href = redirectUrl;
        return
    }
    return res.json()
    // return res
  })
    .then((response) => {
      // console.log(response)
      callbackFunction(response)
    });
}

export const getFormattedDate = (dateString) => {
  // let dateObject = new Date(dateString)
  // let dateResult = dateObject.getDate() + '/' + (dateObject.getMonth() + 1) + '/' + dateObject.getFullYear() + ' ' + dateObject.getHours() + ':' + dateObject.getMinutes()
  // return dateResult
  return dateString
}
