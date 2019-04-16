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

  getProgram = (stateHandler, p_id) => {
    axiosClient.get(replacePlaceHolder(CONSTANTS.PROGRAM, [p_id]))
      .then((response) => {
        stateHandler({ program: response.data.data.programs })
      })
  }

  getModule(stateHandler, p_id, m_id) {
    axiosClient.get(replacePlaceHolder(CONSTANTS.MODULE, [p_id, m_id]))
      .then((response)=> {
        stateHandler({
          module: response.data.data.module,
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
  
}

const instance = new API();
export default instance;
