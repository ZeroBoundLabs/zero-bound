import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <title>Gmail Flight Reservations</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <body className='bg-gray-100'>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
