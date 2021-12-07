import React, {useState, useEffect, useRef } from 'react';
import { Observable, fromEvent } from 'rxjs'
import { buffer, debounceTime, filter } from 'rxjs/operators'

import './Styles/App.css';
import Time from './Components/Time'
import MyButton from './Components/UI/Button/MyButton'

function App() {
	const [isTimer, setIsTimer] = useState(false)
	const [time, setTime] = useState({hour: 0, minute: 0, seconds: 0})
	const timer$ = useRef(null)
	const interval$ = useRef(null)
	const btnWait = useRef(null)
	
	useEffect(() => {
		if(isTimer) {
			const doubleClick$ = fromEvent(btnWait.current, 'click')
			doubleClick$.pipe(
			  buffer(doubleClick$.pipe(debounceTime(300))),
			  filter(e => e.length === 2)
			).subscribe(() => setIsTimer(!isTimer))
			
			timer$.current = new Observable(e => {
				interval$.current = setInterval(() => {
					e.next(0)
				}, 1000)
			})
			.subscribe(() => {
				if(time.hour >= 24 && time.minute >= 60 && time.seconds >= 60)
					setTime({hour: 0, minute: 0, seconds: 0})
				else if(time.minute >= 60 && time.seconds >= 60)
					setTime({hour: time.hour+1, minute: 0, seconds: 0})
				else if(time.seconds >= 60)
					setTime({hour: time.hour, minute: time.minute+1, seconds: 0})
				else
					setTime({hour: time.hour, minute: time.minute, seconds: time.seconds+1})
			});
		}
		if(timer$.current)
			return () =>  {
				timer$.current.unsubscribe()
				clearInterval(interval$.current)
			}
		
	})
	
	function timerStart() {
		setIsTimer(!isTimer);
		
		if(isTimer) 
			timerReset()
	}
	
	function timerReset() {
		setTime({hour: 0, minute: 0, seconds: 0})
		
			if(!isTimer)
			setIsTimer(!isTimer)
	}
	
	return (
		<div>
			<div className="timer">
				
				<Time value={time.hour} title={"Hour"}/>
				<Time value={time.minute} title={"Minute"}/>
				<Time value={time.seconds} title={"Seconds"}/>
				
			</div>
			<div className="buttons">
				<MyButton onClick={timerStart}>{isTimer ? "Stop\u23FA" : "Start\uD83D\uDD37"}</MyButton>
				<MyButton ref={btnWait}>{"Wait\u23F8"}</MyButton>
				<MyButton onClick={timerReset}>{"Reset\ud83d\udd01"}</MyButton>
			</div>
		</div>
		
	)
}
export default App
