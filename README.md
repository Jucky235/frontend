# English Learning Platform — Frontend

A modern web application for learning and practicing English through interactive lessons, vocabulary tools, exams, community features, and learning progress tracking.

This repository contains the **frontend application** of the English Learning Platform, built with **React and TypeScript** and designed to work with a dedicated backend API.

## 🌐 Demo & Repositories

| Resource               | Link                                                                                    |
| ---------------------- | --------------------------------------------------------------------------------------- |
| 🚀 Live Application    | [English Learning Platform](https://frontend-b6gp.onrender.com/?utm_source=chatgpt.com) |
| 💻 Frontend Repository | [GitHub — Frontend](https://github.com/Jucky235/frontend?utm_source=chatgpt.com)        |
| ⚙️ Backend Repository  | [GitHub — Backend](https://github.com/Jucky235/backend?utm_source=chatgpt.com)          |

---

## ✨ Features

### 📚 Flashcards

Interactive vocabulary learning tools designed to help users build and review their English vocabulary.

* Create and study flashcard decks
* Review vocabulary interactively
* Track learning progress
* Support structured vocabulary learning

### 📝 Exams

Practice English through structured exams and assessments.

* Multiple-choice questions
* Different exam parts and question types
* Exam attempts and results
* Score and accuracy tracking
* Learning progress analysis

### 📰 News

Stay up to date with English-learning and educational content.

* Browse articles and news
* Read English content for additional practice
* Organize and manage news content

### 💬 Chat

A community chat system where users can communicate and practice English together.

* Real-time-style community discussions
* User interactions
* Message history
* Community engagement

### 💭 Forum

A discussion platform for asking questions, sharing knowledge, and interacting with other learners.

* Create posts
* Comment on discussions
* Vote on content
* Browse forum categories
* Save interesting posts

### 👤 User Management

Users can manage their accounts and learning-related information.

* User profiles
* Authentication
* Account settings
* Learning activity
* Social interactions

### 🛠️ Administration

A dedicated administration dashboard for managing the platform.

* User management
* Content management
* Exam management
* Flashcard management
* News and forum management
* System resources

---

## 🧰 Tech Stack

### Frontend

* **TypeScript** — Primary programming language
* **React** — UI library
* **ReactDOM** — React rendering
* **Redux Toolkit** — Global state management and API state
* **React Hook Form** — Form management and validation
* **React Router** — Client-side routing
* **react-i18next** — Internationalization
* **Tailwind CSS** — Utility-first styling
* **Lucide React** — Icon library

### Backend

The frontend communicates with a separate backend application.

* **Backend:** NestJS
* **Database:** PostgreSQL
* **ORM:** Prisma
* **API:** REST API

See the backend repository for more information:

[Backend Repository](https://github.com/Jucky235/backend?utm_source=chatgpt.com)

---

## 🏗️ Architecture

The application follows a client-server architecture:

```text
┌──────────────────────────────┐
│       React Frontend         │
│                              │
│  TypeScript                  │
│  Redux Toolkit               │
│  React Hook Form             │
│  Tailwind CSS                │
│  react-i18next               │
└──────────────┬───────────────┘
               │
               │ REST API
               ▼
┌──────────────────────────────┐
│       NestJS Backend         │
│                              │
│  Authentication              │
│  Business Logic              │
│  REST API                    │
└──────────────┬───────────────┘
               │
               │ Prisma
               ▼
┌──────────────────────────────┐
│        PostgreSQL            │
└──────────────────────────────┘
```

---

## 🚀 Getting Started

Follow the steps below to run the frontend locally.

### Prerequisites

Make sure you have the following installed:

* [Node.js](https://nodejs.org/)
* npm, yarn, or pnpm
* Git

You can verify your Node.js and npm installations with:

```bash
node --version
npm --version
```

---

## 📥 Installation

### 1. Clone the repository

```bash
git clone https://github.com/Jucky235/frontend.git
```

Navigate into the project:

```bash
cd frontend
```

### 2. Install dependencies

Using npm:

```bash
npm install
```

Or using another package manager:

```bash
yarn install
```

```bash
pnpm install
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the project root:

```bash
touch .env
```

Add the environment variables required by the application.

For example:

```env
VITE_API_URL=http://localhost:3000
```

> The exact environment variables depend on the current frontend and backend configuration. Check the project's environment configuration before starting the application.

---

## 💻 Development

Start the development server:

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

Typically:

```text
http://localhost:5173
```

Open the URL in your browser to access the application.

---

## 🏭 Production Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 📁 Project Structure

A simplified overview of the frontend architecture:

```text
frontend/
├── public/
├── src/
│   ├── components/
│   ├── features/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── store/
│   ├── types/
│   ├── hooks/
│   ├── utils/
│   └── ...
├── .env
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

The project is organized around reusable React components, application features, API services, Redux state, and shared TypeScript types.

---

## 🌍 Internationalization

The application supports multiple languages using **react-i18next**.

Translation resources can be organized by language and feature, allowing the interface to be localized without changing the underlying application logic.

---

## 🔐 Authentication

The frontend integrates with the backend authentication system and manages authenticated application state through Redux Toolkit.

Depending on the configured backend, authentication can support different providers and protected application areas.

---

## 📊 Learning & Analytics

The platform is designed not only for practicing English but also for tracking learning performance.

Learning data can be used to analyze:

* Exam performance
* Question accuracy
* Skill performance
* Learning progress
* Vocabulary activity
* Community activity

This provides a foundation for personalized learning recommendations and progress visualization.

---

## 🤝 Related Project

This repository is the frontend component of the English Learning Platform.

For the backend implementation, visit:

[English Learning Platform — Backend](https://github.com/Jucky235/backend?utm_source=chatgpt.com)

---

## 👨‍💻 Author

**Truong Quoc Vuong**

GitHub: [@Jucky235](https://github.com/Jucky235?utm_source=chatgpt.com)

---

## 📄 License

This project is developed as an English learning platform and educational software project.

See the repository for the applicable license and usage terms.
