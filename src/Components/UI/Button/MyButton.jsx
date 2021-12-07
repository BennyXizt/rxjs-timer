import React from 'react'
import classes from './MyButton.module.css'

const MyButton = React.forwardRef((props, ref) =>  {
	return (
		<button {...props} ref={ref}  className={classes.btn} >
			{props.children}
		</button>
	)
})

export default MyButton