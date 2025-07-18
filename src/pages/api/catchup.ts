import { NextApiRequest, NextApiResponse } from 'next';
import getConfig from '@lib/getConfig';
import { postMethodSchema } from '@schemas/methodSchema';
import connectToDatabase from '@actions/connectToDatabase';
import catchup from '@actions/catchup';

const { API_KEY } = getConfig();
const ROUTE_ENABLED = true;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (!ROUTE_ENABLED) {
		return res
			.status(503)
			.json({ error: 'This endpoint is temporarily disabled' });
	}

	try {
		const methodValidation = postMethodSchema.safeParse({
			method: req.method
		});

		if (!methodValidation.success) {
			return res.status(405).json({
				error: 'Method not allowed',
				message: 'This endpoint only accepts POST requests'
			});
		}

		const apiKey = req.headers['x-api-key'];
		if (apiKey !== API_KEY) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		const dbConnected = await connectToDatabase();

		if (!dbConnected.success) {
			return res.status(500).json({
				error: 'Connection to the database failed'
			});
		}

		await catchup();
		return res
			.status(200)
			.json({ message: 'Successfully updated database' });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

export default handler;
