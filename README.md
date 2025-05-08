# Friskly - AI-Powered Calorie Tracking App

Friskly is a mobile app for iOS that uses AI-powered image recognition to log meals, estimate nutrition, and provide coaching. Users complete daily missions, earn rewards, and track progress toward fitness goals.

## 🚀 Features

- **AI-Powered Meal Logging**: Capture meal images via camera/gallery, with AI identifying food items and estimating calories/macros
- **Daily Tracking Dashboard**: Visual charts for daily/weekly trends and progress tracking
- **AI Coach**: Chat interface for diet/fitness questions with personalized advice
- **Missions & Progression**: Daily goals with XP-based leveling system and badges/rewards
- **Reward Redemption**: Earn in-app currency for engagement to redeem for fitness products
- **Real-Time Sync**: Backend sync with Supabase for meals, progress, and rewards

## 🛠️ Tech Stack

- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **Navigation**: Expo Router
- **UI Library**: React Native Paper
- **Backend/Auth**: Supabase (authentication, storage, real-time updates)
- **Deployment**: Expo Go

## 📱 Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI

### Installation

```sh
# Clone the repository
git clone [repository-url]
cd Friskly

# Install dependencies
npm install

# Start the development server
npm start
```

### Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Replace the placeholder values in `lib/supabase.ts` with your Supabase URL and anon key

## 📝 Development Notes

- The app uses file-based routing with Expo Router
- React Native Paper is used for UI components and theming
- Supabase handles authentication, data storage, and real-time updates

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Supabase Documentation](https://supabase.com/docs)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
