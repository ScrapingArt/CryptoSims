import { NextApiRequest, NextApiResponse } from 'next';
import getConfig from '@/lib/getConfig';
import connectToDatabase from '@/lib/actions/connectToDatabase';
import { getMethodSchema } from '@/lib/schemas/methodSchema';

const { API_KEY } = getConfig();
const ROUTE_ENABLED = true;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (!ROUTE_ENABLED) {
		return res
			.status(503)
			.json({ error: 'This endpoint is temporarily disabled' });
	}

	try {
		const apiKey = req.headers['x-api-key'];
		if (apiKey !== API_KEY) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		const methodValidation = getMethodSchema.safeParse({
			method: req.method
		});

		if (!methodValidation.success) {
			return res.status(405).json({
				error: 'Method not allowed',
				message: 'This endpoint only accepts GET requests'
			});
		}

		const dbConnected = await connectToDatabase();

		if (!dbConnected.success) {
			return res.stauts(200).json({
				stauts: 'ok',
				database: 'disconneced'
			});
		}

		return res.status(200).json({
			status: 'ok',
			database: 'connected'
		});
	} catch (error) {
		return res.status(500).json({
			status: 'error'
		});
	}
};

export default handler;
