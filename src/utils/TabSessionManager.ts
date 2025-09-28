'use client';

export interface SessionData {
  token: string;
  user: any;
  role: string;
  timestamp: number;
  tabId: string;
}

export class TabSessionManager {
  private static instance: TabSessionManager;
  private tabId: string;
  private storageKey: string = 'tabSessions';
  
  private constructor() {
    this.tabId = this.generateTabId();
    this.initializeSession();
  }

  public static getInstance(): TabSessionManager {
    if (!TabSessionManager.instance) {
      TabSessionManager.instance = new TabSessionManager();
    }
    return TabSessionManager.instance;
  }

  private generateTabId(): string {
    return `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSession(): void {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return;

    // Clean up old sessions (older than 24 hours)
    this.cleanupOldSessions();

    // CHECK FOR PAGE REFRESH: If sessionStorage is empty but localStorage has sessions,
    // this might be a page refresh in the same tab
    const hasSessionStorage = sessionStorage.getItem('currentSession');
    if (!hasSessionStorage) {
      // Try to recover session for page refresh
      const recovered = this.tryRecoverSession();
      if (!recovered) {
        // This is truly a new tab or copied URL
        console.log('New tab detected - no session available');
      } else {
        console.log('Session recovered after page refresh');
      }
    }

    // Set up beforeunload listener to mark tab for potential recovery
    window.addEventListener('beforeunload', () => {
      // Mark this tab for potential recovery instead of removing immediately
      this.markTabForRecovery();
    });

    // Set up visibility change listener to manage session activity
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.markSessionActive();
      }
    });

    // Periodic cleanup every 5 minutes
    setInterval(() => {
      this.cleanupInactiveSessions();
    }, 5 * 60 * 1000);
  }

  public createSession(token: string, user: any, role: string): void {
    if (typeof window === 'undefined') return;

    const sessionData: SessionData = {
      token,
      user,
      role,
      timestamp: Date.now(),
      tabId: this.tabId
    };

    const sessions = this.getAllSessions();
    sessions[this.tabId] = sessionData;
    
    localStorage.setItem(this.storageKey, JSON.stringify(sessions));
    
    // Also store in sessionStorage for current tab
    sessionStorage.setItem('currentSession', JSON.stringify(sessionData));
  }

  public getSession(): SessionData | null {
    if (typeof window === 'undefined') return null;

    // First try sessionStorage (tab-specific)
    const currentSession = sessionStorage.getItem('currentSession');
    if (!currentSession) {
      // Try to recover session in case of page refresh
      const recovered = this.tryRecoverSession();
      if (!recovered) {
        // Truly a new tab or no session available
        return null;
      }
      // Get the recovered session
      const recoveredSession = sessionStorage.getItem('currentSession');
      if (recoveredSession) {
        try {
          return JSON.parse(recoveredSession);
        } catch (error) {
          console.error('Error parsing recovered session:', error);
          return null;
        }
      }
      return null;
    }

    try {
      const session = JSON.parse(currentSession);
      
      // Verify the session is still valid
      if (!this.isTokenValid(session.token)) {
        sessionStorage.removeItem('currentSession');
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error parsing current session:', error);
      sessionStorage.removeItem('currentSession');
      return null;
    }
  }

  public updateSession(updates: Partial<SessionData>): void {
    if (typeof window === 'undefined') return;

    const currentSession = this.getSession();
    if (!currentSession) return;

    const updatedSession = {
      ...currentSession,
      ...updates,
      timestamp: Date.now()
    };

    const sessions = this.getAllSessions();
    sessions[this.tabId] = updatedSession;
    
    localStorage.setItem(this.storageKey, JSON.stringify(sessions));
    sessionStorage.setItem('currentSession', JSON.stringify(updatedSession));
  }

  public removeSession(tabId?: string): void {
    if (typeof window === 'undefined') return;

    const targetTabId = tabId || this.tabId;
    const sessions = this.getAllSessions();
    
    delete sessions[targetTabId];
    localStorage.setItem(this.storageKey, JSON.stringify(sessions));
    
    if (targetTabId === this.tabId) {
      sessionStorage.removeItem('currentSession');
    }
  }

  public clearAllSessions(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(this.storageKey);
    sessionStorage.removeItem('currentSession');
  }

  public getAllSessions(): Record<string, SessionData> {
    if (typeof window === 'undefined') return {};

    try {
      const sessions = localStorage.getItem(this.storageKey);
      return sessions ? JSON.parse(sessions) : {};
    } catch (error) {
      console.error('Error parsing sessions:', error);
      return {};
    }
  }

  public getActiveSessionsCount(): number {
    const sessions = this.getAllSessions();
    const now = Date.now();
    const activeThreshold = 30 * 60 * 1000; // 30 minutes

    return Object.values(sessions).filter(
      session => now - session.timestamp < activeThreshold
    ).length;
  }

  public isTokenValid(token: string): boolean {
    if (!token) return false;

    try {
      // Basic JWT validation (check if it's not expired)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      
      return payload.exp > now;
    } catch (error) {
      return false;
    }
  }

  public switchRole(newRole: string, newToken?: string): void {
    const currentSession = this.getSession();
    if (!currentSession) return;

    this.updateSession({
      role: newRole,
      token: newToken || currentSession.token
    });
  }

  private markSessionActive(): void {
    const currentSession = this.getSession();
    if (currentSession) {
      this.updateSession({ timestamp: Date.now() });
    }
  }

  private cleanupOldSessions(): void {
    const sessions = this.getAllSessions();
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    const validSessions: Record<string, SessionData> = {};
    
    Object.entries(sessions).forEach(([tabId, session]) => {
      if (now - session.timestamp < maxAge && this.isTokenValid(session.token)) {
        validSessions[tabId] = session;
      }
    });

    localStorage.setItem(this.storageKey, JSON.stringify(validSessions));
  }

  private cleanupInactiveSessions(): void {
    const sessions = this.getAllSessions();
    const now = Date.now();
    const inactiveThreshold = 2 * 60 * 60 * 1000; // 2 hours

    const activeSessions: Record<string, SessionData> = {};
    
    Object.entries(sessions).forEach(([tabId, session]) => {
      if (now - session.timestamp < inactiveThreshold) {
        activeSessions[tabId] = session;
      }
    });

    localStorage.setItem(this.storageKey, JSON.stringify(activeSessions));
  }

  public getTabId(): string {
    return this.tabId;
  }

  public isNewTab(): boolean {
    // Check if sessionStorage has currentSession
    const hasSessionStorage = sessionStorage.getItem('currentSession');
    
    if (!hasSessionStorage) {
      // Check if we can recover a session (page refresh case)
      const sessions = this.getAllSessions();
      const now = Date.now();
      const refreshThreshold = 5000; // 5 seconds
      
      // If there's a very recent session, this might be a page refresh
      for (const session of Object.values(sessions)) {
        if (now - session.timestamp < refreshThreshold && this.isTokenValid(session.token)) {
          return false; // Not a new tab, likely a refresh
        }
      }
      
      return true; // Truly a new tab
    }
    
    return false; // Has session storage, not a new tab
  }

  private tryRecoverSession(): boolean {
    // Try to find a recent session that might belong to this tab after refresh
    const sessions = this.getAllSessions();
    const now = Date.now();
    const refreshThreshold = 5000; // 5 seconds threshold for refresh detection
    
    // Look for the most recent session that could be from this tab
    let mostRecentSession: SessionData | null = null;
    let mostRecentTime = 0;
    
    for (const session of Object.values(sessions)) {
      if (now - session.timestamp < refreshThreshold && session.timestamp > mostRecentTime) {
        mostRecentSession = session;
        mostRecentTime = session.timestamp;
      }
    }
    
    if (mostRecentSession && this.isTokenValid(mostRecentSession.token)) {
      // Recover the session for this tab
      sessionStorage.setItem('currentSession', JSON.stringify(mostRecentSession));
      
      // Update the session with new tabId and timestamp
      const updatedSession = {
        ...mostRecentSession,
        tabId: this.tabId,
        timestamp: now
      };
      
      const allSessions = this.getAllSessions();
      allSessions[this.tabId] = updatedSession;
      localStorage.setItem(this.storageKey, JSON.stringify(allSessions));
      
      return true;
    }
    
    return false;
  }

  private markTabForRecovery(): void {
    // Update timestamp to mark this session as recently active
    const currentSession = this.getSession();
    if (currentSession) {
      this.updateSession({ timestamp: Date.now() });
    }
  }

  public getSessionsByRole(role: string): SessionData[] {
    const sessions = this.getAllSessions();
    return Object.values(sessions).filter(session => session.role === role);
  }

  // Method to detect if user has multiple roles in different tabs
  public getUserRoles(): string[] {
    const sessions = this.getAllSessions();
    const currentUser = this.getSession()?.user;
    
    if (!currentUser) return [];

    const userSessions = Object.values(sessions).filter(
      session => session.user?.email === currentUser.email
    );

    return [...new Set(userSessions.map(session => session.role))];
  }
}

export default TabSessionManager;
