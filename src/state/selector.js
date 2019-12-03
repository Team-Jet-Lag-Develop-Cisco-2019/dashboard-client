export const selectSensors = (state) => {
  return state.sensors.sensors;
}

export const selectActiveSensor = (state) => {
  return state.sensors.sensors[state.sensors.activeSensor];
}

export const selectLog = (state) => {
  return state.sensors.log;
}
