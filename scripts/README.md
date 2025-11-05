# Scripts

Utility scripts for testing and development.

## Available Scripts

### `test-env.js`

Tests environment variables configuration.

**Usage:**
```bash
npm run test:env
# or
node scripts/test-env.js
```

**What it does:**
- Reads and validates `.env` file
- Checks all required environment variables are present
- Validates format of API keys and URLs
- Reports any missing or invalid variables

**Exit codes:**
- 0: All environment variables valid
- 1: Missing or invalid variables

---

### `test-api-connections.js`

Tests live API connections to external services.

**Usage:**
```bash
npm run test:api
# or
node scripts/test-api-connections.js
```

**What it does:**
- Tests Gemini AI API connection
- Tests Supabase REST API connection
- Reports connection status and available models/endpoints

**Exit codes:**
- 0: All API connections successful
- 1: One or more API connections failed

---

## Running All Tests

```bash
npm run test:all
```

Runs both `test-env.js` and `test-api-connections.js` in sequence.

## Adding New Scripts

When adding new scripts to this folder:

1. Create the script file with appropriate name
2. Add shebang: `#!/usr/bin/env node`
3. Make it executable: `chmod +x scripts/your-script.js`
4. Add npm script to `package.json`
5. Document it in this README
