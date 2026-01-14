# MDF Note

> **A modern, local-first note-taking application built with React Native and Expo.**

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)
![Expo](https://img.shields.io/badge/expo-1C1E24?style=flat&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)

## 📖 Project Overview

**MDF Note** is a powerful, mobile-first application designed to streamline your note-taking experience. Built on the robust **Expo** framework using **React Native**, it leverages local storage for privacy and speed, offering a seamless user experience across both Android and iOS platforms.

### Key Features

-   **📱 Cross-Platform** - Runs smoothly on both Android and iOS.
-   **⚡ High Performance** - Optimized for speed with a local-first architecture.
-   **💾 Local Persistence** - Your data stays on your device using `AsyncStorage`.
-   **🎨 Modern UI/UX** - Clean interface with `@expo/vector-icons` and `expo-blur`.
-   **🧭 Intuitive Navigation** - Powered by `expo-router` for file-based routing.

---

## 🛠 Tech Stack

-   **Framework:** [React Native](https://reactnative.dev/) (v0.76.7)
-   **Platform:** [Expo](https://expo.dev/) (v52.0.37)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Navigation:** [Expo Router](https://docs.expo.dev/router/introduction/)
-   **Storage:** [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/)
-   **Styling:** StyleSheet, Expo Font, Expo Linear Gradient
-   **Testing:** Jest, Jest-Expo

---

## 🚀 Installation

Follow these steps to set up the project locally.

### Prerequisites

-   **Node.js** (LTS version recommended)
-   **npm** or **yarn**
-   **Expo Go** app on your mobile device (optional but recommended)

### Steps

1.  **Clone the Repository**

    ```bash
    git clone https://github.com/yourusername/mdf-note.git
    cd mdf-note
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Start the Development Server**

    ```bash
    npm start
    ```

    This will run `expo start`. You can then:
    -   Scan the QR code with **Expo Go** (Android/iOS).
    -   Press `a` to run on Android Emulator.
    -   Press `i` to run on iOS Simulator.
    -   Press `w` to run on Web.

---

## 🕹 Usage

### Running Locally

-   **Development Mode:** `npm start`
-   **Reset Project:** `npm run reset-project`
-   **Run on Android:** `npm run android`
-   **Run on iOS:** `npm run ios`
-   **Run on Web:** `npm run web`

### Running Tests

To execute the test suite:

```bash
npm test
```

To run linting:

```bash
npm run lint
```

---

## 📂 Folder Structure

```
MDFNote/
├── app/                  # Expo Router pages and layouts
├── assets/               # Images, fonts, and static assets
├── components/           # Reusable UI components
├── constants/            # App constants (colors, layouts)
├── hooks/                # Custom React hooks
├── scripts/              # Utility scripts
├── .env                  # Environment variables (if applicable)
├── package.json          # Dependency definitions
└── README.md             # Project documentation
```

---

## 📚 Documentation

Detailed documentation for every aspect of the project.

-   [🏛 Architecture](ARCHITECTURE.md)
-   [🔌 API Documentation](API_DOCUMENTATION.md)
-   [🗄 Database Schema](DATABASE_SCHEMA.md)
-   [🚀 Deployment Guide](DEPLOYMENT.md)
-   [🌍 Environment Variables](ENVIRONMENT.md)
-   [🧪 Testing Strategy](TESTING.md)
-   [🎨 Style Guide](STYLE_GUIDE.md)
-   [🤝 Contributing](CONTRIBUTING.md)
-   [⚖️ Governance](GOVERNANCE.md)
-   [🛠 Support](SUPPORT.md)
-   [🗺 Roadmap](ROADMAP.md)
-   [🔒 Security Policy](SECURITY.md)
-   [👮 Code of Conduct](CODE_OF_CONDUCT.md)
-   [📜 License](LICENSE)
-   [⚠️ Disclaimer](DISCLAIMER.md)
-   [📝 Changelog](CHANGELOG.md)

---

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) to learn about our development process, how to propose bug fixes and improvements, and how to build and test your changes to **MDF Note**.

## 🔒 Security

We take security seriously. If you discover a vulnerability, please check our [Security Policy](SECURITY.md) for reporting guidelines.

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

## ✍ Author

**MDF Note Team**
-   Maintained by the open-source community.

---

_Generated with ❤️ for the Open Source Community._
