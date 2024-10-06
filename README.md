# Flight Carbon Offset Tracker

Flight Carbon Offset Tracker is an open-source application that securely reads your Gmail or G Suite account to extract flight confirmation emails, compile a list of your flights, calculate the total carbon emissions from those flights, and provide options to offset the carbon footprint. This project is currently a **work in progress** and aims to integrate with the Ethereum Attestation Service (EAS) to create blockchain attestations of your carbon footprint and the corresponding offsets.

## Table of Contents

- [Features](#features)
- [Security](#security)
- [Installation](#installation)
- [Usage](#usage)
- [Future Plans](#future-plans)
- [Contributing](#contributing)
- [License](#license)

## Features

- OAuth-based Gmail or G Suite access.
- Reads flight confirmation emails from your inbox.
- Generates a list of all flights you've taken.
- Calculates the carbon footprint of your flights.
- Provides options to offset the calculated carbon emissions.
- Plans to integrate with [Ethereum Attestation Service (EAS)](https://attestations.ethereum.org/) to record flight and offset data.

## Security

The application requires high-level permission to **read your emails**. It only accesses flight confirmation emails and does not store or access any other email data. However, given the high-security nature of email access, we recommend using the application carefully and only after reviewing its source code.

## Installation

### Prerequisites

- Node.js >= v14
- Google Cloud Platform (GCP) credentials for OAuth

### Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/flight-carbon-offset-tracker.git
    cd flight-carbon-offset-tracker
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up your Google OAuth credentials by following [this guide](https://developers.google.com/identity/protocols/oauth2).
   - You'll need to enable Gmail API and set up OAuth credentials on the GCP console.

4. Create a `.env` file to store your credentials:
    ```bash
    GMAIL_CLIENT_ID=your-client-id
    GMAIL_CLIENT_SECRET=your-client-secret
    GMAIL_REDIRECT_URI=your-redirect-uri
    ```

5. Start the application:
    ```bash
    npm start
    ```

## Usage

Once the application is running, it will prompt you to authenticate with your Gmail or G Suite account via OAuth. After authentication, it will scan your emails for flight confirmation messages and display a list of all your flights along with the carbon footprint of each flight.

You will also be able to choose from various carbon offsetting options, which will be factored into the final calculations. Future updates will include generating attestations on the Ethereum blockchain using the Ethereum Attestation Service (EAS).

## Future Plans

- **Ethereum Attestation Service (EAS) Integration**: Automatically create blockchain-based attestations of your flights and carbon offsets.
- **Flight Offset Marketplace**: Integration with third-party services to provide multiple carbon offsetting options.
- **Improved Email Parsing**: Enhanced algorithms to detect a wider range of flight confirmation formats.

## Contributing

Contributions are welcome! Feel free to submit pull requests or open issues to help improve the project.

1. Fork the repo.
2. Create a new branch:
    ```bash
    git checkout -b feature-branch
    ```
3. Make your changes and commit:
    ```bash
    git commit -m "Add some feature"
    ```
4. Push to the branch:
    ```bash
    git push origin feature-branch
    ```
5. Submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting this app up and running Started

You will need to register with the relevant google apis also, but this is the NextJs part:

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
