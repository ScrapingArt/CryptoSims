import { useBtc } from '@contexts/BtcContext';
import { useWallet } from '@contexts/WalletContext';

const BtcAmountSlider = () => {
	const { amount, op, setAmount } = useBtc();
	const { balanceFiat, balanceBtc } = useWallet();

	return (
		<div className="flex items-center gap-4 mt-3">
			<button
				onClick={() => {
					if (op === 'buy') {
						setAmount((prev) => Math.max(0, (prev || 0) - 100));
					} else if (op === 'sell') {
						setAmount((prev) =>
							Number(Math.max(0, (prev || 0) - 0.0001).toFixed(8))
						);
					}
				}}
				type="button"
				className="md:mt-1 md:mb-1 py-1 px-2 w-8 md:py-2 md:px-4 md:w-12 bg-accent2 text-white rounded-lg hover:bg-red-700 transition-colors">
				-
			</button>

			<input
				id="amountSlider"
				aria-label="amountSlider"
				type="range"
				min={op === 'buy' ? 0 : 0.0001}
				max={op === 'buy' ? balanceFiat || 0 : balanceBtc || 0}
				step={op === 'buy' ? 100 : 0.0001}
				value={amount}
				aria-valuenow={typeof amount === 'number' ? amount : 0}
				onChange={(e) => setAmount(Number(e.target.value))}
				className="w-full range"
			/>

			<button
				onClick={() => {
					if (op === 'buy') {
						setAmount((prev) =>
							Math.min(balanceFiat || 0, (prev || 0) + 100)
						);
					} else if (op === 'sell') {
						setAmount((prev) =>
							Number(
								Math.min(
									balanceBtc || 0,
									(prev || 0) + 0.0001
								).toFixed(8)
							)
						);
					}
				}}
				type="button"
				className="md:mt-1 md:mb-1 py-1 px-2 w-8 md:py-2 md:px-4 md:w-12 bg-accent2 text-white rounded-lg hover:bg-green-600/75 transition-colors">
				+
			</button>
		</div>
	);
};

export default BtcAmountSlider;
