import type {Metadata} from 'next';
import {WalletUnpackWelcome} from './WalletUnpackWelcome';
export const metadata:Metadata={title:'Wallet · Unpack Welcome',description:'A card, a croc-grain wallet, and a little welcome. Adapted from Native Cook.'};
export default function WalletUnpackWelcomePage(){return <WalletUnpackWelcome autoPlay/>;}
