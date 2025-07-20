import { useAppStore } from '../store';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

global.localStorage = localStorageMock as any;

// Mock Supabase
jest.mock('../supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
    })),
    rpc: jest.fn().mockResolvedValue({ data: [], error: null }),
  },
  handleSupabaseError: jest.fn((error) => ({ error: error.message })),
  isDemoMode: true,
}));

describe('Store', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    // Reset store state
    useAppStore.setState({
      currentEntry: null,
      entries: [],
      isLoading: false,
      error: null,
      currentStreak: 0,
    });
  });

  describe('Entry Management', () => {
    it('should update entry correctly', async () => {
      const store = useAppStore.getState();
      
      const mockEntry = {
        date: '2024-01-15',
        wakeup_time: '07:00',
        focus_rating: 8,
        energy_rating: 7,
        gratitude_entry: 'Test gratitude',
        notes_morning: 'Test notes'
      };
      
      // Mock current entry
      useAppStore.setState({ 
        currentEntry: { id: 'test-id', date: '2024-01-15' } as any 
      });
      
      await store.updateEntry(mockEntry);
      
      const currentEntry = useAppStore.getState().currentEntry;
      expect(currentEntry).toEqual(expect.objectContaining(mockEntry));
    });

    it('should fetch today entry', async () => {
      const store = useAppStore.getState();
      
      await store.fetchTodayEntry();
      
      const state = useAppStore.getState();
      expect(state.currentEntry).toBeTruthy();
      expect(state.entries.length).toBeGreaterThan(0);
    });
  });

  describe('Loading States', () => {
    it('should handle loading state during fetch', async () => {
      const store = useAppStore.getState();
      
      const fetchPromise = store.fetchTodayEntry();
      
      // Should be loading during fetch
      expect(useAppStore.getState().isLoading).toBe(true);
      
      await fetchPromise;
      
      // Should not be loading after fetch
      expect(useAppStore.getState().isLoading).toBe(false);
    });

    it('should handle errors gracefully', async () => {
      // Mock error scenario
      const { supabase } = require('../supabase');
      supabase.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockRejectedValue(new Error('Database error')),
      });
      
      const store = useAppStore.getState();
      await store.fetchTodayEntry();
      
      const state = useAppStore.getState();
      expect(state.error).toBeTruthy();
    });
  });

  describe('UI State Management', () => {
    it('should set active session', () => {
      const store = useAppStore.getState();
      
      store.setActiveSession('morning');
      
      expect(useAppStore.getState().activeSession).toBe('morning');
    });

    it('should clear active session', () => {
      const store = useAppStore.getState();
      
      store.setActiveSession('morning');
      store.setActiveSession(null);
      
      expect(useAppStore.getState().activeSession).toBeNull();
    });
  });

  describe('Motivation Features', () => {
    it('should trigger celebration', () => {
      const store = useAppStore.getState();
      
      store.triggerCelebration('streak', 5);
      
      const motivation = useAppStore.getState().motivation;
      expect(motivation.showCelebration).toBe(true);
      expect(motivation.celebrationType).toBe('streak');
      expect(motivation.celebrationValue).toBe(5);
    });

    it('should hide celebration', () => {
      const store = useAppStore.getState();
      
      store.triggerCelebration('session');
      store.hideCelebration();
      
      const motivation = useAppStore.getState().motivation;
      expect(motivation.showCelebration).toBe(false);
      expect(motivation.celebrationType).toBeNull();
    });

    it('should update reminder settings', async () => {
      const store = useAppStore.getState();
      
      const newSettings = {
        enabled: false,
        frequency: 'gentle' as const,
      };
      
      await store.updateReminderSettings(newSettings);
      
      const motivation = useAppStore.getState().motivation;
      expect(motivation.reminderSettings.enabled).toBe(false);
      expect(motivation.reminderSettings.frequency).toBe('gentle');
    });

    it('should update notification settings', () => {
      const store = useAppStore.getState();
      
      const newSettings = {
        discord: { enabled: true, webhookUrl: 'test-url', userMention: '@user' },
      };
      
      store.updateNotificationSettings(newSettings);
      
      const motivation = useAppStore.getState().motivation;
      expect(motivation.notificationSettings.discord.enabled).toBe(true);
      expect(motivation.notificationSettings.discord.webhookUrl).toBe('test-url');
    });
  });

  describe('Demo Mode', () => {
    it('should handle demo mode data', async () => {
      const store = useAppStore.getState();
      
      await store.fetchTodayEntry();
      
      const state = useAppStore.getState();
      expect(state.entries.length).toBeGreaterThan(0);
      expect(state.currentEntry).toBeTruthy();
      expect(state.weeklySummary).toBeTruthy();
    });

    it('should calculate demo mode completion percentage', async () => {
      const store = useAppStore.getState();
      
      // Set up demo entry
      useAppStore.setState({
        currentEntry: { 
          id: 'demo-entry',
          session_1_morning: true,
          session_2_midday: false,
          session_3_evening: true,
          session_4_bedtime: false,
        } as any
      });
      
      await store.updateEntry({ session_1_morning: true, session_2_midday: true });
      
      const currentEntry = useAppStore.getState().currentEntry;
      expect(currentEntry?.completion_percentage).toBe(75); // 3 out of 4 sessions
    });
  });

  describe('Data Persistence', () => {
    it('should persist settings to localStorage', () => {
      const store = useAppStore.getState();
      
      store.setActiveSession('evening');
      store.triggerCelebration('milestone', 10);
      
      // Zustand persist should handle localStorage calls
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });

  describe('Progress Calculation', () => {
    it('should calculate progress correctly', () => {
      const store = useAppStore.getState();
      
      // Set up some demo entries
      const entries = [
        { date: '2024-01-15', completion_percentage: 100 },
        { date: '2024-01-14', completion_percentage: 75 },
        { date: '2024-01-13', completion_percentage: 50 },
      ];
      
      useAppStore.setState({ entries: entries as any });
      
      store.calculateProgress();
      
      const motivation = useAppStore.getState().motivation;
      expect(motivation.weeklyProgress).toBeGreaterThan(0);
    });
  });
});