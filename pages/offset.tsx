import { NextPage } from "next";
import { Web3AuthProvider } from "../providers/web3AuthProvider";
import { GoogleAuthProvider } from "../providers/googleAuthProvider";
import Offset from "../components/offset";


const Home: NextPage = () => {
    return (
        // <Web3AuthProvider web3AuthNetwork="testnet">
            <GoogleAuthProvider>
                <Offset />
            </GoogleAuthProvider>
        // </Web3AuthProvider>
    )
}

export default Home;