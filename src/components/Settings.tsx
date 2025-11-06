import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { ArrowLeft, Trash2, Moon, Sun, Loader2, LogOut } from 'lucide-react';

type SettingsProps = {
  onBack: () => void;
};

export function Settings({ onBack }: SettingsProps) {
  const { user, signOut } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const deleteAllConversations = async () => {
    if (!user) return;
    
    const confirmed = window.confirm(
      'Are you sure you want to delete all your conversations? This action cannot be undone.'
    );
    
    if (!confirmed) return;

    setIsDeleting(true);
    setDeleteSuccess(false);

    try {
      // Delete all messages first (due to foreign key constraint)
      const { data: conversations } = await supabase
        .from('conversations')
        .select('id')
        .eq('user_id', user.id);

      if (conversations && conversations.length > 0) {
        const conversationIds = conversations.map(c => c.id);
        
        await supabase
          .from('messages')
          .delete()
          .in('conversation_id', conversationIds);

        // Then delete all conversations
        const { error } = await supabase
          .from('conversations')
          .delete()
          .eq('user_id', user.id);

        if (error) throw error;
      }

      setDeleteSuccess(true);
      setTimeout(() => setDeleteSuccess(false), 3000);
    } catch (error) {
      console.error('Error deleting conversations:', error);
      alert('Failed to delete conversations. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Settings</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Account Section */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Account</h2>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Name</Label>
              <p className="text-sm font-medium mt-1">
                {user?.user_metadata?.full_name || 'Not set'}
              </p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Email</Label>
              <p className="text-sm font-medium mt-1">{user?.email}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => signOut()}
              className="w-full mt-4"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </Card>

        {/* Appearance Section */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Appearance</h2>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Theme</Label>
              <p className="text-xs text-muted-foreground mt-1">
                {isDarkMode ? 'Dark mode' : 'Light mode'}
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
          </div>
        </Card>

        {/* Data Management Section */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Data Management</h2>
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium">Delete All Conversations</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Permanently delete all your chat history. This action cannot be undone.
              </p>
            </div>
            {deleteSuccess && (
              <div className="text-sm text-green-600 dark:text-green-400">
                ✓ All conversations deleted successfully
              </div>
            )}
            <Button
              variant="destructive"
              onClick={deleteAllConversations}
              disabled={isDeleting}
              className="w-full"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete All Conversations
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* About Section */}
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">About</h2>
          <div className="flex justify-center mb-4">
            <img src="/logo-with-text.png" alt="Eferno" className="h-16 object-contain" />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">App Name</span>
              <span className="font-medium">Eferno</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              AI-powered shopping assistant to help you find the best products for your needs.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
