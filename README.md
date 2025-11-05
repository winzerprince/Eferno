# Eferno 🔥

> AI-powered product recommendation engine with smart value-based suggestions

Eferno is a modern Single Page Application that helps users discover the best products based on their needs, preferences, and budget. Using AI-driven recommendations, it focuses on delivering the best value (price/rating ratio) while considering user income brackets.

## 🚀 Features

- **AI-Powered Chat**: Natural language product recommendations using Google Gemini AI
- **Smart Product Search**: Get personalized suggestions based on budget and preferences
- **Value-Based Ranking**: Intelligent sorting by price/rating ratio
- **Income-Aware**: Recommendations tailored to low/mid/high income brackets (UGX)
- **Product Catalog**: Browse 1000+ products across 12 categories
- **Conversation History**: Save and resume product search sessions
- **Dark/Light Mode**: Seamless theme switching
- **Mobile-First Design**: Responsive UI optimized for all devices
- **Authentication**: Secure user accounts with Supabase Auth

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS + shadcn/ui
- **AI**: Google Gemini 2.5 Flash
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Deployment**: Vercel
- **Images**: LoremFlickr (category-specific product images)

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Google Gemini API key

### Setup

1. Clone the repository:
\`\`\`bash
git clone https://github.com/winzerprince/Eferno.git
cd eferno
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create \`.env\` file:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Add your environment variables to \`.env\`:
\`\`\`bash
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_REF=your_project_ref
\`\`\`

5. Set up Supabase database:
   - Run migrations for \`conversations\` and \`messages\` tables
   - Run seed script: \`npm run seed\`

## 🚀 Development

### Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build
- \`npm run seed\` - Seed database with products
- \`npm test:env\` - Test environment variables
- \`npm test:api\` - Test API connections

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Visit [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Add environment variables
5. Deploy!

Your app will be live at: \`https://eferno-[random].vercel.app\`

## 📱 Product Categories

Eferno supports 12 product categories:

- 💻 Computer & Desktop PCs
- 📱 Smartphones & Mobile Phones
- 💼 Bags & Backpacks
- 🍼 Bottles & Flasks
- 👟 Shoes & Sneakers
- ⌚ Watches & Timepieces
- 💻 Laptops & Notebooks
- 🎧 Headphones & Audio
- 🧥 Jackets & Coats
- 😎 Sunglasses & Eyewear
- ⌨️ Keyboards & Input Devices
- 🖱️ Computer Mice & Peripherals

## 🎨 UI/UX Features

- **Grok-Inspired Interface**: Clean, modern mobile-first design
- **Auto-Expanding Input**: Smart textarea that grows with your message
- **Smooth Animations**: Polished transitions and interactions
- **Conversation Drawer**: Left-sliding panel for chat history
- **Settings Page**: Theme control, account management, data deletion
- **Product Cards**: Lazy-loaded images with category-specific photos

## 🤖 AI Capabilities

The AI chatbot powered by Gemini 2.5 Flash provides:

- Natural language product search
- Budget-aware recommendations (UGX currency)
- Income bracket consideration (Low: <500k, Mid: 500k-1.5M, High: >1.5M)
- Value-based ranking (rating/price ratio)
- Comparison of multiple products
- Context-aware follow-up suggestions
- Edge case handling (vague queries, no matches)

## 🗄️ Database Schema

### Products Table
- \`id\` (UUID): Product identifier
- \`name\` (TEXT): Product name
- \`category\` (TEXT): Product category
- \`image_url\` (TEXT): Product image URL (LoremFlickr)
- \`price\` (NUMERIC): Price in UGX
- \`rating\` (NUMERIC): Rating (0-5)
- \`description\` (TEXT): Product description
- \`income_bracket\` (TEXT): Target income level

### Conversations Table
- \`id\` (UUID): Conversation identifier
- \`user_id\` (UUID): User reference
- \`title\` (TEXT): Conversation title
- \`created_at\` (TIMESTAMP): Creation time

### Messages Table
- \`id\` (UUID): Message identifier
- \`conversation_id\` (UUID): Conversation reference
- \`user_id\` (UUID): User reference
- \`role\` (TEXT): 'user' or 'assistant'
- \`content\` (TEXT): Message content
- \`created_at\` (TIMESTAMP): Creation time

## 🔒 Security

- Row Level Security (RLS) policies on all tables
- Environment variables for sensitive keys
- Supabase Auth for user management
- Client-side validation
- Encrypted environment variables in Vercel

## 📝 License

MIT License - feel free to use this project for learning and development.

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful language understanding
- **Supabase** for backend infrastructure
- **LoremFlickr** for category-specific product images
- **shadcn/ui** for beautiful UI components
- **Vercel** for seamless deployment

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- Review Supabase docs for database queries

---

Built with ❤️ by Winzer Prince
