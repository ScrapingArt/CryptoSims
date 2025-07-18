import mongoose from 'mongoose';
import getConfig from './getConfig';

mongoose.connection.setMaxListeners(10);

const { MONGO_DB, MONGO_PORT, MONGO_USERNAME, MONGO_PASSWORD } = getConfig();

const buildMongoUri = () => {
	if (!MONGO_USERNAME || !MONGO_PASSWORD) {
		throw new Error('MONGO_USERNAME and MONGO_PASSWORD environment variables are required');
	}

	const host = "mongodb";

	return `mongodb://${encodeURIComponent(MONGO_USERNAME)}:${encodeURIComponent(MONGO_PASSWORD)}@${host}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
};

const MONGODB_URI = buildMongoUri();

const options = {
	dbName: 'cryptosims',
	bufferCommands: true,
	autoIndex: true,
	maxPoolSize: 10,
	serverSelectionTimeoutMS: 5000,
	socketTimeoutMS: 45000,
	authSource: 'admin'
};

interface CachedMongoose {
	conn: typeof mongoose | null;
	promise: Promise<typeof mongoose> | null;
}

interface MongoDbService {
	connect: () => Promise<typeof mongoose>;
	disconnect: () => Promise<void>;
}

const cached: { mongoose: CachedMongoose } = {
	mongoose: {
		conn: null,
		promise: null
	}
};

let listenersAdded = false;

const handleConnected = () => console.log('MongoDB connected successfully');
const handleError = (error: Error) =>
	console.error('MongoDB connection error:', error);
const handleDisconnected = () => console.log('MongoDB connection lost');

const addConnectionHandlers = () => {
	if (listenersAdded) return;

	mongoose.connection.on('connected', handleConnected);
	mongoose.connection.on('error', handleError);
	mongoose.connection.on('disconnected', handleDisconnected);

	listenersAdded = true;
};

const removeConnectionHandlers = () => {
	mongoose.connection.off('connected', handleConnected);
	mongoose.connection.off('error', handleError);
	mongoose.connection.off('disconnected', handleDisconnected);

	listenersAdded = false;
};

const validateConfig = () => {
	if (!MONGO_USERNAME) {
		throw new Error('MONGO_USERNAME environment variable is not set');
	}
	if (!MONGO_PASSWORD) {
		throw new Error('MONGO_PASSWORD environment variable is not set');
	}
	if (!MONGODB_URI) {
		throw new Error('MongoDB URI could not be constructed');
	}
};

export const connect = async () => {
	if (cached.mongoose.conn) {
		return cached.mongoose.conn;
	}

	validateConfig();

	if (!cached.mongoose.promise) {
		addConnectionHandlers();

		cached.mongoose.promise = mongoose
			.connect(MONGODB_URI, options)
			.then((mongoose) => {
				return mongoose;
			});
	}

	try {
		cached.mongoose.conn = await cached.mongoose.promise;
		return cached.mongoose.conn;
	} catch (error) {
		cached.mongoose.promise = null;
		throw new Error(`Database connection failed: ${error}`);
	}
};

export const disconnect = async () => {
	if (cached.mongoose.conn) {
		await mongoose.disconnect();
		cached.mongoose.conn = null;
		cached.mongoose.promise = null;
		removeConnectionHandlers();
	}
};

process.on('SIGINT', async () => {
	await disconnect();
	process.exit(0);
});

process.on('SIGTERM', async () => {
	await disconnect();
	process.exit(0);
});

const mongoDbService: MongoDbService = {
	connect,
	disconnect
};

export default mongoDbService;
