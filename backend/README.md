# FreshConnect Backend

## Getting Started

1. Copy `.env.example` to `.env` and fill in your environment variables.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Scripts
- `npm run dev` - Start server with nodemon
- `npm test` - Run tests

## Project Structure
- `index.js` - Entry point
- `models/` - Sequelize models
- `routes/` - Express route handlers
- `controllers/` - Business logic
- `middleware/` - Express middleware
- `config/` - Database and app config
