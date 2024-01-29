import React, { useState, useEffect } from 'react';

const PomodoroTimer = () => {
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(5);
    const [isActive, setIsActive] = useState(false);
    const [customTime, setCustomTime] = useState(0);
    const [isCustomizing, setIsCustomizing] = useState(false);

    const endSound = new Audio('/Treasure.mp3');

    useEffect(() => {
        endSound.load();
        const handleLoad = () => {
            // console.log('Audio is ready for playback');
            endSound.removeEventListener('canplaythrough', handleLoad);
        };

        endSound.addEventListener('canplaythrough', handleLoad);

        return () => {
            endSound.pause();
            endSound.currentTime = 0;
            endSound.removeEventListener('canplaythrough', handleLoad);

        };
    }, [endSound]);

    useEffect(() => {
        let interval;

        if (isActive && (minutes > 0 || seconds > 0)) {
            interval = setInterval(() => {
                if (seconds === 0) {
                    if (minutes === 0) {
                        clearInterval(interval);
                        setIsActive(false);
                    } else {
                        setMinutes((prevMinutes) => prevMinutes - 1);
                        setSeconds(59);
                    }
                } else {
                    setSeconds((prevSeconds) => prevSeconds - 1);
                }
            }, 1000);
        } else if (isActive && minutes === 0 && seconds === 0) {
            clearInterval(interval);
            setIsActive(false);
            playEndSound();
        }

        return () => clearInterval(interval);
    }, [isActive, minutes, seconds, endSound]);

    const playEndSound = () => {
        // console.log('Trying to play end sound');
        if (endSound.readyState === 4) {
            endSound.play().catch(error => console.error('Error playing end sound:', error));
        } else {
            // console.log('Audio is not ready, retrying in 500 milliseconds');
            setTimeout(() => {
                playEndSound(); 
            }, 500);
        }
    };


    const startStopTimer = () => {
        setIsActive((prevIsActive) => !prevIsActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setMinutes(0);
        setSeconds(5);
    };

    const handleCustomize = () => {
        setIsCustomizing(true);
        setCustomTime(minutes * 60 + seconds);
    };

    const saveCustomTime = () => {
        setMinutes(Math.floor(customTime / 60));
        setSeconds(customTime % 60);
        setIsCustomizing(false);
    };

    const handleChangeCustomTime = (event) => {
        setCustomTime(event.target.value);
    };

    return (
        <div>
            <div className='Header'>
                {/* <button onClick={playEndSound}>Play Buzzer</button> */}
                <h1>Pomodoro Timer</h1>
                <h1>
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </h1>
            </div>
            <div>
                {isCustomizing ? (
                    <div>
                        <input
                            type="number"
                            value={customTime}
                            onChange={handleChangeCustomTime}
                            className='setTimer'
                        />
                        <button onClick={saveCustomTime}>Save</button>
                    </div>
                ) : (
                    <div>
                        <button onClick={startStopTimer} className='start'>{isActive ? 'Stop' : 'Start'}</button>
                        <button onClick={resetTimer} className='reset'>Reset</button>
                        <button onClick={handleCustomize} className='customize'>Customize</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PomodoroTimer;
