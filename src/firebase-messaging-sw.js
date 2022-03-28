importScripts('https://www.gstatic.com/firebasejs/4.4.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.4.0/firebase-messaging.js');

var config = {
	apiKey: "AIzaSyBJYyENfgmKQSQsE8D6W6n_Z1p282ZZc1M",
	authDomain: "fir-pwa-fd3e4.firebaseapp.com",
	projectId: "fir-pwa-fd3e4",
	storageBucket: "fir-pwa-fd3e4.appspot.com",
	messagingSenderId: "696056207587",
	appId: "1:696056207587:web:e2d3f830dff7c703a44dd6",
	measurementId: "G-XYPJ6DTKMK"
};
firebase.initializeApp(config);

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
	const title = 'Hello World';
	const options = {
		body: payload.data.body
	};
	return self.registration.showNotification(title, options);
});