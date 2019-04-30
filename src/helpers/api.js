import AppHelper from "helpers/AppHelper.js";
import { axiosClient } from 'index.js';
import { CONSTANTS } from "./urlConstants";
import { replacePlaceHolder } from 'helpers/urlHelper.js';

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
        stateHandler({ trackingData: response.data.data });
      })
  }

  getModules(stateHandler) {
    axiosClient.get(CONSTANTS.ASSET_MANAGEMENT_MODULES)
      .then((response)=> {
        stateHandler({
          apiResponse: true,
          modulesData: response.data.data.modules,
        })
      })
  }
  
  getActivitiesData(stateHandler) {
    axiosClient.get(CONSTANTS.ASSET_MANAGEMENT_ACTIVITIES)
      .then((response) => {
        stateHandler({
          activitiesData: response.data.data.activity
        })
      })
  }

  getTasksData(stateHandler) {
    axiosClient.get(CONSTANTS.ASSET_MANAGEMENT_TASKS)
      .then((response) => {
        stateHandler({
          apiResponse: true,
          tasksData: response.data.data.tasks
        })
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
