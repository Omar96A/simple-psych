# Nordstrom NYC Inventory Bot

Small Node app that checks a Nordstrom product against tracked New York City Nordstrom stores and shows:

- whether the item is in stock locally
- how many units are available
- which sizes are available
- how many miles away the store is from the user's current location

## What it does

1. Accepts a Nordstrom product URL from the browser UI.
2. Uses browser geolocation to capture the user's current location.
3. Loads the product page and tries to extract product identifiers.
4. Queries live store availability for a curated list of NYC Nordstrom stores.
5. Sorts in-stock stores by nearest distance.

## Store coverage

The bot currently tracks these New York City stores:

- Nordstrom NYC Flagship
- Nordstrom Men's Store NYC
- Nordstrom Rack Union Square
- Nordstrom Rack 31st & 6th

You can add more in [`src/data/nycStores.js`](/Users/omaralzein/Desktop/Shopping delivery/src/data/nycStores.js).

## Run it

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

Then open `http://127.0.0.1:3000`.

## Nordstrom anti-bot note

Nordstrom may serve an anti-bot challenge to server-side requests. The app includes a `puppeteer-core` fallback that can use your local Chrome install.

Helpful environment variables:

- `CHROME_PATH`: path to Chrome if it is not in the default macOS location
- `HEADLESS=false`: opens a visible Chrome window, which can help if Nordstrom blocks headless browsing
- `PORT`: override the server port
- `HOST`: override the host binding, default `127.0.0.1`

Example:

```bash
HEADLESS=false npm start
```

If Nordstrom still redirects to a challenge page, complete the challenge in the opened Chrome window and retry the lookup.
