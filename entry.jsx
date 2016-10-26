import React from 'react';
import ReactDOM from 'react-dom';
import App from './app.jsx';



document.addEventListener("DOMContentLoaded", () => {
	const root = document.querySelector('#root');
	ReactDOM.render(<App/>, root);
});
