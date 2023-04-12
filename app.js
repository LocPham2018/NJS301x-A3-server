const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const app = express();

const productRoute = require('./routes/products');
const authRoute = require('./routes/auth');
const clientRoute = require('./routes/client');
const adminRoute = require('./routes/admin');

const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.tadx3.gcp.mongodb.net/${process.env.MONGO_COLLECTION}`;
const PORT = process.env.PORT || 5000;

const store = new MongoDbStore({
	uri: MONGO_URI,
	collection: 'userSessions',
	expires: 1000 * 60 * 60,
});

app.use(
	cors({
		// origin: 'http://localhost:3000', // development purpose
		origin: [
			'https://njs-asm03-client.netlify.app',
			'https://njs-asm03-admin.netlify.app',
		],
		methods: ['GET', 'POST'],
		credentials: true,
	})
);
// app.use(cors());

app.use(
	session({
		secret: 'dvorak',
		resave: false,
		saveUninitialized: false,
		store,
		cookie: {
			// sameSite: 'lax', // development purpose
			// secure: false, // development purpose
			sameSite: 'none',
			secure: true,
			maxAge: 1000 * 60 * 60,
		},
	})
);

app.all('/', (req, res, next) => {
	res.header('Content-Type', 'application/json');
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');
	next();
});
app.set('trust-proxy', 1);

app.use(express.json());

app.use('/products', productRoute);
app.use('/auth', authRoute);
app.use('/client', clientRoute);
app.use('/admin', adminRoute);

app.use('/', (req, res, next) => {
	res.status(404).json({ message: 'Route not found' });
});

(async () => {
	try {
		await mongoose.connect(MONGO_URI);
		console.log('Connected');
		app.listen(PORT);
	} catch (err) {
		console.log(err);
	}
})();
