
const RECEIVE_LIST_DEVICES = 'RECEIVE_LIST_DEVICES';
const RECEIVE_DEVICE_UPDATE = 'RECEIVE_DEVICE_UPDATE';
const SET_ACTIVE_SENSOR = "SET_ACTIVE_SENSOR";
const RECEIVE_LOG = 'RECEIVE_LOG';

export const receivesensorsListAction = (msg) => (dispatch) => {
  console.info('[Action] Receive sensor list', msg);
  dispatch({
    type: RECEIVE_LIST_DEVICES,
    payload: {
      sensorsList: msg
    },
  });
}

export const setActivteSensorAction = (deviceName) => (dispatch) => {
  console.info(`[Action] Set active sensor: ${deviceName}`);
  dispatch({
    type: SET_ACTIVE_SENSOR,
    payload: {
      activeSensor: deviceName
    },
  });
}

export const receiveSensorAction = (msg) => (dispatch) => {
  console.info('[Action] Receive sensor action', msg);
  dispatch({
    type: RECEIVE_DEVICE_UPDATE,
    payload: {
      sensor: msg
    },
  });
}

export const updateLogAction = (data) => (dispatch) => {
  console.info('[Action] Receive LOG', data);
  dispatch({
    type: RECEIVE_LOG,
    payload: {
      log: data
    },
  });
}
