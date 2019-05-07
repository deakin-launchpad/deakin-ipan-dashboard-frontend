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

  updateModule(updatedModule, stateHandler, callback) {
    axiosClient.put(CONSTANTS.ASSET_MANAGEMENT_MODULES, updatedModule)
    .then(() => {
      stateHandler({
        apiResponse: true
      });
      callback();
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

  getTaskData(stateHandler) {
    axiosClient.get(CONSTANTS.ASSET_MANAGEMENT_TASKS)
      .then((response) => {
        stateHandler({
          apiResponse: true,
          tasksData: response.data.data.tasks
        })
      })
  }
  

  updateTaskData(stateHandler, data) {
    axiosClient.put(CONSTANTS.ASSET_MANAGEMENT_TASKS, data)
      .then((response) => {
        console.log(response)
        stateHandler({
        })
      })
  }

  getPrograms(stateHandler) {
    axiosClient.get(CONSTANTS.ASSET_MANAGEMENT_PROGRAMS)
    .then((response) => {
      stateHandler({
        apiResponse: true,
        programs: response.data.data.programs
      });
    })
  }

  updateProgram(updatedProgram, stateHandler, callback) {
    axiosClient.put(CONSTANTS.ASSET_MANAGEMENT_PROGRAMS, updatedProgram)
    .then(() => {
      stateHandler({
        apiResponse: true
      });
      callback();
    })
  }
}

const instance = new API();
export default instance;
