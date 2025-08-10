# ChatClone

A modern, responsive WhatsApp-like chat application built with React, TypeScript, Vite, Tailwind CSS, and Node.js. This project features real-time messaging, emoji and attachment support, and a mobile-friendly UI.

## Features
- Responsive chat UI (mobile & desktop)
- Real-time messaging
- Emoji picker
- Attachment menu
- Unread message notifications
- Profile avatars with fallback
- Group and individual chats
- Modern design with Tailwind CSS

## Tech Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** Drizzle ORM (see `drizzle.config.ts`)
- **WebSocket:** Real-time communication

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```sh
   git clone <your-repo-url>
   cd ChatClone
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

### Running the App
#### Development
- Start the backend server:
  ```sh
  cd server
  npm run dev
  ```
- Start the frontend client:
  ```sh
  cd client
  npm run dev
  ```
- Open [http://localhost:5173](http://localhost:5173) in your browser.

#### Production
- Build the frontend:
  ```sh
  cd client
  npm run build
  ```
- Serve the build with your preferred static server.

## Folder Structure
```
ChatClone/
├── client/         # Frontend (React)
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── pages/
│   ├── index.html
│   └── ...
├── server/         # Backend (Node.js)
│   ├── index.ts
│   ├── routes.ts
│   └── ...
├── shared/         # Shared types/schema
│   └── schema.ts
├── attached_assets/ # Sample data/assets
├── package.json
├── tailwind.config.ts
├── drizzle.config.ts
└── ...
```

## Customization
- Update theme colors in `tailwind.config.ts`.
- Add new components in `client/src/components/`.
- Extend backend routes in `server/routes.ts`.

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
MIT
