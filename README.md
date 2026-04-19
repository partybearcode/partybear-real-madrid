<a id="readme-top"></a>

<div align="center">
  <h1 align="center">Real Madrid Experience</h1>
  <p align="center">
    React + Firebase web application inspired by an artistic Real Madrid digital experience.
    <br />
    <a href="https://partybear-real-madrid.web.app/"><strong>Live site</strong></a>
  </p>
</div>

## Table of Contents

1. [About The Project](#about-the-project)
2. [Main Page Description](#main-page-description)
3. [Current Features](#current-features)
4. [Third-Party Components](#third-party-components)
5. [Tutorials and References](#tutorials-and-references)
6. [Firebase Data Architecture](#firebase-data-architecture)
7. [Calendar Import / Export](#calendar-import--export)
8. [Project Structure](#project-structure)
9. [Author](#author)

## About The Project

Real Madrid Experience is a route-based React project built with Vite and Firebase. The goal is to recreate a modern Real Madrid website with a more artistic and immersive front-end approach while keeping a functional application structure behind it.

The project includes:

* an animated home page with a cinematic hero
* a news page fed from an RSS source
* a history page for wide panoramic devices
* a matches and calendar area connected to Firebase
* login and registration with Firebase Authentication
* a store page with official reference links
* a chatbot page prepared for Firebase Functions

## Main Page Description

The main page is the route `/`.

It is designed as the visual entry point of the whole project and includes:

* a layered hero section with motion and visual depth
* direct access to the club sections
* match and calendar highlights
* club-related editorial blocks with a cleaner, more minimal layout

The home page is not a placeholder landing page. It acts as the main navigation and presentation layer of the application, combining the artistic style of the project with practical access to the rest of the routes.

## Current Features

* React Router structure with separated `pages` and `components`
* Firebase Authentication with email/password and Google sign-in
* Firebase Firestore calendar storage
* import/export workflow connected to Firebase data
* chatbot prepared for Firebase Functions deployment
* store section with curated official Real Madrid product references
* responsive layout with mobile and desktop navigation

## Third-Party Components

These third-party libraries and services are used in the project:

* React: https://react.dev/
* React Router: https://reactrouter.com/
* Firebase Web SDK: https://firebase.google.com/docs/web/setup
* Firebase Hosting: https://firebase.google.com/docs/hosting
* Firebase Functions: https://firebase.google.com/docs/functions
* Papa Parse for CSV import/export: https://www.papaparse.com/
* xml2js for XML export generation: https://www.npmjs.com/package/xml2js
* `@e965/xlsx` for spreadsheet formats such as XLSX, XLS and ODS: https://www.npmjs.com/package/@e965/xlsx
* Express for the chatbot server shape: https://expressjs.com/

## Tutorials and References

References and tutorials that helped structure the project:

* README structure reference: https://github.com/othneildrew/Best-README-Template
* Firebase Hosting quickstart: https://firebase.google.com/docs/hosting/quickstart
* Firebase Authentication web start: https://firebase.google.com/docs/auth/web/start
* Firestore web start: https://firebase.google.com/docs/firestore/quickstart
* React Router documentation: https://reactrouter.com/start/declarative/installation
* Vite guide: https://vite.dev/guide/

## Firebase Data Architecture

All Firebase access used by the application is centralized in the `src/services` folder.

Main service files:

* [src/services/authService.js](src/services/authService.js)
* [src/services/calendarTreeService.js](src/services/calendarTreeService.js)
* [src/services/teamBadgeService.js](src/services/teamBadgeService.js)

Low-level Firebase initialization is kept in:

* [src/lib/firebase.js](src/lib/firebase.js)

Pages and components do not call Firebase SDK functions directly. They consume reusable service functions through hooks and context.

### Firestore Structure

The imported/exported calendar data is stored in Firebase, not only in local state.

Main collections:

* `users/{uid}` for profile data
* `calendarUserTree/{uid}/savedEvents/{eventId}` for saved user matches
* `calendarTree/default` for calendar metadata
* `calendarTree/default/events/{eventId}` for imported calendar events

### Import / Export Flow

The application imports a file, normalizes the data, and writes the resulting events into Firestore. Exported files are generated from the dynamic calendar currently loaded in the app, which comes from Firebase.

This satisfies the requirement that imported/exported data must be stored in Firebase.

## Calendar Import / Export

The calendar supports import and export in these formats:

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

That means the page can import/export more than 10 formats.

### Required Example Files

Required sample links for the delivery:

* [datos.csv](public/import-examples/datos.csv)
* [datos.xml](public/import-examples/datos.xml)
* [datos.json](public/import-examples/datos.json)

Additional sample files available in the project:

* [datos.xlsx](public/import-examples/datos.xlsx)
* [datos.xls](public/import-examples/datos.xls)
* [datos.ods](public/import-examples/datos.ods)
* [datos.xlsb](public/import-examples/datos.xlsb)
* [datos.fods](public/import-examples/datos.fods)
* [datos.slk](public/import-examples/datos.slk)
* [datos.dif](public/import-examples/datos.dif)
* [datos.html](public/import-examples/datos.html)

### Required Dynamic Export

The application exports dynamically generated files from the current calendar data in Firebase in these required formats:

* `datos.csv`
* `datos.xml`
* `datos.json`

Those exports are triggered from the calendar page and generated from the current event data loaded by the application.

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

Structure notes:

* `pages` contains route-level views
* `components` contains reusable UI parts
* `hooks` contains reusable state and logic
* `services` centralizes Firebase and data-access logic
* `functions` contains the Firebase chatbot backend

## Author

Project developed by Raul.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
