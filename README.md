# CV Maker

[![Project Live](https://img.shields.io/badge/Project-Live-brightgreen.svg)](https://cv-builder-noureldeen.vercel.app/)

## Overview
CV Maker is a web application that helps users build professional resumes directly in the browser. It is powered by **Vite** and **React** for a fast, modern development experience and deployed on **Vercel** for easy hosting.

## Features
- **Interactive Builder** – Add personal details, experience, education, skills, and projects.
- **AI Suggestions** – Use the "Get AI Suggestions" button to receive automated tips for improving your resume.
- **Print Ready** – Generate a clean, printable version of your CV.
- **Data Persistence** – Information is saved to local storage so progress isn't lost.
- **Responsive Layout** – Updated styling provides a cleaner interface across devices.
- **Streamlined Editing** – Form fields, live preview, and AI tips sit side by side for a smoother experience.

## Getting Started
### Prerequisites
- Node.js v18+

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

### Linting
```bash
npm run lint
```

## AI Suggestions
This project can optionally integrate with the OpenAI API. To enable suggestions:
1. Create an [OpenAI API key](https://platform.openai.com/).
2. Create a `.env` file at the project root with:
   ```
   VITE_OPENAI_API_KEY=your_key_here
   ```
3. Restart the development server.

## Contact
If you have questions or suggestions, feel free to reach out at **nourfahmy2003@gmail.com**.
