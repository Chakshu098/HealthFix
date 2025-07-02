'use client';

import * as React from 'react';
import type { Report } from '@/lib/types';

interface ReportsContextType {
  reports: Report[];
  addReport: (report: Report) => void;
}

const ReportsContext = React.createContext<ReportsContextType | undefined>(undefined);

const isBrowser = typeof window !== 'undefined';

export function ReportsProvider({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = React.useState<Report[]>(() => {
    if (!isBrowser) return [];
    try {
      const item = window.localStorage.getItem('healthfix-reports');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  });

  React.useEffect(() => {
    if (!isBrowser) return;
    try {
      window.localStorage.setItem('healthfix-reports', JSON.stringify(reports));
    } catch (error) {
      console.error(error);
    }
  }, [reports]);

  const addReport = (report: Report) => {
    setReports((prevReports) => [...prevReports, report]);
  };

  return (
    <ReportsContext.Provider value={{ reports, addReport }}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const context = React.useContext(ReportsContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
}
