import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import { map } from "lodash";
import "./App.css";
import ciscologo from "./ciscoLogo.png";
import Gauge from "./gauge";
import { selectSensors, selectActiveSensor, selectLog } from "./state/selector";
import {
  receivesensorsListAction,
  receiveSensorAction,
  setActivteSensorAction,
  updateLogAction
} from "./state/actions";

// ws://10.155.156.90:9999
// wss://echo.websocket.org
let testAddress = "wss://echo.websocket.org";
let address = "ws://10.155.156.90:9999";
let ws = new WebSocket(address);

function App() {
  let [toggleLog, setToggleLog] = useState(false);
  const rawList = {
    type: "LIST_DEVICES",
    msg: [{ deviceName: "1", topic: "id-1" }]
  };
  const rawSensors = {
    type: "TELEMETRY",
    msg: { id: "id-1", type: "temp", value: 22, ts: 1575288618 }
  };
  const dispatch = useDispatch();
  const sensorsList = useSelector(state => selectSensors(state));
  const activeSensor = useSelector(state => selectActiveSensor(state));
  const logs = useSelector(state => selectLog(state));

  ws.onopen = function(evt) {
    console.log("[WS Connection open] Connected...");
    ws.send("LIST_DEVICES");
    // test line
    // ws.send(JSON.stringify(rawList));
  };

  // receive list of device
  // receive {type, value: [{deviceName:, topic:} ]}
  // start topic
  ws.onmessage = function(evt) {
    console.log("[Receive message from ws] Raw message:", evt.data);
    dispatch(updateLogAction(evt.data));
    const data = JSON.parse(evt.data);
    console.log("[Receive message from ws] Parsed message: ", data);
    if (data.type === "LIST_DEVICES") {
      dispatch(receivesensorsListAction(data.msg));
    } else if (data.type === "TELEMETRY") {
      dispatch(receiveSensorAction(data.msg));
    }
  };

  ws.onclose = function(evt) {
    console.log("Connection closed.");
  };

  const openDetails = (topic, deviceName) => {
    console.log("[Open Details] Device topic: ", `START ${topic}`);
    ws.send(`START ${topic}`);
    dispatch(setActivteSensorAction(deviceName));
    // test line
    // ws.send(JSON.stringify(rawSensors));
    // setInterval(() => {
    //   rawSensors.msg.value =
    //     rawSensors.msg.value + (Math.random() * 2 - 1) * 10;
    //   ws.send(JSON.stringify(rawSensors));
    // }, 500);
  };

  // useEffect(() => {
  //   if (ws) {
  //     return () => ws.close();
  //   }
  // });

  const sensorsListUI = map(sensorsList, sensor => {
    const classNames = classnames("detail-section", {
      "detail-section--active":
        sensor && activeSensor && sensor.deviceName === activeSensor.deviceName
    });
    return (
      <div className={classNames} key={sensor.topic}>
        <h3>{sensor.deviceName}</h3>
        <button
          className="detail-btn"
          onClick={() => openDetails(sensor.topic, sensor.deviceName)}
        >
          View Metrics
        </button>
      </div>
    );
  });
  if (sensorsListUI.length) {
    sensorsListUI.push(
      <div className="log-btn-section">
        <a href="#" onClick={() => setToggleLog(!toggleLog)}>
          Show logs
        </a>
      </div>
    );
  }
  let tempChart;
  let humChart;
  let voltChart;
  let rpmChart;
  let speedChart;
  if (activeSensor) {
    console.info("activeSensor temp chart: ", activeSensor);
    tempChart = (
      <div key={"tempChart" + activeSensor.topic}>
        <h3>{"Temperature"}</h3>
        <Gauge
          style={{ margin: "20px" }}
          value={activeSensor.temp}
          pvalue={Math.round(((activeSensor.temp - 20) / (150 - 20)) * 100)}
          percent={"C"}
        />
      </div>
    );
    humChart = (
      <div key={"humChart" + activeSensor.topic}>
        <h3>{"Humidity"}</h3>
        <Gauge
          style={{ margin: "20px" }}
          value={activeSensor.humidity}
          pvalue={activeSensor.humidity}
          percent={"%"}
        />
      </div>
    );
    voltChart = (
      <div key={"voltChart" + activeSensor.topic}>
        <h3>{"Voltage"}</h3>
        <Gauge
          style={{ margin: "20px" }}
          value={activeSensor.voltage}
          pvalue={Math.round(((activeSensor.voltage - 0) / (240 - 0)) * 100)}
          percent={"V"}
        />
      </div>
    );
    rpmChart = (
      <div key={"rpmChart" + activeSensor.topic}>
        <h3>{"RPM"}</h3>
        <Gauge
          style={{ margin: "20px" }}
          value={activeSensor.rpm}
          pvalue={Math.round(((activeSensor.rpm - 0) / (250 - 0)) * 100)}
          percent={""}
        />
      </div>
    );
    speedChart = (
      <div key={"speedChart" + activeSensor.topic}>
        <h3>{"Material Speed"}</h3>
        <Gauge
          style={{ margin: "20px" }}
          value={activeSensor.speed}
          pvalue={Math.round(((activeSensor.speed - 0) / (20 - 0)) * 100)}
          percent={"mm/sec"}
        />
      </div>
    );
  }

  const charts = (
    <div className="gauage-charts">
      {tempChart}
      {humChart}
      {voltChart}
      {rpmChart}
      {speedChart}
    </div>
  );

  const logSection = map(logs, log => {
    return <p>{log}</p>;
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={ciscologo} alt="cisco logo" className="logo" />
        <h1>IoT Edge Gateway Dashboard</h1>
      </header>
      <div className="sensors-list">
        {(sensorsListUI.length && sensorsListUI) || (
          <h2>{"No sensor detected!"}</h2>
        )}
      </div>
      {activeSensor ? charts : null}
      
      {toggleLog && <div className="log-section">{logSection}</div>}
    </div>
  );
}

export default App;
