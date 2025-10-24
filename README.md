# Clarvis - AI Chat Browser Extension

An AI-powered Chrome extension that provides an intelligent chat assistant with awareness of your current page context. Generate study materials, ask questions, and get help understanding web content.

## Setup & Running

### Backend

1. Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```

2. Run the development server:
```bash
npm run dev
```

The backend will start on Cloudflare Workers local development environment.

### Frontend (Chrome Extension)

1. Navigate to the extension folder and install dependencies:
```bash
cd extension
npm install
```

2. Build the extension:
```bash
npm run build
```

3. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions`
   - Enable "Developer mode" (toggle in the top right)
   - Click "Load unpacked"
   - Select the `extension/dist` folder

4. The Clarvis extension icon should now appear in your Chrome toolbar!

## What Does It Do?

**Clarvis** is an AI-powered browser extension that enhances your web browsing with intelligent assistance:

- **Context-Aware Chat**: Chat with an AI assistant that understands the content of the page you're currently viewing
- **Study Material Generation**: Automatically generate summaries, flashcards, practice questions, and key concepts from any webpage
- **Conversation History**: Keep track of your conversations and easily reference past discussions
- **Multiple Difficulty Levels**: Customize study materials based on your learning level (beginner, intermediate, advanced)

Perfect for students, researchers, and anyone looking to better understand and learn from web content!

