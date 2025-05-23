"use client"

import React from 'react';
import { SessionData } from '../types';

interface SessionSelectorProps {
  sessions: SessionData[];
  selectedSessionId: string;
  onSelectSession: (sessionId: string) => void;
}

const SessionSelector: React.FC<SessionSelectorProps> = ({ 
  sessions, 
  selectedSessionId, 
  onSelectSession 
}) => {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {sessions.map((session) => (
        <button
          key={session.id}
          className={`px-4 py-2 rounded-lg text-base font-semibold border border-[var(--border-color)] shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 ${
            selectedSessionId === session.id
              ? 'bg-[var(--accent)] text-[var(--accent-foreground)] shadow-md'
              : 'bg-[var(--card-bg)] text-[var(--text-primary)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]'
          }`}
          onClick={() => onSelectSession(session.id)}
        >
          {session.name}
        </button>
      ))}
    </div>
  );
};

export default SessionSelector;
