import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
	apiKey: 'AIzaSyCIxW9uSO_vy77LuZJq7HJpbNcaFywHJKA',
	authDomain: 'projects-40238.firebaseapp.com',
	projectId: 'projects-40238',
	storageBucket: 'projects-40238.appspot.com',
	messagingSenderId: '344130007009',
	appId: '1:344130007009:web:ed92be1391e421a2652ca0',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, db, storage }
