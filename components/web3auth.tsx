// import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from "@web3auth/base";
// import { Web3Auth } from "@web3auth/modal";
// import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
// import { useEffect, useState } from "react"

// const WEB3CLIENT_ID = 'BP8dG770wPx1JrN0eYwqVcv5ZDZPwQwh0Oab9rKCnXxmWpjNguHlnLyNuBQwSTt0qpMX83Q6yy2bMHF3IG91di8';
// const GOOGLE_CLIENT_ID = '252338596235-ekpmn2hjjv8uqrs7vons06lmdjhtdqu8.apps.googleusercontent.com';
// type LOGIN_PROVIDER_TYPE = 'google' | 'email_passwordless';

// interface Web3LoginProps {
//     isLoggedIn: boolean
// }

// const Web3Login = ({ isLoggedIn }: Web3LoginProps ) => {
//     const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);
//     const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
//     // const [web3auth, setWeb3auth] = useState<Web3AuthCore | null>(null);

//     useEffect(() => {
//         const init = async () => {
//           try {
//             const web3auth = new Web3Auth({
//               clientId: WEB3CLIENT_ID,
//               web3AuthNetwork: 'testnet',
//               chainConfig: {
//                 chainNamespace: CHAIN_NAMESPACES.EIP155,
//                 chainId: '0x1',
//                 // rpcTarget: 'https://rpc.ankr.com/eth'
//               },
//               // uiConfig: {
//               //   theme: 'dark',
//               //   loginMethodsOrder: ['google'],
//               //   appLogo: 'https://web3auth.io/images/w3a-L-Favicon-1.svg'
//               // }
//             });
    
//             const openloginAdapter = new OpenloginAdapter({
//               loginSettings: { loginProvider: 'google' },
//               adapterSettings: {
//                 // whiteLabel: {
//                 //   name: 'Your app Name SAMSOFT',
//                 //   logoLight: 'https://web3auth.io/images/w3a-L-Favicon-1.svg',
//                 //   logoDark: 'https://web3auth.io/images/w3a-D-Favicon-1.svg',
//                 //   defaultLanguage: 'en',
//                 //   dark: true,              
//                 // },
//                 loginConfig: {
//                   google: {
//                     name: 'Google Login',
//                     verifier: 'flight-google-verifier',
//                     typeOfLogin: 'google',
//                     clientId: GOOGLE_CLIENT_ID,
//                   }
//                 },            
//               }
//             })
    
//             web3auth.configureAdapter(openloginAdapter);
            
//             setWeb3auth(web3auth);
    
//             await web3auth.initModal()
//             setProvider(web3auth.provider);
//           } catch (err: any) {
//             console.log(err.message)
//           }
//         }
    
//         init()
//     }, [])

//     const web3Login = async () => {
//         if (!web3auth) {
//             console.log("web3auth not initialized yet");
//             return;
//         }
//         const web3authProvider = await web3auth.connect();
//         setProvider(web3authProvider);
//         // await validateIdToken();
//     };

//     const onSignout = () => {}

//     return (
//         <>
//           <button onClick={web3Login}>{isLoggedIn ? 'Change User' : 'Web Login'}</button>
//           {isLoggedIn && (
//             <button className='ml-auto' onClick={onSignout}>
//               Signout
//             </button>
//           )}        
//         </>
//     )
    
// }

// export default  Web3Login;
export {}