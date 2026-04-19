<a id="readme-top"></a>

<div align="center">
  <h3 align="center">Real Madrid Experience</h3>
  <img src="public/media/hero_banner_desktop_14.jpg" alt="Real Madrid Experience cover" width="720" />
  <p align="center">
    A route-based React website inspired by Real Madrid, with an artistic home page, live news, a cloud-backed calendar,
    Google login, import/export in multiple formats, and a Madridista chatbot deployed through Firebase.
  </p>
</div>

## About The Project

Real Madrid Experience is a React + Vite application designed as a polished club-style website instead of a class demo landing page.

The project includes:

* A cinematic home page with layered motion and route-based navigation.
* A live news page based on an RSS source.
* A calendar connected to Firebase and prepared for import/export workflows.
* Login and registration with Firebase Authentication.
* A chatbot with a local development server and Firebase Functions deployment support.
* A store section connected to official product references.

## Built With

* React
* React Router
* Vite
* Firebase
* Express
* Papa Parse
* xml2js
* @e965/xlsx

## Main Routes

* `/` -> home page
* `/actualidad` -> news feed
* `/historia` -> wide-screen history experience
* `/partidos` -> match center
* `/calendario` -> calendar and format import/export
* `/tienda` -> store section
* `/club` -> login, register and profile area
* `/chatbot` -> Madridista assistant

## Project Structure

```text
src/
  components/
  context/
  data/
  hooks/
  lib/
  pages/
  services/
public/
  import-examples/
  media/
functions/
server.js
```

## Environment Setup

### Public client variables

The root `.env.local` is intentionally allowed and used at build time for the client application.

It only contains browser-safe `VITE_*` variables:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_CHATBOT_API_BASE_URL=http://localhost:3001
```

### Chatbot runtime variables

The chatbot runtime does not use `VITE_*` variables.

For local server usage and Firebase Functions deployment, create:

```text
functions/.env
```

You can start from:

```text
functions/.env.example
```

Supported runtime variables:

```env
LLM_PROVIDER=groq
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.0-flash
DEEPSEEK_API_KEY=
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_BASE_URL=https://api.deepseek.com
GROQ_API_KEY=
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_BASE_URL=https://api.groq.com/openai/v1
```

## Local Development

Install dependencies:

```sh
npm install
cd functions && npm install && cd ..
```

Run the frontend only:

```sh
npm run dev
```

Run frontend + local chatbot server:

```sh
npm run dev:full
```

Open:

```text
http://localhost:5173
```

## Calendar Import / Export

The calendar currently supports import and export in these formats:

* `JSON`
* `CSV`
* `XML`
* `XLSX`
* `XLS`
* `ODS`
* `XLSB`
* `FODS`
* `SLK`
* `DIF`
* `HTML`

Example files are available in:

```text
public/import-examples/
```

## Data Architecture

Authentication uses Firebase Authentication with:

* email and password
* Google sign-in

Cloud data uses:

* `users/{uid}` for profile information
* `calendarUserTree/{uid}/savedEvents/{eventId}` for user-saved matches
* `calendarTree/default/events/{eventId}` for the shared calendar tree

Access to the cloud backend is centralized in:

* `src/lib/firebase.js`
* `src/services/`

## Chatbot Deployment On Firebase

The hosted site uses Firebase Hosting for the React app and Firebase Functions for `/api/chatbot`.

Current flow:

* local development can still use `server.js`
* production requests go to the Firebase Function `chatbotApi`
* if `VITE_CHATBOT_API_BASE_URL` still points to `localhost`, the frontend automatically falls back to `/api/chatbot` on hosted environments

## Firebase Deployment

Install the Firebase CLI if needed:

```sh
npm install -g firebase-tools
```

Log in:

```sh
firebase login
```

Install function dependencies once:

```sh
cd functions
npm install
cd ..
```

Deploy hosting, functions and rules:

```sh
firebase deploy
```

If you only want the website and chatbot:

```sh
firebase deploy --only hosting,functions
```

## Scripts

* `npm run dev` -> Vite development server
* `npm run dev:full` -> Vite + local chatbot server
* `npm run build` -> production build
* `npm run preview` -> local preview of the production build
* `npm run lint` -> ESLint validation

## Notes

* The history page is intentionally restricted to wide panoramic ratios.
* The chatbot is safer and more stable behind Firebase Functions than from direct browser calls to an LLM provider.
* The root `.env.local` is now treated as a public client config file.

## Author

Project developed by Raul.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
