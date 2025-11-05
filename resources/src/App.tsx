import { useState } from "react";
import { ThemeProvider, useTheme } from "./components/ThemeProvider";
import { AskTab } from "./components/AskTab";
import { StoreTab } from "./components/StoreTab";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
import { Moon, Sun, Sparkles } from "lucide-react";
import { Button } from "./components/ui/button";

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("ask");

  return (
    <div className="flex flex-col h-screen bg-background text-foreground max-w-md mx-auto">
      {/* App Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl">Eferno</span>
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
          <AskTab />
        </TabsContent>

        <TabsContent value="store" className="flex-1 m-0 overflow-hidden">
          <StoreTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}