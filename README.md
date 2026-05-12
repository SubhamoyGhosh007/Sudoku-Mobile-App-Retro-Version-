# Sudoku Retro Mobile 🎮

A fully functional, retro-styled Sudoku mobile application built with **Expo** and **React Native**. Enjoy the classic puzzle game with a nostalgic pixel-art aesthetic.

<img src="assets/icon.png" width="100" height="100" alt="Sudoku Retro" />   

## ✨ Features

- **Retro Aesthetic**: Pixel-perfect UI using the "Press Start 2P" font for a classic 8-bit gaming feel.
- **Multiple Game Modes**: 
  - **Classic Sudoku**: The standard 9x9 puzzle.
  - **Killer Sudoku**: Standard rules plus "cages" with target sums for an extra challenge.
- **Dynamic Difficulty**: Six levels ranging from **Easy** to **Extreme**, catering to all skill levels.
- **Save & Resume**: Never lose your progress. The app automatically saves your current game so you can return at any time.
- **Intelligent Hints & Solver**: Get a helping hand when stuck or use the built-in solver to validate any board.
- **Game History**: Track your victories, best times, and scores across different modes and difficulties.
- **Dark Mode Support**: Toggle between Light and Dark retro themes in the settings.
- **Smooth UX**: Custom number pad, undo/redo functionality, mistake tracking, and intelligent cell highlighting.

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) (React Native)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: React Native `StyleSheet` with Flexbox
- **Icons**: [Lucide React Native](https://lucide.dev/)
- **Storage**: `@react-native-async-storage/async-storage` for local persistence
- **Fonts**: `@expo-google-fonts/press-start-2p`

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Expo Go](https://expo.dev/client) app on your mobile device (to test on physical hardware)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Sudoku
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Running the App

Start the Expo development server:

```bash
npm start
```

Once the server is running, you can:
- Press **`a`** to open in an Android Emulator.
- Press **`i`** to open in an iOS Simulator.
- Scan the **QR code** with your phone's camera (iOS) or the Expo Go app (Android) to play on your device.

## 📂 Project Structure

- **`components/`**: Modular UI components like `Board`, `Cell`, `NumberPad`, and `Common` UI elements.
- **`screens/`**: Main application views (Home, Game, Settings, History, etc.).
- **`utils/`**: Core logic including `SudokuEngine` (Backtracking algorithm), `Storage` helpers, and `ThemeContext`.
- **`assets/`**: Visual assets, including icons and splash screens.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Developed with ❤️ for Sudoku enthusiasts.*

