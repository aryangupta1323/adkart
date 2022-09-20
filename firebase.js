const firebase = require("firebase");

const firebaseConfig = {
	apiKey: "AIzaSyAICz00oAVCkzupiMum6ul6Tzt9cMLJlNY",
	authDomain: "adkart-8e4d5.firebaseapp.com",
	projectId: "adkart-8e4d5",
	storageBucket: "adkart-8e4d5.appspot.com",
	messagingSenderId: "1010283841692",
	appId: "1:1010283841692:web:411f21248fe22239460559",
	measurementId: "G-LLVPZX72LK",
};

const db = firebase.initializeApp(firebaseConfig);

exports.db = db;
