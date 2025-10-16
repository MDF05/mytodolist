export interface TaskNote {
  id: string;
  text: string;
  completed: boolean;
  archived: boolean;
  footnote: string;
  createdAt: string;
  updatedAt: string;
  history: TaskHistory[];
}

export interface TaskHistory {
  id: string;
  text: string;
  timestamp: string;
}

export type Filter = "ALL" | "COMPLETED" | "INCOMPLETE" | "ARCHIVED";
export type SortOrder = "NEWEST" | "OLDEST";
