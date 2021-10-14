import { useState, useEffect, useRef } from 'react'
import './App.css'
import 'materialize-css/dist/css/materialize.min.css'

const breakAudio =
  "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav";


function App() {
  const [displayTime, setdisplayTime] = useState(25 * 60);
  const [breakTime, setbreakTime] = useState(5 * 60);
  const [sessionTime, setsessionTime] = useState(25 * 60);
  const [timerOn, setTimerOn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);

  let player = useRef(null);

  useEffect(() => {
    if (displayTime <= 0) {
      setOnBreak(true);
      breakSound();
    } else if (!timerOn && displayTime === breakTime) {
      setOnBreak(false);
    }
  }, [displayTime, onBreak, timerOn, breakTime, sessionTime]);

  const breakSound = () => {
    player.currentTime = 0;
    player.play();
  };

  const formatdisplayTime = (time) => {
    let mins = Math.floor(time / 60);
    let secs = time % 60;
    return (
      (mins < 10 ? "0" + mins : mins) + ":" + (secs < 10 ? "0" + secs : secs)
    );
  };

  const formatTime = (time) => {
    return time / 60;
  };

  const changeTime = (amount, type) => {
    if (type === "break") {
      if ((breakTime <= 60 && amount < 0) || breakTime >= 60 * 60) {
        return;
      }
      setbreakTime((prev) => prev + amount);
    } else {
      if ((sessionTime <= 60 && amount < 0) || sessionTime >= 60 * 60) {
        return;
      }
      setsessionTime((prev) => prev + amount);
      if (!timerOn) {
        setdisplayTime(sessionTime + amount);
      }
    }
  };

  const controlTime = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVariable = onBreak;

    if (!timerOn) {
      let interval = setInterval(() => {
        date = new Date().getTime();
        if (date > nextDate) {
          setdisplayTime((prev) => {
            if (prev <= 0 && !onBreakVariable) {
              onBreakVariable = true;
              return breakTime;
            } else if (prev <= 0 && onBreakVariable) {
              onBreakVariable = false;
              setOnBreak(false);
              return sessionTime;
            }
            return prev - 1;
          });
          nextDate += second;
        }
      }, 30);
      localStorage.clear();
      localStorage.setItem("interval-id", interval);
    }
    if (timerOn) {
      clearInterval(localStorage.getItem("interval-id"));
    }
    setTimerOn(!timerOn);
  };

  const resetTime = () => {
    clearInterval(localStorage.getItem("interval-id"));
    setdisplayTime(25 * 60);
    setbreakTime(5 * 60);
    setsessionTime(25 * 60);
    player.pause();
    player.currentTime = 0;
    setTimerOn(false);
    setOnBreak(false);
  };

  return (
    <div className='center-align'>
      <h1>5 + 5 Clock</h1>
      <div className="dual-container">

      <Length
        title={'Break Length'}
        changeTime={changeTime}
        type={'break'}
        time={breakTime}
        formatTime={formatTime}
        formatdisplayTime={formatdisplayTime} />
      <Length
        title={'Session Length'}
        changeTime={changeTime}
        type={'session'}
        time={sessionTime}
        formatTime={formatTime}
        formatdisplayTime={formatdisplayTime} />
      </div>

      <div className="timer-displayTime">
        <h1 id="timer-label">{onBreak ? "Break" : "Session"}</h1>
        <h1 id="time-left">{formatdisplayTime(displayTime)}</h1>
        <button id="start_stop" className="btn-large teal lighten-2" onClick={controlTime}>
          {timerOn ? (
            <i className="material-icons">pause_circle_filled</i>
          ) : (
            <i className="material-icons">play_circle_filled</i>
          )}
        </button>
        <button id="reset" className="btn-large teal lighten-2" onClick={resetTime}>
          <i className="material-icons">autorenew</i>
        </button>
        <audio ref={(t) => (player = t)} src={breakAudio} id="beep" />
    </div>
    </div>
  )
}

function Length ({title, changeTime, type, time, formatTime}) {
  return (
    <div className='break-time-set'>
      <h3 id={type === "break" ? "break-label" : "session-label"}>{title}</h3>
      <button 
        id={type === "break" ? "break-decrement" : "session-decrement"}
        className='btn-small teal lighten-2'
        onClick={() => changeTime(-60, type)}>
          <i className='material-icons'>arrow_downward</i>
      </button>
      <h3 id={type === "break" ? "break-length" : "session-length"}>{formatTime(time)}</h3>
      <button 
        id={type === "break" ? "break-increment" : "session-increment"}
        className='btn-small teal lighten-2'
        onClick={() => changeTime(60, type)}>
        <i className='material-icons'>arrow_upward</i>
      </button>
    </div>
  )
}

export default App
