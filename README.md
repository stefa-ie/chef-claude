# 👩‍🍳 Chef Claude
A React + Vite mini app that lets you build an ingredient list and reveals a suggested recipe once you have enough items. It demonstrates form handling, conditional rendering, and simple state management with a clean CSS layout.

## ✨ Features
- Add ingredients via a form and see them listed instantly
- Reveal a “Chef Claude Recommends” recipe after 4+ ingredients
- Simple, responsive UI styled in `index.css`
- Vite-powered dev setup

## 🚀 Getting Started
Install dependencies:
```
npm install
```

Set environment variables for the API server:
```
export ANTHROPIC_API_KEY="your-key"
export HF_ACCESS_TOKEN="your-token"
```

Run the local API server (keeps keys off the browser):
```
npm run server
```

Run the dev server:
```
npm run dev
```

Build for production:
```
npm run build
```

Preview the production build:
```
npm run preview
```

## 🗂️ Project Structure
- `App.jsx`: app shell that renders `Header` and `Main`
- `Header.jsx`: app header and branding
- `Main.jsx`: ingredient form, list, and recipe reveal logic
- `ai.js`: frontend API calls to the local backend
- `server.cjs`: local API server (Claude + Mistral)
- `index.jsx`: React entry point
- `index.css`: global styles
- `images/`: app assets

## 🛠️ Customization
- Update starter ingredients in `Main.jsx`
- Adjust the recipe text in the “Chef Claude Recommends” section
- Tweak styles in `index.css`
- Replace the logo in `images/`

## 🧰 Tech Stack
- React
- Vite
- CSS

## 🙌 Acknowledgements
Built as part of the Scrimba React course.
# chef-claude
