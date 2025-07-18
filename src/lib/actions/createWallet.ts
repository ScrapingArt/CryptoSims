'use server';

import * as bip39 from 'bip39';
import Wallet from '@models/wallet';
import connectToDatabase from '@lib/actions/connectToDatabase';
import isAuth from './isAuth';

function generateRandomInteger(min: number, max: number) {
	return Math.floor(min + Math.random() * (max - min + 1));
}

const createWallet = async () => {
	await connectToDatabase();

	const authenticated = await isAuth();
	if (authenticated) {
		return { error: 'Already authenticated' };
	}

	try {
		let seedPhrase: string = bip39.generateMnemonic(128);
		let existingWallet = await Wallet.findBySeedPhrase(seedPhrase);

		let attempts = 0;
		const MAX_ATTEMPTS = 5;

		while (existingWallet && attempts < MAX_ATTEMPTS) {
			seedPhrase = bip39.generateMnemonic(128);
			existingWallet = await Wallet.findBySeedPhrase(seedPhrase);
			attempts++;
		}

		if (attempts >= MAX_ATTEMPTS) {
			return {
				error: 'Failed to generate a unique seed phrase after multiple attempts'
			};
		}

		const balanceFiat = generateRandomInteger(0, 1000);
		const wallet = new Wallet({
			seedPhrase,
			balanceFiat,
		});

		await wallet.save();

		return { seedPhrase, balanceFiat };
	} catch (error) {
		console.error(error);
		return { error: 'Failed to create new wallet' };
	}
};

export default createWallet;
