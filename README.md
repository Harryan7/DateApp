# Welcome to my Expo app 👋


## Get started

# Dating App

A mobile dating application built with React Native and Expo. Users can discover potential matches, like or reject profiles, chat with matches, and manage their profile.

## Features

- User authentication with Firebase
- Profile creation and management
- Swipe-based discovery
- Likes and matches system
- Real-time messaging
- Multilingual support (English and Turkish)
- Dark/Light mode support

### Random Matching Feature

The app includes a random matching feature that works as follows:

- Users are randomly matched with other users daily between 12 PM and 6 PM
- Users receive a notification when they have a new random match
- Both users must accept the match within 6 hours for the match to be confirmed
- If either user rejects or no response is given within 6 hours, the match is automatically canceled
- Once both users accept, they can start messaging each other

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository
2. Install dependencies
   ```
   npm install
   ```
3. Add your Firebase configuration to `firebase.ts`
4. Start the development server
   ```
   npm start
   ```

## Project Structure

- `/app` - Main application screens and navigation
- `/components` - Reusable UI components
- `/constants` - Application constants
- `/hooks` - Custom React hooks
- `/services` - API and Firebase services
- `/assets` - Images, fonts, and other static assets
- `/locales` - Translation files

## Firebase Setup

The app uses Firebase for:
- Authentication
- Firestore Database (user profiles, matches, messages)
- Storage (profile pictures)
- Cloud Functions (random matching algorithm)

## Cloud Functions

Two scheduled Cloud Functions handle the random matching feature:
1. `createRandomMatches` - Creates random matches between active users daily
2. `processExpiredMatches` - Checks for expired matches and updates their status

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
