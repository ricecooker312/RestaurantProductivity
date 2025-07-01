import React from 'react'

import './Home.css'
import logo from './assets/logo.png'

function Home() {
	return (
		<div className='bg'>
			<img src={logo} className='image' />
			<h1 className='header'>Restaurant Productivity</h1>

			<a className='button-primary'>Download on Android</a>
			<a className='button-primary'>Download on iOS</a>
		</div>
	)
}

export default Home