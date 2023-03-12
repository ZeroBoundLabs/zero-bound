import { NextPage } from "next";
import { Web3AuthProvider } from "../providers/web3AuthProvider";
import { GoogleAuthProvider } from "../providers/googleAuthProvider";
import Main from "../components/main";


const Home: NextPage = () => {
    return (
        // <Web3AuthProvider web3AuthNetwork="testnet">
            <GoogleAuthProvider>
                <Main />
            </GoogleAuthProvider>
        // </Web3AuthProvider>
    )
}

export default Home;