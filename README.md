# roadsurfer Frontend challenge

## Documentation

This booking app is a <b>Vue.js 3</b> and <b>TypeScript</b> app that allows users to view and manage bookings for various stations. It uses: <br/>

<b>Pinia</b> for state management <br/>
<b>Vitest</b> for unit tests <br/>
<b>Tailwind CSS </b> for styling

### Table of Contents

1. [Overview](#documentation)
2. [Key Features](#key-features)
3. [Data Flow of the Calander page](#data-flow-of-the-calander-page)
4. [Data Flow of the Booking details page](#data-flow-of-the-booking-details-page)
5. [Project Setup](#project-setup)

## Key Features

- Station Selection: Users can select a station using the Autocomplete component. </br>
- Weekly Calendar View: Displays bookings for a week, with the ability to navigate between weeks. </br>
- Booking Display: Shows bookings as draggable items, color-coded for start and end dates. </br>
- Drag and Drop: Allows users to move bookings between days. </br>
- Booking Details: Users can click on a booking to view its details. </br>
- Error Handling: Displays error messages when API calls fail. </br>
- Loading State: Shows a skeleton loader while fetching data.

## Data Flow of the Calander page

On mount, the component fetches initial data, including stations and bookings. </br>
When a user selects a station, it fetches bookings for that station. </br>
Users can navigate between weeks, which updates the displayed bookings. </br>
Drag-and-drop actions update the bookings local state.

## Data Flow of the Booking details page

On mount, the component fetches booking details using the provided stationId and bookingId </br>
The fetched data is stored in the Pinia store </br>
The component reactively displays the data from the store </br>

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
