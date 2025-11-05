import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from './ui/drawer';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Search, MessageSquare, X, PlusCircle, Loader2, Settings as SettingsIcon } from 'lucide-react';
import { Settings } from './Settings';

type Conversation = {
  id: string;
  title: string;
  updated_at: string;
};

type ConversationDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectConversation: (conversationId: string) => void;
  onNewChat: () => void;
  currentConversationId?: string;
};

export function ConversationDrawer({
  open,
  onOpenChange,
  onSelectConversation,
  onNewChat,
  currentConversationId,
}: ConversationDrawerProps) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const fetchConversations = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('id, title, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && user) {
      fetchConversations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user]);

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleNewChat = () => {
    onNewChat();
    onOpenChange(false);
  };

  if (showSettings) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange} direction="left">
        <DrawerContent className="h-full w-[85vw] max-w-sm left-0">
          <Settings onBack={() => setShowSettings(false)} />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="left">
      <DrawerContent className="h-full w-[85vw] max-w-sm left-0">
        <DrawerHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between mb-4">
            <DrawerTitle>Chats</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="w-5 h-5" />
              </Button>
            </DrawerClose>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* New Chat Button */}
          <Button
            onClick={handleNewChat}
            className="w-full mt-3"
            variant="default"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </DrawerHeader>

        {/* Conversations List */}
        <ScrollArea className="flex-1 px-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'No conversations found' : 'No conversations yet'}
              </p>
              {!searchQuery && (
                <p className="text-xs text-muted-foreground mt-1">
                  Start chatting to create your first conversation
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2 py-4">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => {
                    onSelectConversation(conv.id);
                    onOpenChange(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg hover:bg-muted transition-colors ${
                    currentConversationId === conv.id ? 'bg-muted' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{conv.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(conv.updated_at)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Settings Button at Bottom */}
        <div className="border-t border-border p-4">
          <Button
            variant="ghost"
            onClick={() => setShowSettings(true)}
            className="w-full justify-start"
          >
            <SettingsIcon className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
