import React from 'react'

import './Home.css'
import logo from './assets/logo.png'

function Home() {
	return (
		<div className='bg'>
			<img src={logo} className='image' />
			<h1 className='header'>Mealstone</h1>

			<p className='text'>
				Mealstone is an app that allows you to build productivity through the completion of goals you set. However, unlike
				most apps, it does it in a fun way that allows you to enjoy the process, and it encourages you to keep going on
				your productivity journey. While you are completing goals, you get coins which you can use to buy items for your
				restaurant, and the more goals you complete, the more items you will have and the more complete your restaurant
				will be!
			</p>

			<a className='link' href='https://forms.gle/N7bjjyt2aohvC7eQ6' target="_blank">Ask a question</a>

			<a 
				className='button-primary' 
				target='_blank' 
				href='https://expo.dev/artifacts/eas/giA4PRwah2m11JUiXyqMDa.apk'
			>
				Download on Android
			</a>
			<a 
				className='button-primary'
				target="_blank"
				href='https://apps.apple.com/us/app/mealstone/id6747997769'
			>
				Download on iOS
			</a>
		</div>
	)
}

export default Home