let axios = require("axios");

let baseURL;
if (process.env.NODE_ENV === "development") {
  baseURL=""
}
else if (process.env.NODE_ENV === "production"){
  baseURL="http://192.168.0.90"
}

console.log(baseURL)

const client = axios.create({
  baseURL: baseURL,
  json: true,
})

export function lights(rgb, cb) {
  let params = rgb
  console.log(params)
  return client({
    method: "get",
    params: params,
    url: "/lightsOn"}).then(checkStatus).then(cb).catch(error => {
      if (error.response){
        cb({data: error.response.data, response: error.response.status});
      }
    })
}


function checkStatus(response){
  if (response.status >= 200 && response.status < 300 ) {
    return {data: response.data, status: response.status}
  }
  const error = new Error(`HTTP Error ${response.statusText}`);
  error.status = response.statusText;
  error.response = response;
  throw error;
}
