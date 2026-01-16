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
      <header className="header">
        <div>
          <h1>scrubtime</h1>
          <p className="subtitle">A React time picker with draggable scrubber and slider — minimal clicks, maximum control.</p>
        </div>
        <a href="https://github.com/falkenhawk/scrubtime" className="github-link" target="_blank" rel="noopener noreferrer" aria-label="View on GitHub">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </a>
      </header>

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
