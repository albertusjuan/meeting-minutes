# Frontend - File Upload UI

A clean, modern frontend interface for file uploads built with React, TypeScript, and Vite.

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

## Access the Application

**Frontend**: http://localhost:5173

## Tech Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client

## Features

- 🎨 Modern, glassmorphic UI design
- 📤 Drag & drop file upload
- 📱 Responsive design
- ✨ Smooth animations
- 🎯 TypeScript for type safety
- ⚡ Fast HMR with Vite

## File Upload Component

The main upload component supports:
- Drag and drop functionality
- File type validation (WAV, MP3, M4A, FLAC)
- File size display
- Upload progress indication
- Clean, intuitive interface

## Project Structure

```
frontend/
├── src/
│   ├── components/       # React components
│   │   ├── FileUpload.tsx   # Main upload component
│   │   └── Layout.tsx       # Page layout wrapper
│   ├── pages/            # Page components
│   │   └── Home.tsx         # Home page with upload
│   ├── api/              # API client (if needed)
│   ├── types/            # TypeScript types
│   ├── App.tsx           # Root component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── package.json          # Dependencies
├── vite.config.ts        # Vite configuration
└── tailwind.config.js    # Tailwind configuration
```

## Available Scripts

In the `frontend` directory:

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Customization

### Styling
- Edit `frontend/src/index.css` for global styles
- Modify `tailwind.config.js` for theme customization
- Components use Tailwind utility classes

### API Integration
- API client is in `frontend/src/api/client.ts`
- Update `VITE_API_BASE_URL` in `.env` for backend URL

## Development

The app uses:
- Hot Module Replacement (HMR) for instant updates
- ESLint for code quality
- TypeScript for type checking

## Requirements

- Node.js 16 or higher
- npm

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
