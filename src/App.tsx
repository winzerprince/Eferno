import { useState } from "react";
import { AuthProvider, useAuth } from "./lib/auth";
import { AuthForm } from "./components/AuthForm";
import { ThemeProvider, useTheme } from "./components/ThemeProvider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
import { Moon, Sun, Menu } from "lucide-react";
import { Button } from "./components/ui/button";
import { AskTab } from "./components/AskTab";
import { StoreTab } from "./components/StoreTab";
import { ConversationDrawer } from "./components/ConversationDrawer";
import { Loader2 } from "lucide-react";

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("ask");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | undefined>();
  const [conversationKey, setConversationKey] = useState(0); // Add key to force re-render when needed

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const handleSelectConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId);
    setActiveTab("ask");
  };

  const handleNewChat = () => {
    setCurrentConversationId(undefined);
    setConversationKey(prev => prev + 1); // Force re-render with new key
    setActiveTab("ask");
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground w-full max-w-md sm:max-w-2xl lg:max-w-7xl mx-auto">
      {/* App Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDrawerOpen(true)}
            className="rounded-full"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="h-10 flex items-center">
            <img src="/logo.png" alt="Eferno" className="h-full object-contain" />
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 overflow-hidden">
        <TabsList className="w-full justify-start rounded-none border-b border-border bg-background h-12 p-0">
          <TabsTrigger
            value="ask"
            className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent h-full"
          >
            Ask
          </TabsTrigger>
          <TabsTrigger
            value="store"
            className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent h-full"
          >
            Store
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ask" className="flex-1 m-0 overflow-hidden">
          <AskTab 
            key={conversationKey} 
            conversationId={currentConversationId} 
          />
        </TabsContent>

        <TabsContent value="store" className="flex-1 m-0 overflow-hidden">
          <StoreTab />
        </TabsContent>
      </Tabs>

      {/* Conversation History Drawer */}
      <ConversationDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        currentConversationId={currentConversationId}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

