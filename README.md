# HubSpot Stripe Payments UI Component On Contact Record

This project is a HubSpot UI Extension that displays Stripe payment history for contacts directly in the HubSpot CRM sidebar.

## Features

- Fetches payment history from a custom object associated with contacts.
- Displays summary statistics (total revenue, open payments).
- Shows recent payments with status, amount, paid date, due date, and invoice PDF link.

## Prerequisites

- HubSpot account with access to custom objects and UI extensions.
- Stripe integration set up with HubSpot custom objects.
- Node.js and npm installed.

## Getting Started

1. **Clone the repository:**

   ```sh
   git clone <your-repo-url>
   cd payment-history-extension
   ```
2. **Install dependencies for serverless functions:**

   ```sh
   cd src/app/app.functions
   npm install
   ```
3. **Install dependencies for UI extension:**

   ```sh
   cd ../../extensions
   npm install
   ```
4. **Set your HubSpot Private App Access Token:**

   - Edit `.env` in `src/app/app.functions` and set `PRIVATE_APP_ACCESS_TOKEN` to your HubSpot private app token.
5. **Run the extension locally:**

   ```sh
   hs project dev
   ```

   - This uses the HubSpot CLI to run the extension in development mode.
6. **Deploy to HubSpot:**

   ```sh
   hs project deploy
   ```

## Usage

- The extension will appear as a card in the contact record sidebar in HubSpot.
- It fetches payment history using the serverless function and displays it using the React component in [`PaymentHistoryCard.jsx`](src/app/extensions/PaymentHistoryCard.jsx).

## File Structure

- [`src/app/app.functions/payment-history.js`](src/app/app.functions/payment-history.js): Serverless function to fetch payment data.
- [`src/app/extensions/PaymentHistoryCard.jsx`](src/app/extensions/PaymentHistoryCard.jsx): React component for displaying payment history.
- [`src/app/extensions/payment-history.json`](src/app/extensions/payment-history.json): Card configuration for HubSpot UI extension.

## Note

> This extension works with a HubSpot custom object.
> You must add your custom object ID in the `payment-history.js` file (`src/app/app.functions/payment-history.js`).
> The serverless function uses this ID to fetch payment data associated with contacts.
>
