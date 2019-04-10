import AppHelper from "helpers/AppHelper.js";
import { axiosClient } from 'index.js';

class API {

  // POST requests

  registerUser(data) {
    axiosClient.post("user/register", {
      firstName: data.firstName,
      lastName: data.lastName,
      emailId: data.emailId,
      password: data.password,
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => console.log(error));
  }

  // GET requests

  getTrackingData(stateHandler) {
    axiosClient.get("trackingData")
    .then((response) => {
      stateHandler({trackingData: response.data.data});
    })
  }

  getPrograms(stateHandler) {
    axiosClient.get("programs")
    .then((response) => {
      stateHandler({programs: response.data.data.programs});
    })
  }
}

const instance = new API();
export default instance;
