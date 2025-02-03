export interface UserDTO {
  id: number;
  username: string;
}

interface ActivityLog {
  time: string;
  description: string;
}
interface DateGroupedLogs {
  date: string;
  logs: ActivityLog[];
}

export type SystemLogResponse = DateGroupedLogs[];
  