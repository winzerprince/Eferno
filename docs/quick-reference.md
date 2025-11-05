# Quick Reference Guide

## Testing Commands

### Environment Variables Test
```bash
npm run test:env
# or
node scripts/test-env.js
```
Checks if all required environment variables are set and valid.

### API Connections Test
```bash
npm run test:api
# or
node scripts/test-api-connections.js
```
Tests actual connections to Gemini AI and Supabase APIs.

### Run All Tests
```bash
npm run test:all
```
Runs both environment and API tests sequentially.

## Development Commands

### Start Development Server
```bash
npm start
```
Opens app at http://localhost:3000

### Build for Production
```bash
npm run build
```

### Run Tests
```bash
npm test
```

## Environment Variables

Required variables in `.env` file:

```bash
VITE_GEMINI_API_KEY=your_key_here
VITE_SUPABASE_URL=your_url_here
VITE_SUPABASE_ANON_KEY=your_key_here
VITE_SUPABASE_PROJECT_REF=your_ref_here
```

See `.env.example` for template.

## MCP Servers

All MCP servers are configured in `.vscode/mcp.json`:

- Supabase - Database and storage
- Figma - Design extraction
- GitHub - Version control
- Context7 - Library documentation
- Deepwiki - Repository docs
- Memory - Knowledge graph
- Memory Bank - Project context
- Postman - API testing

## Project Structure

```
eferno/
├── docs/              # Major milestone documentation
├── scripts/           # Utility scripts (testing, setup)
├── src/               # Source code
├── public/            # Static assets
├── .env               # Environment variables (gitignored)
├── .env.example       # Environment template
└── package.json       # Project configuration
```
