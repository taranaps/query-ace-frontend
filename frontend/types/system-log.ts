export interface SystemLog {
    date: string;
    logs: LogEntry[];
  }
  
  export interface LogEntry {
    time: string;
    description: string;
  }
  
  export interface ApiResponse<T> {
    data?: T;
    error?: string;
  }