import { useState, useEffect, useCallback, SetStateAction } from 'react';
import { useInterval } from '../hooks/use-interval';
import { Button } from './button';
import { Timer } from './timer';
import bellStart from '../sounds/Boxing Bell Sound Effect (320).mp3';
import bellFinish from '../sounds/bell-finish.mp3';
import { secondsToTime } from '../utils/seconds-to-time';

const audioStartWorking = new Audio(bellStart)
const audioStopWorking = new Audio(bellFinish)

interface Props {
    longRestTime: SetStateAction<number>;
    pomodoroTime: number;
    shortTimeRest: number;
    longTimeRest: number;
    cycles: number;
}

export function PomodoroTimer(props: Props): JSX.Element {
    const [mainTime, setMainTime] = useState(props.shortTimeRest)
    const [timeCounting, setTimeCounting] = useState(false)
    const [working, setWorking] = useState(false)
    const [resting, setResting] = useState(false)
    const [cycles, setCycles] = useState(new Array(props.cycles - 1).fill(true))
    const [completedCycles, setCompletedCycles] = useState(0);
    const [fullWorkingTime, setFullWorkingTime] = useState(0);
    const [numberPomodoros, setNumberPomodoros] = useState(0);




    useInterval(() => {
        setMainTime(mainTime - 1)
        if (working) setFullWorkingTime(fullWorkingTime + 1)
    }, timeCounting ? 1000 : null,);

    const configureResting = useCallback((Long: boolean) => {
        setTimeCounting(false);
        setWorking(false);
        setResting(true);

        if (Long) {
            setMainTime(props.shortTimeRest)
        } else {
            setMainTime(props.longRestTime)
        }
        audioStopWorking.play()
    }, [props.shortTimeRest, props.longRestTime]);

    const configureWork = useCallback(() => {
        setTimeCounting(false);
        setWorking(true)
        setResting(false)
        setMainTime(props.pomodoroTime)
        audioStartWorking.play()
    }, [setTimeCounting, setWorking, setResting, setMainTime, props.pomodoroTime])

    useEffect(() => {
        if (working) document.body.classList.add('working');
        if (resting) document.body.classList.remove('working');

        if (mainTime > 0) return;

        if (working && cycles.length > 0) {
            configureResting(false);
            cycles.pop();
        } else if (working && cycles.length <= 0) {
            configureResting(true)
            setCycles(new Array(props.cycles - 1).fill(true))
            setCompletedCycles(completedCycles + 1);
        }

        if (working) setNumberPomodoros(numberPomodoros + 1);
        if (resting) configureWork;

    }, [working, resting, mainTime, cycles, setCycles, configureWork, props.cycles, configureResting, completedCycles, numberPomodoros, setNumberPomodoros]);

    return (
        <div className="pomodoro">
            <div className="controls">
                <Button text="Work" onClick={() => configureWork()} />
                <Button text="Rest" onClick={() => configureResting(false)} />
            </div>

            <h2>You are: {working ? 'Working' : 'Resting'}</h2>
            <Timer mainTime={mainTime} />
            <div className="pauseButton">
                <Button
                    className={!working && !resting ? 'hidden' : ''}
                    text={timeCounting ? 'Pause' : 'Play'}
                    onClick={() => setTimeCounting(!timeCounting)} />
            </div>
            <div className="details">
                <p>#{numberPomodoros}</p>
                <p>{secondsToTime(fullWorkingTime)}</p>
            </div>
        </div>
    );
}
