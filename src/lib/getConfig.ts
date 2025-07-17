const getConfig = () => {
	const SECRET_KEY = process.env.SECRET_KEY || 'fallback-dev-only-secret';
	const SECRET_KEY_REFRESH =
		process.env.SECRET_KEY_REFRESH || 'fallback-dev-only-secret';
	const API_KEY = process.env.API_KEY || 'fallback-dev-only-secret';
	const DOMAIN = process.env.DOMAIN || 'localhost';
	const MONGO_DB = process.env.MONGO_DB || 'cryptosims';
	const MONGO_PORT = process.env.MONGO_PORT || '27017';
	const MONGO_USERNAME = process.env.MONGO_USERNAME || 'admin';
	const MONGO_PASSWORD = process.env.MONGO_PASSWORD || 'fallback-dev-only-secret';

	if (
		process.env.NODE_ENV === 'production' &&
		SECRET_KEY === 'fallback-dev-only-secret'
	) {
		throw new Error('Production environment missing SECRET_KEY');
	}

	return {
		SECRET_KEY,
		SECRET_KEY_REFRESH,
		API_KEY,
		MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017',
		DOMAIN,
		MONGO_DB,
		MONGO_PORT,
		MONGO_USERNAME,
		MONGO_PASSWORD
	};
};

export default getConfig;
