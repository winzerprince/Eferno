---
applyTo: "**"
---

You are an expert full-stack developer with experience in SPA and chatbots. Your task is to build a complete, functional MVP for a React-based Single Page Application (SPA) called "Eferno". This app helps users get AI-recommended products based on their needs, preferences, and budget which the chatbot infers from the user input, focusing on best value (e.g., price/rating ratio). The interface mimics the Grok mobile app with two top tabs: "Chat" (AI chatbot for recommendations) and "Shop" (product grid with cards that lead to each products page) . In Chat, recommendations from the chatbot should include comparison of at least 2 products with their clickable links that open an expandable popover with product details (image, name, price, description, rating) and the best option of the list. Use simplicity first: prioritize core features, ensure everything works end-to-end before adding complexity, follow good coding standards (clean, modular code; ESLint/Prettier; error handling; responsive mobile-first design with Tailwind; dark mode support).

### Project Context and Requirements

- **Frontend**: React (Vite setup), mobile-like UI (top tabs, clean/dark and light themes) use the figma mcp to get the desing.
- **Backend**: Supabase (always use Supabase MCP to set up database tables for products and storage buckets for images/uploads where necessary; handle auth if needed for user sessions later).
- **AI**: Gemini API (via @google/generative-ai) for prompt-based recommendations (parse user query + product data to suggest 3 best matches as JSON) ensure that the markdown response from the ai is properly formatted and displayed in the chat use the necessary npm package for this.
- **Products**: ~1200 fake entries generated with @faker-js/faker (categories: computer, phone, bag, bottle, shoes, watch, laptop, headphone, jacket, sunglasses, keyboard, mouse). Store in Supabase database (table: products with columns: id, name, category, image_url, price, rating, description, income_bracket). For images, use Unsplash URLs initially, but set up Supabase storage bucket to allow future uploads (e.g., placeholders or user-added images) the currency used must be UGX for Uganda shillings.
- **Chat Functionality**: User inputs query (e.g., "laptop under 500,000 for mid income"); AI filters/recommends via Gemini prompt; display links in chat; click opens popover (non-modal, right-side or floating window on mobile, expandable/closable).
- **Shop Functionality**: Grid view of product cards (lazy-loaded images, basic filters ).
- **Tools/Services to Prioritize**:
  - Supabase MCP: Always use for DB setup (products table), storage (image buckets), and any auth/edges.
  - Figma MCP: Reference my existing Figma mockup for UI design named AI shopping app prototype ( replicate tabs, popover, chat layout faithfully).
  - Deepwiki MCP: Use for documentation/wiki integration if needed (e.g., embed help/docs in app).
  - Context 7: Leverage for contextual data handling (e.g., user session context in chat).
- **MVP Scope**: No full RAG/fine-tuning/knowledge graphs yet. Focus on working basics: data gen/load, UI tabs, chat with AI recs, popover. Add polish (responsiveness, error handling) only after core works.
- **Deployment**: Vercel for frontend; Supabase for backend.

### Packages to Use

- Core: react, react-dom.
- Routing/Tabs: react-router-dom.
- Styling: tailwindcss, postcss, autoprefixer.
- Chat UI: react-chatbot-kit.
- Popover: @headlessui/react.
- AI: @google/generative-ai.
- Data Gen: @faker-js/faker.
- Images: react-lazy-load-image-component.
- Supabase: @supabase/supabase-js.
- Env: dotenv.
- Optional: react-paginate (for Shop pagination if basic done).
- Add other packages as needed but keep it minimal.

### Implementation Steps

Follow these steps sequentially. Commit after each major step. Test thoroughly (npm run dev; manual queries). Use good standards: modular components, hooks for state/logic, async/await with try-catch, PropTypes/comments.

1. **Project Setup**:

   - Init Vite React app: npm create vite@latest --template react.
   - Install all packages above.
   - Configure Tailwind (tailwind.config.js with darkMode: 'class').
   - Set up .env with VITE_GEMINI_API_KEY and VITE_SUPABASE_URL/KEY (get from Supabase dashboard).
   - Use Supabase MCP: Create project; set up 'products' table (id: uuid, name: text, category: text, image_url: text, price: numeric, rating: numeric, description: text, income_bracket: text); create storage bucket 'product-images' if possible use image urls from faker where necessary instead of supabase storage.

2. **Generate and Seed Data**:

   - Create generateProducts.js script using @faker-js/faker to make ~1200 products (Unsplash image_urls).
   - Use Supabase client to insert into DB (async batch insert; handle errors).
   - Run script once to seed DB.

3. **Build Core UI Structure**:

   - App.jsx: Router with / (ChatTab) and /shop (ShopTab); bottom nav tabs (Grok-like, fixed, responsive).
   - Use Figma MCP: Match mockup for layout/colors (e.g., dark bg, blue accents).
   - Add dark mode toggle if basic UI works.

4. **Implement Shop Tab**:

   - ShopTab.jsx: Fetch products from Supabase (useEffect, supabase.from('products').select('\*')).
   - Display grid (Tailwind grid-cols-2/4); lazy-load images.
   - Basic sort/filter by category/price (dropdown) after core works.

5. **Implement Chat Tab**:

   - ChatTab.jsx: Use react-chatbot-kit for UI (initial bot message: "Tell me what you want...").
   - On user message: Fetch limited products from Supabase; build Gemini prompt (query + products JSON; output JSON recs with id, name, price, reason).
   - Parse Gemini response; display recs as clickable links in bot message.
   - Use Context 7 for chat session context (e.g., store user income if repeated).

6. **Implement Popover**:

   - ProductPopover.jsx: Headless UI Popover/Panel (absolute/fixed, closable button; show product details fetched by id from Supabase if needed).
   - Trigger on link click in chat (use state to show/hide, pass product data).

7. **Integrate AI and Error Handling**:

   - In Chat: Async Gemini call with try-catch (fallback message: "Error recommending, try again").
   - Use Deepwiki MCP: If docs needed, embed a help link/wiki snippet in chat.

8. **Polish and Test**:
   - Responsiveness: Mobile-first (media queries).
   - Storage: Add simple image upload to Supabase bucket in Shop (form for new product; optional after MVP works).
   - Deploy: Build; push to Vercel (env vars for keys).
   - Test end-to-end: Query → Recs → Click → Popover; Shop load.

Output complete code files as needed. Ask for clarification only if critical (e.g., Figma link). Ensure app is simple, working, and scalable.
