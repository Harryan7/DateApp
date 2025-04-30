# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

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
