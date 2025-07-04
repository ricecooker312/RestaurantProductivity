import React from 'react'

import './Home.css'
import logo from './assets/logo.png'

function Home() {
	return (
		<div className='bg'>
			<img src={logo} className='image' />
			<h1 className='header'>Restaurant Productivity</h1>

			<a className='link' href='https://forms.gle/N7bjjyt2aohvC7eQ6' target="_blank">Ask a question</a>

			<a 
				className='button-primary' 
				target='_blank' 
				href='https://expo.dev/artifacts/eas/956ZgLByEpzCDXsh8S3FXC.apk'
			>
				Download on Android
			</a>
			<a 
				className='button-primary'
				target="_blank"
			>
				Download on iOS
			</a>
		</div>
	)
}

export default Home