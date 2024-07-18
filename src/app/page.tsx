import { ConnectButton,getBlockHeight } from "./layout";
import BlockHeight from "./getblock";
import TransferEvents from "./transfer_event";


export default function Home() {

	return (
		<div>

			<h1 className="text-3xl font-bold underline">Block info</h1>
			<BlockHeight />
			<ConnectButton />
			<TransferEvents />
			
		</div>
	)
}
