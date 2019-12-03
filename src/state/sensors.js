import produce from "immer";
import { forEach } from "lodash";

const RECEIVE_LIST_DEVICES = "RECEIVE_LIST_DEVICES";
const RECEIVE_DEVICE_UPDATE = "RECEIVE_DEVICE_UPDATE";
const SET_ACTIVE_SENSOR = "SET_ACTIVE_SENSOR";
const RECEIVE_LOG = 'RECEIVE_LOG';

/**
 * sensors: {
 *  'topicId': {
 * deviceName:
 * topic:
 * volt:
 *
 *  }
 * }
 */
const initialState = {
  sensors: {},
  activeSensor: undefined,
  log: [],
};

export default produce((draft, action) => {
  switch (action.type) {
    case RECEIVE_LIST_DEVICES:
      console.info('[Reduer] RECEIVE_LIST_DEVICES:', action.payload);
      forEach(action.payload.sensorsList, (sensor) => {
        const key = sensor.deviceName;
        console.log(sensor, key);
        draft.sensors[key] = sensor;
      });
      break;

      case RECEIVE_LOG:
          console.info('[Reduer] RECEIVE_LOG:', action.payload);
          if (draft.log.length === 20) {
            draft.log.splice(19, 1);
          }
          draft.log.splice(0, 0, action.payload.log);
          break;

    case SET_ACTIVE_SENSOR:
      console.info('[Reduer] SET_ACTIVE_SENSOR:', action.payload.activeSensor);
      draft.activeSensor = action.payload.activeSensor;
      break;
    case RECEIVE_DEVICE_UPDATE:
      if (!draft.sensors || !draft.activeSensor) {
        break;
      }
      const key = action.payload.sensor.id || draft.activeSensor;
      switch (action.payload.sensor.type) {
        case "temp":
          console.info('[Reduer] RECEIVE_DEVICE_UPDATE: temp:', action.payload.sensor.value);
          draft.sensors[key].temp = action.payload.sensor.value;
          break;
        case "humidity":
          console.info('[Reduer] RECEIVE_DEVICE_UPDATE: humidity:', action.payload.sensor.value);
          draft.sensors[key].humidity = action.payload.sensor.value;
          break;
        case "Voltage":
          console.info('[Reduer] RECEIVE_DEVICE_UPDATE: Voltage:', action.payload.sensor.value);
          draft.sensors[key].voltage = action.payload.sensor.value;
          break;
        case "RPM":
          console.info('[Reduer] RECEIVE_DEVICE_UPDATE: RPM:', action.payload.sensor.value);
          draft.sensors[key].rpm = action.payload.sensor.value;
          break;
        case "Material_speed":
          console.info('[Reduer] RECEIVE_DEVICE_UPDATE: Material_speed:', action.payload.sensor.value);
          draft.sensors[key].speed = action.payload.sensor.value;
          break;
        default:
          break;
      }
      break;
    default:
      break;
  }
}, initialState);
