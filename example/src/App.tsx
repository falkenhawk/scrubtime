import { useState } from 'react';
import { TimePicker } from 'scrubtime';
import 'scrubtime/styles.css';
import './styles.css';

export default function App() {
  const [time1, setTime1] = useState('14:30');
  const [time2, setTime2] = useState('9:00');
  const [time3, setTime3] = useState('20:15');
  const [time4, setTime4] = useState('8:00');
  const [time5, setTime5] = useState('17:45');

  return (
    <div className="app">
      <h1>scrubtime</h1>
      <p className="subtitle">A React time picker with draggable scrubber and slider</p>

      <div className="demos">
        <div className="demo-card">
          <h2>Default</h2>
          <TimePicker
            value={time1}
            onChange={setTime1}
            label="Select time"
          />
          <p className="value">Value: {time1}</p>
        </div>

        <div className="demo-card">
          <h2>6 divisions</h2>
          <TimePicker
            value={time2}
            onChange={setTime2}
            label="Meeting time"
            divisions={6}
          />
          <p className="value">Value: {time2}</p>
        </div>

        <div className="demo-card">
          <h2>5-min steps</h2>
          <TimePicker
            value={time3}
            onChange={setTime3}
            label="Precise time"
            sliderStep={5}
          />
          <p className="value">Value: {time3}</p>
        </div>

        <div className="demo-card">
          <h2>30-min steps</h2>
          <TimePicker
            value={time4}
            onChange={setTime4}
            label="Quick select"
            sliderStep={30}
          />
          <p className="value">Value: {time4}</p>
        </div>

        <div className="demo-card">
          <h2>High sensitivity</h2>
          <TimePicker
            value={time5}
            onChange={setTime5}
            label="Fine control"
            dragSensitivity={6}
          />
          <p className="value">Value: {time5}</p>
        </div>

        <div className="demo-card">
          <h2>Disabled</h2>
          <TimePicker
            value="12:00"
            onChange={() => {}}
            label="Locked time"
            disabled
          />
        </div>
      </div>

      <div className="instructions">
        <h2>How to use</h2>
        <ul>
          <li><strong>Drag hours/minutes</strong> — Click and drag left/right to change values</li>
          <li><strong>Slider</strong> — Quick selection with 15-minute jumps (configurable)</li>
          <li><strong>Minutes overflow</strong> — Dragging past 59 increases the hour automatically</li>
        </ul>
      </div>
    </div>
  );
}
