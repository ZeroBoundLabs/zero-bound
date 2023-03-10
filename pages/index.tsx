import { NextPage } from "next";
import { Web3AuthProvider } from "../services/web3AuthProvider";
import { GoogleAuthProvider } from "../services/googleAuthProvider";
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