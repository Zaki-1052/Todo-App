import React, { useState, useEffect, useReducer, useContext, createContext, useRef, useCallback, useMemo } from 'react';
import { styled, ThemeProvider, createGlobalStyle } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AppBar, Toolbar, Typography, Button, IconButton, TextField, Checkbox, 
  Drawer, List, ListItem, ListItemText, ListItemIcon, Divider, Chip, 
  Paper, Switch, MenuItem, Select, FormControl, InputLabel, FormControlLabel,
  Card, CardContent, CardHeader, Avatar, Badge, CircularProgress,
  Snackbar, Alert, Grid, Box, Container, Tooltip, Fab, SelectChangeEvent
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Alarm as AlarmIcon,
  CheckCircle as CheckCircleIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Mic as MicIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  DragIndicator as DragIndicatorIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Home as HomeIcon,
  Timeline as TimelineIcon,
  EmojiEvents as TrophyIcon,
  AccessTime as TimeIcon,
  Search as SearchIcon,
  MoreVert as MoreIcon,
  Close as CloseIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Refresh as RefreshIcon,
  Menu as MenuIcon,
  AccountCircle as AccountIcon,
  ColorLens as ThemeIcon,
  VolumeUp as VoiceIcon,
  Save as SaveIcon,
  History as HistoryIcon,
  Folder as FolderIcon,
  Work as WorkIcon,
  Person as PersonIcon,
  ShoppingCart as ShoppingCartIcon,
  FitnessCenter as FitnessCenterIcon,
  AccountBalance as AccountBalanceIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  MoreHoriz as MoreHorizIcon,
  LocalHospital as LocalHospitalIcon,
  ViewKanban as ViewKanbanIcon,
  CalendarToday as CalendarTodayIcon
} from '@mui/icons-material';

// Chart imports
// You may need to install these dependencies
// npm install react-chartjs-2 chart.js
import { Line, Bar, Pie } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  ArcElement, 
  Title, 
  Tooltip as ChartTooltip, 
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  ArcElement, 
  Title, 
  ChartTooltip, 
  Legend,
  Filler
);

// Define SpeechRecognition types for TypeScript
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  error: any;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  grammars: any;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: Event) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionConstructor {
  new(): SpeechRecognition;
  prototype: SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

// =======================================
// Type Definitions
// =======================================

type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
type TaskStatus = 'todo' | 'in-progress' | 'done' | 'archived';
type TaskCategory = 'work' | 'personal' | 'shopping' | 'health' | 'finance' | 'education' | 'social' | 'other';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  estimatedTime?: number; // in minutes
  actualTime?: number; // in minutes
  parentId?: string;
  childIds: string[];
  relatedIds: string[];
  category: TaskCategory;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  reminderTime?: Date;
  xpReward: number;
  isRecurring: boolean;
  recurringPattern?: string;
  assignee?: string;
  attachments?: string[];
  notes?: string;
  location?: string;
  progress: number; // 0-100
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  xpReward: number;
  condition: string;
  progress: number; // 0-100
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  xpReward: number;
  progress: number; // 0-100
  taskIds: string[];
}

interface User {
  id: string;
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  theme: 'light' | 'dark' | 'system';
  achievements: Achievement[];
  activeChallenges: Challenge[];
  completedChallenges: Challenge[];
  settings: UserSettings;
  stats: UserStats;
}

interface UserSettings {
  enableNotifications: boolean;
  enableSounds: boolean;
  enableVoiceCommands: boolean;
  enableAnimations: boolean;
  showCompletedTasks: boolean;
  defaultView: 'list' | 'kanban' | 'calendar';
  language: string;
  startOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 is Sunday
  workingHours: {
    start: string; // format: "HH:MM"
    end: string; // format: "HH:MM"
  };
  workingDays: boolean[]; // Array of 7 booleans, true if working day
}

interface UserStats {
  tasksCompleted: number;
  tasksCreated: number;
  totalTimeSpent: number; // in minutes
  longestStreak: number; // in days
  currentStreak: number; // in days
  categoriesDistribution: Record<TaskCategory, number>;
  productiveHours: number[]; // 24 entries, one for each hour
  productiveDays: number[]; // 7 entries, one for each day
}

interface AppState {
  tasks: Record<string, Task>;
  user: User;
  isLoading: boolean;
  error: string | null;
  notification: {
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  };
  ui: {
    selectedTaskId: string | null;
    expandedTaskIds: string[];
    isDragging: boolean;
    searchQuery: string;
    currentView: 'list' | 'kanban' | 'calendar' | 'analytics';
    filters: {
      status: TaskStatus[];
      priority: TaskPriority[];
      category: TaskCategory[];
      tags: string[];
      dueDate: [Date | null, Date | null]; // [start, end]
    };
    sort: {
      field: keyof Task;
      direction: 'asc' | 'desc';
    };
    sidebarOpen: boolean;
    settingsOpen: boolean;
    isRecording: boolean;
  };
  history: {
    past: AppState[];
    future: AppState[];
  };
}

type ActionType =
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'childIds' | 'xpReward' | 'progress'> }
  | { type: 'UPDATE_TASK'; payload: Partial<Task> & { id: string } }
  | { type: 'DELETE_TASK'; payload: { id: string } }
  | { type: 'COMPLETE_TASK'; payload: { id: string } }
  | { type: 'SET_TASK_PROGRESS'; payload: { id: string; progress: number } }
  | { type: 'SET_SELECTED_TASK'; payload: { id: string | null } }
  | { type: 'TOGGLE_EXPAND_TASK'; payload: { id: string } }
  | { type: 'SET_UI_STATE'; payload: Partial<AppState['ui']> }
  | { type: 'SET_FILTERS'; payload: Partial<AppState['ui']['filters']> }
  | { type: 'SET_SORT'; payload: AppState['ui']['sort'] }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'AWARD_XP'; payload: { xp: number } }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: { id: string } }
  | { type: 'START_CHALLENGE'; payload: Challenge }
  | { type: 'COMPLETE_CHALLENGE'; payload: { id: string } }
  | { type: 'SET_NOTIFICATION'; payload: AppState['notification'] }
  | { type: 'CLEAR_NOTIFICATION' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_TASKS'; payload: AppState['tasks'] }
  | { type: 'SET_USER'; payload: AppState['user'] }
  | { type: 'SET_IS_LOADING'; payload: AppState['isLoading'] }
  | { type: 'SET_ERROR'; payload: AppState['error'] }
  | { type: 'SET_NOTIFICATION'; payload: AppState['notification'] }
  | { type: 'SET_UI'; payload: AppState['ui'] };

interface DragItem {
  id: string;
  type: 'task';
  index: number;
  parentId?: string;
}

type ThemeType = {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  error: string;
  text: string;
  textSecondary: string;
  divider: string;
  success: string;
  warning: string;
  info: string;
  shadow: string;
  transition: string;
};

// =======================================
// Hooks and Utilities
// =======================================

// Context Setup
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<ActionType>;
}>({
  state: {} as AppState,
  dispatch: () => {},
});

// LocalStorage persistence hook
const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };

  return [storedValue, setValue];
};

// Generate unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Date formatting utility
const formatDate = (date: Date | undefined): string => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format time duration
const formatDuration = (minutes: number | undefined): string => {
  if (!minutes) return '0m';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

// Calculate XP based on task properties
const calculateTaskXP = (task: Partial<Task>): number => {
  let xp = 10; // Base XP

  // Bonus for priority
  switch (task.priority) {
    case 'low': xp += 5; break;
    case 'medium': xp += 10; break;
    case 'high': xp += 15; break;
    case 'urgent': xp += 20; break;
  }

  // Bonus for estimated time
  if (task.estimatedTime) {
    xp += Math.floor(task.estimatedTime / 30) * 5; // 5 XP per 30 minutes
  }

  // Bonus for having a description
  if (task.description && task.description.length > 10) {
    xp += 5;
  }

  // Bonus for having subtasks
  if (task.childIds && task.childIds.length > 0) {
    xp += task.childIds.length * 3;
  }

  return xp;
};

// Calculate level from XP
const calculateLevel = (xp: number): { level: number; xpToNextLevel: number } => {
  const baseXP = 100;
  const exponent = 1.5;
  let level = 1;
  let xpNeeded = baseXP;
  let totalXpNeeded = xpNeeded;

  while (xp >= totalXpNeeded) {
    level++;
    xpNeeded = Math.floor(baseXP * Math.pow(level, exponent));
    totalXpNeeded += xpNeeded;
  }

  const xpToNextLevel = totalXpNeeded - xp;
  return { level, xpToNextLevel };
};

// NLP Task parsing
const parseTaskText = (text: string): Partial<Task> => {
  const taskDetails: Partial<Task> = {
    title: text,
    priority: 'medium',
    status: 'todo',
    category: 'other',
    relatedIds: [],
    isRecurring: false,
    tags: []
  };

  // Extract due date
  const datePatterns = [
    { regex: /tomorrow at (\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i, handler: (match: RegExpMatchArray) => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const timeStr = match[1];
      const [hours, minutes] = parseTimeString(timeStr);
      tomorrow.setHours(hours, minutes || 0, 0, 0);
      return tomorrow;
    }},
    { regex: /today at (\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i, handler: (match: RegExpMatchArray) => {
      const today = new Date();
      const timeStr = match[1];
      const [hours, minutes] = parseTimeString(timeStr);
      today.setHours(hours, minutes || 0, 0, 0);
      return today;
    }},
    { regex: /next (\w+) at (\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i, handler: (match: RegExpMatchArray) => {
      const dayOfWeek = match[1].toLowerCase();
      const timeStr = match[2];
      const daysMap: Record<string, number> = { 
        sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 
      };
      const today = new Date();
      const targetDay = daysMap[dayOfWeek];
      const daysToAdd = (targetDay + 7 - today.getDay()) % 7 || 7;
      const result = new Date();
      result.setDate(today.getDate() + daysToAdd);
      const [hours, minutes] = parseTimeString(timeStr);
      result.setHours(hours, minutes || 0, 0, 0);
      return result;
    }},
    { regex: /on (\d{1,2})[\/\-](\d{1,2})(?:[\/\-](\d{2,4}))?/i, handler: (match: RegExpMatchArray) => {
      const month = parseInt(match[1]) - 1;
      const day = parseInt(match[2]);
      const yearStr = match[3];
      const year = yearStr ? parseInt(yearStr) : new Date().getFullYear();
      return new Date(year < 100 ? year + 2000 : year, month, day);
    }},
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern.regex);
    if (match) {
      taskDetails.dueDate = pattern.handler(match);
      taskDetails.title = text.replace(match[0], '').trim();
      break;
    }
  }

  // Parse time string helper function
  function parseTimeString(timeStr: string): [number, number | undefined] {
    const timeMatch = timeStr.match(/(\d{1,2})(?::(\d{2}))?(?:\s*(am|pm))?/i);
    if (!timeMatch) return [0, 0];
    
    let hours = parseInt(timeMatch[1]);
    const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : undefined;
    const ampm = timeMatch[3]?.toLowerCase();
    
    if (ampm === 'pm' && hours < 12) hours += 12;
    if (ampm === 'am' && hours === 12) hours = 0;
    
    return [hours, minutes];
  }

  // Extract priority
  const priorityPatterns = [
    { regex: /\b(high priority|urgent|asap)\b/i, priority: 'urgent' as TaskPriority },
    { regex: /\b(important|high)\b/i, priority: 'high' as TaskPriority },
    { regex: /\b(medium|normal)\b/i, priority: 'medium' as TaskPriority },
    { regex: /\b(low|later|whenever)\b/i, priority: 'low' as TaskPriority },
  ];

  for (const pattern of priorityPatterns) {
    if (pattern.regex.test(text)) {
      taskDetails.priority = pattern.priority;
      taskDetails.title = taskDetails.title?.replace(pattern.regex, '').trim() || '';
      break;
    }
  }

  // Extract category
  const categoryPatterns = [
    { regex: /\b(work|job|office|project|client)\b/i, category: 'work' as TaskCategory },
    { regex: /\b(personal|home|family|house)\b/i, category: 'personal' as TaskCategory },
    { regex: /\b(shop|buy|purchase|grocery|store)\b/i, category: 'shopping' as TaskCategory },
    { regex: /\b(health|exercise|workout|doctor|gym|fitness)\b/i, category: 'health' as TaskCategory },
    { regex: /\b(money|bank|finance|budget|bill|payment)\b/i, category: 'finance' as TaskCategory },
    { regex: /\b(class|study|learn|course|education|school)\b/i, category: 'education' as TaskCategory },
    { regex: /\b(friend|meet|party|social|lunch|dinner|date)\b/i, category: 'social' as TaskCategory },
  ];

  for (const pattern of categoryPatterns) {
    if (pattern.regex.test(text)) {
      taskDetails.category = pattern.category;
      break;
    }
  }

  // Extract tags (words with #)
  const tagMatches = text.match(/#\w+/g);
  if (tagMatches) {
    taskDetails.tags = tagMatches.map(tag => tag.substring(1).toLowerCase());
    taskDetails.title = taskDetails.title?.replace(/#\w+/g, '').trim() || '';
  } else {
    taskDetails.tags = [];
  }

  // Extract estimated time
  const timeMatch = text.match(/\b(?:takes|take|for|in|about)\s+(\d+)\s+(minute|minutes|min|mins|hour|hours|hr|hrs)\b/i);
  if (timeMatch) {
    const amount = parseInt(timeMatch[1]);
    const unit = timeMatch[2].toLowerCase();
    const isHour = unit.startsWith('h');
    taskDetails.estimatedTime = isHour ? amount * 60 : amount;
    taskDetails.title = taskDetails.title?.replace(timeMatch[0], '').trim() || '';
  }

  return taskDetails;
};

// Voice command hook
const useVoiceCommands = (
  enabled: boolean, 
  onResult: (text: string) => void,
  onStart?: () => void,
  onEnd?: () => void
) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // Check browser support
  useEffect(() => {
    setIsSupported(
      typeof window !== 'undefined' && 
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    );
  }, []);
  
  const startListening = useCallback(() => {
    if (!enabled || !isSupported) return;
    
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        if (onStart) onStart();
      };
      
      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        stopListening();
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (onEnd) onEnd();
      };
      
      recognitionRef.current.start();
    } catch (error) {
      console.error('Speech recognition error:', error);
      setIsListening(false);
      if (onEnd) onEnd();
    }
  }, [enabled, isSupported, onResult, onStart, onEnd]);
  
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);
  
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  
  return { isListening, startListening, stopListening, isSupported };
};

// Auto-categorize task
const autoCategorizeTask = (task: Partial<Task>): TaskCategory => {
  if (!task.title) return 'other';
  
  const title = task.title.toLowerCase();
  const categoryKeywords: Record<TaskCategory, string[]> = {
    work: ['work', 'project', 'meeting', 'client', 'deadline', 'presentation', 'report', 'email', 'call', 'conference'],
    personal: ['home', 'clean', 'laundry', 'cook', 'personal', 'family', 'hobby', 'relax', 'sleep'],
    shopping: ['buy', 'shop', 'purchase', 'grocery', 'store', 'mall', 'order', 'amazon', 'online'],
    health: ['workout', 'gym', 'exercise', 'run', 'jog', 'doctor', 'dentist', 'medicine', 'health', 'fitness'],
    finance: ['pay', 'bill', 'bank', 'money', 'budget', 'tax', 'finance', 'invest', 'loan', 'expense'],
    education: ['study', 'learn', 'read', 'book', 'course', 'class', 'homework', 'assignment', 'exam', 'test'],
    social: ['friend', 'party', 'meet', 'dinner', 'lunch', 'coffee', 'date', 'birthday', 'anniversary', 'social'],
    other: []
  };
  
  // Score each category
  const scores: Record<TaskCategory, number> = {
    work: 0, personal: 0, shopping: 0, health: 0, finance: 0, education: 0, social: 0, other: 0
  };
  
  // Score based on title keywords
  Object.entries(categoryKeywords).forEach(([category, keywords]) => {
    keywords.forEach(keyword => {
      if (title.includes(keyword)) {
        scores[category as TaskCategory] += 1;
      }
    });
  });
  
  // Use any existing tags to improve categorization
  task.tags?.forEach(tag => {
    Object.entries(categoryKeywords).forEach(([category, keywords]) => {
      if (keywords.includes(tag)) {
        scores[category as TaskCategory] += 2; // Tags are stronger signals
      }
    });
  });
  
  // Find the category with the highest score
  let bestCategory: TaskCategory = 'other';
  let highestScore = 0;
  
  Object.entries(scores).forEach(([category, score]) => {
    if (score > highestScore) {
      highestScore = score;
      bestCategory = category as TaskCategory;
    }
  });
  
  return bestCategory;
};

// Time estimating function based on similar tasks
const estimateTaskTime = (title: string, existingTasks: Record<string, Task>): number | undefined => {
  const similarTasks = Object.values(existingTasks).filter(task => 
    task.actualTime && 
    task.title.toLowerCase().includes(title.toLowerCase()) || 
    title.toLowerCase().includes(task.title.toLowerCase())
  );
  
  if (similarTasks.length === 0) return undefined;
  
  // Calculate average time of similar tasks
  const totalTime = similarTasks.reduce((sum, task) => sum + (task.actualTime || 0), 0);
  return Math.round(totalTime / similarTasks.length);
};

// App reducer
const appReducer = (state: AppState, action: ActionType): AppState => {
  // Fix for the notification type in createHistoryPoint
const createHistoryPoint = (newState: AppState): AppState => {
  // Create a type-safe version of the state
  const validState: AppState = {
    ...newState,
    notification: {
      ...newState.notification,
      // Force the type to be one of the allowed values
      type: (newState.notification.type as any === 'success' || 
             newState.notification.type as any === 'error' || 
             newState.notification.type as any === 'info' || 
             newState.notification.type as any === 'warning') 
        ? newState.notification.type as 'success' | 'error' | 'info' | 'warning'
        : 'info' // Default fallback
    }
  };
  
  return {
    ...validState,
    history: {
      past: [...state.history.past, state],
      future: []
    }
  };
};


  switch (action.type) {
    case 'ADD_TASK': {
      const newTaskId = generateId();
      const now = new Date();
      const taskData = action.payload;
      
      // Auto-categorize if no category specified
      const category = taskData.category || autoCategorizeTask(taskData);
      
      // Estimate time if not provided
      const estimatedTime = taskData.estimatedTime || estimateTaskTime(taskData.title, state.tasks);
      
      const newTask: Task = {
        id: newTaskId,
        title: taskData.title,
        description: taskData.description || '',
        status: taskData.status || 'todo',
        priority: taskData.priority || 'medium',
        dueDate: taskData.dueDate,
        estimatedTime,
        actualTime: taskData.actualTime,
        parentId: taskData.parentId,
        childIds: [],
        relatedIds: taskData.relatedIds || [],
        category,
        tags: taskData.tags || [],
        createdAt: now,
        updatedAt: now,
        completedAt: undefined,
        reminderTime: taskData.reminderTime,
        xpReward: calculateTaskXP(taskData),
        isRecurring: taskData.isRecurring || false,
        recurringPattern: taskData.recurringPattern,
        assignee: taskData.assignee,
        attachments: taskData.attachments || [],
        notes: taskData.notes,
        location: taskData.location,
        progress: 0
      };
      
      const tasks = { ...state.tasks, [newTaskId]: newTask };
      
      // If this is a subtask, update the parent task
      if (taskData.parentId && tasks[taskData.parentId]) {
        tasks[taskData.parentId] = {
          ...tasks[taskData.parentId],
          childIds: [...tasks[taskData.parentId].childIds, newTaskId],
          updatedAt: now
        };
      }
      
      const newState = {
        ...state,
        tasks,
        ui: {
          ...state.ui,
          selectedTaskId: newTaskId
        }
      };
      
      return createHistoryPoint(newState);
    }
    
    case 'UPDATE_TASK': {
      const { id, ...updates } = action.payload;
      if (!state.tasks[id]) return state;
      
      const now = new Date();
      const updatedTask = {
        ...state.tasks[id],
        ...updates,
        updatedAt: now
      };
      
      const newState = {
        ...state,
        tasks: {
          ...state.tasks,
          [id]: updatedTask
        }
      };
      
      return createHistoryPoint(newState);
    }
    
    case 'DELETE_TASK': {
      const { id } = action.payload;
      if (!state.tasks[id]) return state;
      
      const tasks = { ...state.tasks };
      const taskToDelete = tasks[id];
      
      // First remove from parent's childIds if it has a parent
      if (taskToDelete.parentId && tasks[taskToDelete.parentId]) {
        tasks[taskToDelete.parentId] = {
          ...tasks[taskToDelete.parentId],
          childIds: tasks[taskToDelete.parentId].childIds.filter(childId => childId !== id),
          updatedAt: new Date()
        };
      }
      
      // Recursively delete all child tasks
      const deleteChildTasks = (taskId: string) => {
        const task = tasks[taskId];
        if (!task) return;
        
        // Delete all children first
        task.childIds.forEach(childId => {
          deleteChildTasks(childId);
        });
        
        // Then delete this task
        delete tasks[taskId];
      };
      
      // Start deleting from the top task
      deleteChildTasks(id);
      
      // Update UI state if needed
      const ui = { ...state.ui };
      if (ui.selectedTaskId === id) {
        ui.selectedTaskId = null;
      }
      
      const newState = {
        ...state,
        tasks,
        ui
      };
      
      return createHistoryPoint(newState);
    }
    
    case 'COMPLETE_TASK': {
      const { id } = action.payload;
      if (!state.tasks[id]) return state;
      
      const task = state.tasks[id];
      
      // If task is already completed, don't process again
      if (task.status === 'done' && task.completedAt) {
        return state;
      }
      
      const now = new Date();
      const completedTask = {
        ...task,
        status: 'done' as TaskStatus,
        completedAt: now,
        updatedAt: now,
        progress: 100
      };
      
      // Award XP to the user
      const newXp = state.user.xp + completedTask.xpReward;
      const { level, xpToNextLevel } = calculateLevel(newXp);
      
      // Check for level up
      const isLevelUp = level > state.user.level;
      
      // Update user stats
      const userStats = {
        ...state.user.stats,
        tasksCompleted: state.user.stats.tasksCompleted + 1,
        totalTimeSpent: state.user.stats.totalTimeSpent + (completedTask.actualTime || 0),
        categoriesDistribution: {
          ...state.user.stats.categoriesDistribution,
          [completedTask.category]: (state.user.stats.categoriesDistribution[completedTask.category] || 0) + 1
        }
      };
      
      const newState: AppState = {
        ...state,
        tasks: {
          ...state.tasks,
          [id]: completedTask
        },
        user: {
          ...state.user,
          xp: newXp,
          level,
          xpToNextLevel,
          stats: userStats
        },
        notification: isLevelUp ? {
          show: true,
          message: `Level up! You are now level ${level}`,
          type: 'success' as const  // Use const assertion
        } : state.notification
      };
      
      return createHistoryPoint(newState);
    }
    
    case 'SET_TASK_PROGRESS': {
      const { id, progress } = action.payload;
      if (!state.tasks[id]) return state;
      
      const updatedTask = {
        ...state.tasks[id],
        progress: Math.max(0, Math.min(100, progress)),
        updatedAt: new Date(),
        status: progress >= 100 ? 'done' as TaskStatus : 
                progress > 0 ? 'in-progress' as TaskStatus : 
                state.tasks[id].status
      };
      
      // If completed, set completedAt
      if (progress >= 100 && !updatedTask.completedAt) {
        updatedTask.completedAt = new Date();
      } else if (progress < 100) {
        updatedTask.completedAt = undefined;
      }
      
      const newState = {
        ...state,
        tasks: {
          ...state.tasks,
          [id]: updatedTask
        }
      };
      
      return createHistoryPoint(newState);
    }
    
    case 'SET_SELECTED_TASK': {
      return {
        ...state,
        ui: {
          ...state.ui,
          selectedTaskId: action.payload.id
        }
      };
    }
    
    case 'TOGGLE_EXPAND_TASK': {
      const { id } = action.payload;
      const isExpanded = state.ui.expandedTaskIds.includes(id);
      
      return {
        ...state,
        ui: {
          ...state.ui,
          expandedTaskIds: isExpanded 
            ? state.ui.expandedTaskIds.filter(taskId => taskId !== id)
            : [...state.ui.expandedTaskIds, id]
        }
      };
    }
    
    case 'SET_UI_STATE': {
      return {
        ...state,
        ui: {
          ...state.ui,
          ...action.payload
        }
      };
    }

    case 'SET_UI': {
      return {
        ...state,
        ui: action.payload
      };
    }
    
    case 'SET_FILTERS': {
      return {
        ...state,
        ui: {
          ...state.ui,
          filters: {
            ...state.ui.filters,
            ...action.payload
          }
        }
      };
    }
    
    case 'SET_SORT': {
      return {
        ...state,
        ui: {
          ...state.ui,
          sort: action.payload
        }
      };
    }
    
    case 'UPDATE_USER': {
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      };
    }

    case 'SET_USER': {
      return {
        ...state,
        user: action.payload
      };
    }

    case 'SET_TASKS': {
      return {
        ...state,
        tasks: action.payload
      };
    }

    case 'SET_IS_LOADING': {
      return {
        ...state,
        isLoading: action.payload
      };
    }

    case 'SET_ERROR': {
      return {
        ...state,
        error: action.payload
      };
    }
    
    case 'AWARD_XP': {
      const newXp = state.user.xp + action.payload.xp;
      const { level, xpToNextLevel } = calculateLevel(newXp);
      
      return {
        ...state,
        user: {
          ...state.user,
          xp: newXp,
          level,
          xpToNextLevel
        }
      };
    }
    
    case 'UNLOCK_ACHIEVEMENT': {
      const { id } = action.payload;
      const achievement = state.user.achievements.find(a => a.id === id);
      
      if (!achievement || achievement.unlockedAt) return state;
      
      const updatedAchievement = {
        ...achievement,
        unlockedAt: new Date(),
        progress: 100
      };
      
      const newState: AppState = {
        ...state,
        user: {
          ...state.user,
          xp: state.user.xp + updatedAchievement.xpReward,
          achievements: state.user.achievements.map(a => 
            a.id === id ? updatedAchievement : a
          )
        },
        notification: {
          show: true,
          message: `Achievement unlocked: ${updatedAchievement.title}`,
          type: 'success' as const  // Use const assertion
        }
      };
            
      // Recalculate level
      const { level, xpToNextLevel } = calculateLevel(newState.user.xp);
      newState.user.level = level;
      newState.user.xpToNextLevel = xpToNextLevel;
      
      return createHistoryPoint(newState);
    }
    
    case 'START_CHALLENGE': {
      const challenge = action.payload;
      
      // Don't add if already in active challenges
      if (state.user.activeChallenges.some(c => c.id === challenge.id)) {
        return state;
      }
      
      return {
        ...state,
        user: {
          ...state.user,
          activeChallenges: [...state.user.activeChallenges, challenge]
        },
        notification: {
          show: true,
          message: `New challenge started: ${challenge.title}`,
          type: 'info'
        }
      };
    }
    
    case 'COMPLETE_CHALLENGE': {
      const { id } = action.payload;
      const challenge = state.user.activeChallenges.find(c => c.id === id);
      
      if (!challenge) return state;
      
      const completedChallenge = {
        ...challenge,
        progress: 100
      };
      
      return {
        ...state,
        user: {
          ...state.user,
          xp: state.user.xp + challenge.xpReward,
          activeChallenges: state.user.activeChallenges.filter(c => c.id !== id),
          completedChallenges: [...state.user.completedChallenges, completedChallenge]
        },
        notification: {
          show: true,
          message: `Challenge completed: ${challenge.title}`,
          type: 'success'
        }
      };
    }
    
    case 'SET_NOTIFICATION': {
      return {
        ...state,
        notification: action.payload
      };
    }
    
    case 'CLEAR_NOTIFICATION': {
      return {
        ...state,
        notification: {
          show: false,
          message: '',
          type: 'info'
        }
      };
    }
    
    case 'UNDO': {
      if (state.history.past.length === 0) return state;
      
      const previous = state.history.past[state.history.past.length - 1];
      const newPast = state.history.past.slice(0, state.history.past.length - 1);
      
      return {
        ...previous,
        history: {
          past: newPast,
          future: [state, ...state.history.future]
        }
      };
    }
    
    case 'REDO': {
      if (state.history.future.length === 0) return state;
      
      const next = state.history.future[0];
      const newFuture = state.history.future.slice(1);
      
      return {
        ...next,
        history: {
          past: [...state.history.past, state],
          future: newFuture
        }
      };
    }
    
    default:
      return state;
  }
};

// Initial state
const getInitialState = (): AppState => {
  const defaultTheme: 'light' | 'dark' | 'system' = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  const initialAchievements: Achievement[] = [
    {
      id: 'first-task',
      title: 'First Steps',
      description: 'Create your first task',
      icon: '🔰',
      xpReward: 50,
      condition: 'Create 1 task',
      progress: 0
    },
    {
      id: 'task-master',
      title: 'Task Master',
      description: 'Complete 10 tasks',
      icon: '🏆',
      xpReward: 100,
      condition: 'Complete 10 tasks',
      progress: 0
    },
    {
      id: 'organization-guru',
      title: 'Organization Guru',
      description: 'Create tasks in 5 different categories',
      icon: '📊',
      xpReward: 150,
      condition: 'Use 5 categories',
      progress: 0
    },
    {
      id: 'streak-starter',
      title: 'Streak Starter',
      description: 'Complete at least one task for 3 days in a row',
      icon: '🔥',
      xpReward: 200,
      condition: '3-day streak',
      progress: 0
    },
    {
      id: 'planning-pro',
      title: 'Planning Pro',
      description: 'Create a task with at least 3 subtasks',
      icon: '🧩',
      xpReward: 100,
      condition: 'Task with 3 subtasks',
      progress: 0
    }
  ];

  return {
    tasks: {},
    user: {
      id: 'user-1',
      name: 'User',
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      theme: defaultTheme,
      achievements: initialAchievements,
      activeChallenges: [],
      completedChallenges: [],
      settings: {
        enableNotifications: true,
        enableSounds: true,
        enableVoiceCommands: true,
        enableAnimations: true,
        showCompletedTasks: true,
        defaultView: 'list',
        language: 'en',
        startOfWeek: 0,
        workingHours: {
          start: '09:00',
          end: '17:00'
        },
        workingDays: [false, true, true, true, true, true, false]
      },
      stats: {
        tasksCompleted: 0,
        tasksCreated: 0,
        totalTimeSpent: 0,
        longestStreak: 0,
        currentStreak: 0,
        categoriesDistribution: {
          work: 0,
          personal: 0,
          shopping: 0,
          health: 0,
          finance: 0,
          education: 0,
          social: 0,
          other: 0
        },
        productiveHours: Array(24).fill(0),
        productiveDays: Array(7).fill(0)
      }
    },
    isLoading: false,
    error: null,
    notification: {
      show: false,
      message: '',
      type: 'info'
    },
    ui: {
      selectedTaskId: null,
      expandedTaskIds: [],
      isDragging: false,
      searchQuery: '',
      currentView: 'list',
      filters: {
        status: ['todo', 'in-progress'],
        priority: ['low', 'medium', 'high', 'urgent'],
        category: ['work', 'personal', 'shopping', 'health', 'finance', 'education', 'social', 'other'],
        tags: [],
        dueDate: [null, null]
      },
      sort: {
        field: 'dueDate',
        direction: 'asc'
      },
      sidebarOpen: true,
      settingsOpen: false,
      isRecording: false
    },
    history: {
      past: [],
      future: []
    }
  };
};

// Theme hook
const useTheme = () => {
  const { state } = useContext(AppContext);
  const userTheme = state.user?.theme || 'system';
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  const actualTheme = userTheme === 'system' ? systemTheme : userTheme;
  
  const themeValues: Record<'light' | 'dark', ThemeType> = {
    light: {
      primary: '#2196f3',
      secondary: '#ff9800',
      background: '#f5f5f5',
      surface: '#ffffff',
      error: '#f44336',
      text: '#212121',
      textSecondary: '#757575',
      divider: '#e0e0e0',
      success: '#4caf50',
      warning: '#ff9800',
      info: '#2196f3',
      shadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      transition: 'all 500ms cubic-bezier(0.16, 1, 0.3, 1)'
    },
    dark: {
      primary: '#90caf9',
      secondary: '#ffb74d',
      background: '#121212',
      surface: '#1e1e1e',
      error: '#f44336',
      text: '#ffffff',
      textSecondary: '#b0b0b0',
      divider: '#424242',
      success: '#66bb6a',
      warning: '#ffa726',
      info: '#42a5f5',
      shadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
      transition: 'all 500ms cubic-bezier(0.16, 1, 0.3, 1)'
    }
  };
  
  return themeValues[actualTheme];
};

// Hook for filtered and sorted tasks
const useFilteredTasks = () => {
  const { state } = useContext(AppContext);
  const { tasks, ui } = state;
  
  return useMemo(() => {
    const { filters, sort, searchQuery } = ui;
    
    return Object.values(tasks)
      .filter(task => {
        // Filter by status
        if (!filters.status.includes(task.status)) return false;
        
        // Filter by priority
        if (!filters.priority.includes(task.priority)) return false;
        
        // Filter by category
        if (!filters.category.includes(task.category)) return false;
        
        // Filter by tags
        if (filters.tags.length > 0 && !filters.tags.some(tag => task.tags.includes(tag))) {
          return false;
        }
        
        // Filter by due date range
        if (filters.dueDate[0] && task.dueDate && new Date(task.dueDate) < filters.dueDate[0]) {
          return false;
        }
        if (filters.dueDate[1] && task.dueDate && new Date(task.dueDate) > filters.dueDate[1]) {
          return false;
        }
        
        // Filter by search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            task.title.toLowerCase().includes(query) ||
            (task.description && task.description.toLowerCase().includes(query)) ||
            task.tags.some(tag => tag.toLowerCase().includes(query))
          );
        }
        
        return true;
      })
      .sort((a, b) => {
        const { field, direction } = sort;
        const modifier = direction === 'asc' ? 1 : -1;
        
        // Special case for dates
        if (field === 'dueDate' || field === 'createdAt' || field === 'updatedAt' || field === 'completedAt') {
          const aValue = a[field] ? new Date(a[field] as Date).getTime() : 0;
          const bValue = b[field] ? new Date(b[field] as Date).getTime() : 0;
          return (aValue - bValue) * modifier;
        }
        
        // General case
        const aValue = a[field];
        const bValue = b[field];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return aValue.localeCompare(bValue) * modifier;
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return (aValue - bValue) * modifier;
        }
        
        return 0;
      });
  }, [state.tasks, state.ui.filters, state.ui.sort, state.ui.searchQuery]);
};

// Hook for keyboard shortcuts
const useKeyboardShortcuts = () => {
  const { state, dispatch } = useContext(AppContext);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if in an input element
      if (e.target instanceof HTMLInputElement || 
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement) {
        return;
      }
      
      // Command/Ctrl + Z for undo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        dispatch({ type: 'UNDO' });
      }
      
      // Command/Ctrl + Shift + Z for redo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        dispatch({ type: 'REDO' });
      }
      
      // Command/Ctrl + N for new task
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        // This would trigger a modal for new task in the full implementation
        // For now we'll just create a basic task
        dispatch({
          type: 'ADD_TASK',
          payload: {
            title: 'New Task',
            description: '',
            status: 'todo',
            priority: 'medium',
            category: 'other',
            tags: [],
            isRecurring: false,
            relatedIds: []
          }
        });
      }
      
      // Escape key to close modals or deselect task
      if (e.key === 'Escape') {
        if (state.ui.selectedTaskId) {
          dispatch({ type: 'SET_SELECTED_TASK', payload: { id: null } });
        }
      }
      
      // / key to focus search
      if (e.key === '/' && !state.ui.selectedTaskId) {
        e.preventDefault();
        const searchInput = document.getElementById('task-search');
        if (searchInput) {
          searchInput.focus();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.ui.selectedTaskId, dispatch]);
};

// =======================================
// Components
// =======================================

// Global Styles
const GlobalStyle = createGlobalStyle<{theme: ThemeType}>`
  body {
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
    margin: 0;
    padding: 0;
    font-family: 'Roboto', 'Segoe UI', 'Arial', sans-serif;
    transition: ${props => props.theme.transition};
  }
  
  * {
    box-sizing: border-box;
  }
  
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${props => props.theme.background};
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.textSecondary};
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.primary};
  }
`;

// Animation variants for framer-motion
const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  },
  slideIn: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  },
  scale: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
    exit: { scale: 0.9, opacity: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  }
};

// Styled components
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

const MainContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const ContentContainer = styled.div<{ sidebarOpen: boolean }>`
  flex: 1;
  overflow: auto;
  padding: 20px;
  transition: margin-left 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  margin-left: ${props => props.sidebarOpen ? '250px' : '0'};
  
  @media (max-width: 768px) {
    margin-left: 0;
    padding: 16px;
  }
`;

const SidebarContainer = styled(motion.div)<{ isOpen: boolean }>`
  width: 250px;
  background-color: ${props => props.theme.surface};
  box-shadow: ${props => props.theme.shadow};
  position: fixed;
  height: 100%;
  top: 64px;
  left: 0;
  transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 1000;
  
  @media (max-width: 768px) {
    top: 56px;
  }
`;

const TaskCardContainer = styled(motion.div)`
  background-color: ${props => props.theme.surface};
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadow};
  margin-bottom: 16px;
  overflow: hidden;
  position: relative;
`;

const TaskCardContent = styled.div`
  padding: 16px;
`;

const TaskCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TaskCardTitle = styled.h3`
  margin: 0;
  color: ${props => props.theme.text};
  font-weight: 500;
`;

const TaskCardDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  margin: 8px 0;
`;

const TaskCardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`;

const TaskCardMetadata = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const TaskCardActions = styled.div`
  display: flex;
  gap: 8px;
`;

const TaskProgressBar = styled.div<{ progress: number; color: string }>`
  height: 4px;
  background-color: ${props => props.theme.divider};
  border-radius: 2px;
  overflow: hidden;
  margin: 8px 0;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.progress}%;
    background-color: ${props => props.color};
    transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }
`;

const TagContainer = styled(Chip)`
  margin-right: 4px;
  margin-bottom: 4px;
`;

const PriorityIndicator = styled.div<{ priority: TaskPriority }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
  background-color: ${props => {
    switch (props.priority) {
      case 'low': return props.theme.info;
      case 'medium': return props.theme.success;
      case 'high': return props.theme.warning;
      case 'urgent': return props.theme.error;
      default: return props.theme.info;
    }
  }};
`;

const SearchBar = styled(TextField)`
  background-color: ${props => props.theme.surface};
  border-radius: 4px;
  margin-bottom: 16px;
  width: 100%;
`;

const SectionTitle = styled.h2`
  color: ${props => props.theme.text};
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 500;
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  text-align: center;
  color: ${props => props.theme.textSecondary};
`;

const AddTaskFab = styled(Fab)`
  position: fixed !important;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
`;

const TaskDrawerContainer = styled(Drawer)`
  .MuiDrawer-paper {
    width: 100%;
    max-width: 500px;
    padding: 24px;
    
    @media (max-width: 600px) {
      max-width: none;
    }
  }
`;

const TaskFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
`;

const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      setHasError(true);
      setError(error.error);
      console.error('Error caught by ErrorBoundary:', error);
      return false;
    };

    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <h2>Something went wrong.</h2>
        <p>Try refreshing the page or contact support if the problem persists.</p>
        <pre style={{ textAlign: 'left', overflow: 'auto', background: '#f1f1f1', padding: 10 }}>
          {error?.toString() || 'Unknown error'}
        </pre>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </Button>
      </div>
    );
  }

  return <>{children}</>;
};

// Notification component
const NotificationSystem = () => {
  const { state, dispatch } = useContext(AppContext);
  const { notification } = state;

  const handleClose = () => {
    dispatch({ type: 'CLEAR_NOTIFICATION' });
  };

  return (
    <Snackbar
      open={notification.show}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <Alert 
        onClose={handleClose} 
        severity={notification.type} 
        variant="filled"
        sx={{ width: '100%' }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
};

// Progress Circle component
const ProgressCircle = ({ progress, size = 40, thickness = 4 }: { progress: number; size?: number; thickness?: number }) => {
  const theme = useTheme();
  
  const getColorForProgress = (progress: number) => {
    if (progress < 25) return theme.error;
    if (progress < 50) return theme.warning;
    if (progress < 75) return theme.info;
    return theme.success;
  };
  
  return (
    <CircularProgress
      variant="determinate"
      value={progress}
      size={size}
      thickness={thickness}
      sx={{ color: getColorForProgress(progress) }}
    />
  );
};

// Task Tag component
const TaskTag = ({ tag, onDelete }: { tag: string; onDelete?: () => void }) => {
  return (
    <TagContainer
      label={tag}
      size="small"
      color="primary"
      variant="outlined"
      onDelete={onDelete}
    />
  );
};

// Priority Badge component
const PriorityBadge = ({ priority }: { priority: TaskPriority }) => {
  const getPriorityLabel = (priority: TaskPriority) => {
    switch (priority) {
      case 'low': return 'Low';
      case 'medium': return 'Medium';
      case 'high': return 'High';
      case 'urgent': return 'Urgent';
      default: return 'Medium';
    }
  };
  
  const getPriorityColor = (priority: TaskPriority): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (priority) {
      case 'low': return 'info';
      case 'medium': return 'success';
      case 'high': return 'warning';
      case 'urgent': return 'error';
      default: return 'default';
    }
  };
  
  return (
    <Chip
      size="small"
      label={getPriorityLabel(priority)}
      color={getPriorityColor(priority)}
    />
  );
};

// Status Badge component
const StatusBadge = ({ status }: { status: TaskStatus }) => {
  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case 'todo': return 'To Do';
      case 'in-progress': return 'In Progress';
      case 'done': return 'Done';
      case 'archived': return 'Archived';
      default: return 'To Do';
    }
  };
  
  const getStatusColor = (status: TaskStatus): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (status) {
      case 'todo': return 'info';
      case 'in-progress': return 'warning';
      case 'done': return 'success';
      case 'archived': return 'default';
      default: return 'default';
    }
  };
  
  return (
    <Chip
      size="small"
      label={getStatusLabel(status)}
      color={getStatusColor(status)}
    />
  );
};

// Category Icon component
const CategoryIcon = ({ category }: { category: TaskCategory }) => {
  switch (category) {
    case 'work': return <IconButton size="small"><TimelineIcon /></IconButton>;
    case 'personal': return <IconButton size="small"><AccountIcon /></IconButton>;
    case 'shopping': return <IconButton size="small"><ShoppingCartIcon /></IconButton>;
    case 'health': return <IconButton size="small"><LocalHospitalIcon /></IconButton>;
    case 'finance': return <IconButton size="small"><AccountBalanceIcon /></IconButton>;
    case 'education': return <IconButton size="small"><SchoolIcon /></IconButton>;
    case 'social': return <IconButton size="small"><PeopleIcon /></IconButton>;
    default: return <IconButton size="small"><FolderIcon /></IconButton>;
  }
};

// Confetti effect component
const ConfettiEffect = ({ active }: { active: boolean }) => {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string; size: number; angle: number; speed: number; }[]>([]);
  // Fix for useRef missing initial value
const animationRef = useRef<number | null>(null);
  const colorsArray = ['#f44336', '#2196f3', '#ffeb3b', '#4caf50', '#9c27b0', '#ff9800'];
  
  useEffect(() => {
    if (active) {
      // Generate particles
      const newParticles = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        color: colorsArray[Math.floor(Math.random() * colorsArray.length)],
        size: Math.random() * 10 + 5,
        angle: Math.random() * 360,
        speed: Math.random() * 10 + 5
      }));
      
      setParticles(newParticles);
      
      // Animate particles
      let frame = 0;
      const animateParticles = () => {
        frame++;
        
        if (frame > 120) { // Stop after ~2 seconds
          setParticles([]);
          return;
        }
        
        setParticles(prevParticles => 
          prevParticles.map(particle => ({
            ...particle,
            x: particle.x + Math.cos(particle.angle * Math.PI / 180) * particle.speed,
            y: particle.y + Math.sin(particle.angle * Math.PI / 180) * particle.speed + 1, // Add gravity
            speed: particle.speed * 0.98 // Slow down
          })).filter(p => p.x > 0 && p.x < window.innerWidth && p.y > 0 && p.y < window.innerHeight) // Remove offscreen
        );
        
        animationRef.current = requestAnimationFrame(animateParticles);
      };
      
      animationRef.current = requestAnimationFrame(animateParticles);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [active, colorsArray]);
  
  if (!active && particles.length === 0) return null;
  
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}>
      {particles.map(particle => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            top: particle.y,
            left: particle.x,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
    </div>
  );
};

// UserLevel component
const UserLevel = () => {
  const { state } = useContext(AppContext);
  const { user } = state;
  
  return (
    <Box sx={{ my: 2, px: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Level {user.level}
      </Typography>
      <Box sx={{ position: 'relative', height: 8, bgcolor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            bgcolor: 'primary.main',
            width: `${100 - (user.xpToNextLevel / (user.xpToNextLevel + user.xp % (user.xpToNextLevel + user.xp))) * 100}%`,
            transition: 'width 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
        <Typography variant="caption">
          {user.xp} XP
        </Typography>
        <Typography variant="caption">
          {user.xpToNextLevel} XP to level {user.level + 1}
        </Typography>
      </Box>
    </Box>
  );
};

// TaskItem component
const TaskItem = ({ task, isChild = false }: { task: Task; isChild?: boolean }) => {
  const { state, dispatch } = useContext(AppContext);
  const { ui } = state;
  const theme = useTheme();
  const isExpanded = ui.expandedTaskIds.includes(task.id);
  const hasChildren = task.childIds.length > 0;
  
  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'TOGGLE_EXPAND_TASK', payload: { id: task.id } });
  };
  
  const handleTaskClick = () => {
    dispatch({ type: 'SET_SELECTED_TASK', payload: { id: task.id } });
  };
  
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const progress = Number(e.target.value);
    dispatch({ type: 'SET_TASK_PROGRESS', payload: { id: task.id, progress } });
    
    // If progress is 100%, complete the task
    if (progress === 100) {
      dispatch({ type: 'COMPLETE_TASK', payload: { id: task.id } });
    }
  };
  
  // Fix for the handleStatusChange function - must use curly braces for multi-line arrow functions
const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const status = e.target.checked ? 'done' : 'todo';
  
  // Use a single dispatch based on the action needed
  if (status === 'done') {
    // COMPLETE_TASK handles status, progress, dates, and XP in one action
    dispatch({ type: 'COMPLETE_TASK', payload: { id: task.id } });
  } else {
    // If marking incomplete, just update the status and progress
    dispatch({ 
      type: 'UPDATE_TASK', 
      payload: { 
        id: task.id, 
        status, 
        progress: 0, 
        completedAt: undefined 
      } 
    });
  }
};
  
  const getProgressColor = (progress: number) => {
    if (progress < 25) return theme.error;
    if (progress < 50) return theme.warning;
    if (progress < 75) return theme.info;
    return theme.success;
  };
  
  return (
    <motion.div {...animations.slideUp} layout>
      <TaskCardContainer 
        style={{ marginLeft: isChild ? 20 : 0 }}
        onClick={handleTaskClick}
      >
        <TaskCardContent>
          <TaskCardHeader>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox 
                checked={task.status === 'done'} 
                onChange={handleStatusChange}
                onClick={(e) => e.stopPropagation()}
                color="primary"
              />
              <TaskCardTitle style={{ textDecoration: task.status === 'done' ? 'line-through' : 'none' }}>
                {task.title}
              </TaskCardTitle>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PriorityBadge priority={task.priority} />
              {hasChildren && (
                <IconButton size="small" onClick={handleToggleExpand}>
                  {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              )}
            </Box>
          </TaskCardHeader>
          
          {task.description && (
            <TaskCardDescription>{task.description}</TaskCardDescription>
          )}
          
          <TaskProgressBar progress={task.progress} color={getProgressColor(task.progress)} />
          
          <Box sx={{ my: 1 }}>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={task.progress} 
              onChange={handleProgressChange}
              style={{ width: '100%' }}
              onClick={(e) => e.stopPropagation()}
            />
          </Box>
          
          <TaskCardFooter>
            <TaskCardMetadata>
              {task.dueDate && (
                <Chip 
                  size="small" 
                  icon={<AlarmIcon />} 
                  label={formatDate(task.dueDate)} 
                  variant="outlined"
                />
              )}
              
              {task.estimatedTime && (
                <Chip 
                  size="small" 
                  icon={<TimeIcon />} 
                  label={formatDuration(task.estimatedTime)} 
                  variant="outlined"
                />
              )}
              
              {task.category && (
                <Chip 
                  size="small" 
                  icon={<CategoryIcon category={task.category} />} 
                  label={task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                  variant="outlined"
                />
              )}
              
              {task.tags.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                  {task.tags.slice(0, 3).map(tag => (
                    <TaskTag key={tag} tag={tag} />
                  ))}
                  {task.tags.length > 3 && (
                    <Chip 
                      size="small" 
                      label={`+${task.tags.length - 3}`} 
                      variant="outlined" 
                    />
                  )}
                </Box>
              )}
            </TaskCardMetadata>
            
            <TaskCardActions>
              <Tooltip title="Edit">
                <IconButton 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch({ type: 'SET_SELECTED_TASK', payload: { id: task.id } });
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Delete">
                <IconButton 
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch({ type: 'DELETE_TASK', payload: { id: task.id } });
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </TaskCardActions>
          </TaskCardFooter>
        </TaskCardContent>
        
        {/* Subtasks Section */}
        {isExpanded && hasChildren && (
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Divider />
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Subtasks ({task.childIds.length})
                </Typography>
                {task.childIds.map(childId => 
                  state.tasks[childId] ? (
                    <TaskItem 
                      key={childId} 
                      task={state.tasks[childId]} 
                      isChild={true} 
                    />
                  ) : null
                )}
              </Box>
            </motion.div>
          </AnimatePresence>
        )}
      </TaskCardContainer>
    </motion.div>
  );
};

// TaskForm component
const TaskForm = ({ task, onClose }: { task?: Task; onClose: () => void }) => {
  const { state, dispatch } = useContext(AppContext);
  const isEditing = !!task;
  
  const [formState, setFormState] = useState<Partial<Task>>(
    task || {
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      category: 'other',
      tags: [],
      estimatedTime: undefined,
      dueDate: undefined,
      parentId: undefined,
      isRecurring: false,
      relatedIds: []
    }
  );
  
  const [tagInput, setTagInput] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
  const name = e.target.name as string;
  const value = e.target.value;
  setFormState(prev => ({ ...prev, [name]: value }));
};
  
  const handleDateChange = (date: Date | null) => {
    setFormState(prev => ({ ...prev, dueDate: date || undefined }));
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !formState.tags?.includes(tagInput.trim())) {
      setFormState(prev => ({ 
        ...prev, 
        tags: [...(prev.tags || []), tagInput.trim()] 
      }));
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setFormState(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formState.title?.trim()) {
      // Show error
      dispatch({
        type: 'SET_NOTIFICATION',
        payload: {
          show: true,
          message: 'Task title is required',
          type: 'error'
        }
      });
      return;
    }
    
    if (isEditing && task) {
      dispatch({
        type: 'UPDATE_TASK',
        payload: {
          id: task.id,
          ...formState
        }
      });
      
      dispatch({
        type: 'SET_NOTIFICATION',
        payload: {
          show: true,
          message: 'Task updated successfully',
          type: 'success'
        }
      });
    } else {
      dispatch({
        type: 'ADD_TASK',
        payload: {
          ...formState,
          relatedIds: formState.relatedIds || [],
          isRecurring: formState.isRecurring || false
        } as Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'childIds' | 'xpReward' | 'progress'>
      });
      
      dispatch({
        type: 'SET_NOTIFICATION',
        payload: {
          show: true,
          message: 'Task created successfully',
          type: 'success'
        }
      });
    }
    
    onClose();
  };
  
  return (
    <TaskFormContainer>
      <Typography variant="h6">
        {isEditing ? 'Edit Task' : 'Create New Task'}
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={formState.title || ''}
          onChange={handleChange}
          required
          margin="normal"
        />
        
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formState.description || ''}
          onChange={handleChange}
          multiline
          rows={3}
          margin="normal"
        />
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formState.status || 'todo'}
                onChange={handleSelectChange as any}
                label="Status"
              >
                <MenuItem value="todo">To Do</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="done">Done</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={formState.priority || 'medium'}
                onChange={handleSelectChange as any}
                label="Priority"
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formState.category || 'other'}
                onChange={handleSelectChange as any}
                label="Category"
              >
                <MenuItem value="work">Work</MenuItem>
                <MenuItem value="personal">Personal</MenuItem>
                <MenuItem value="shopping">Shopping</MenuItem>
                <MenuItem value="health">Health</MenuItem>
                <MenuItem value="finance">Finance</MenuItem>
                <MenuItem value="education">Education</MenuItem>
                <MenuItem value="social">Social</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Estimated Time (minutes)"
              name="estimatedTime"
              type="number"
              value={formState.estimatedTime || ''}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
        </Grid>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Parent Task</InputLabel>
          <Select
            name="parentId"
            value={formState.parentId || ''}
            onChange={handleSelectChange as any}
            label="Parent Task"
          >
            <MenuItem value="">No Parent</MenuItem>
            {Object.values(state.tasks)
              .filter(t => t.id !== (task?.id || ''))
              .map(t => (
                <MenuItem key={t.id} value={t.id}>
                  {t.title}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Tags
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
            {formState.tags?.map(tag => (
              <TaskTag 
                key={tag} 
                tag={tag} 
                onDelete={() => handleRemoveTag(tag)} 
              />
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              label="Add Tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              size="small"
              fullWidth
            />
            <Button 
              onClick={handleAddTag} 
              variant="outlined" 
              sx={{ minWidth: '80px' }}
            >
              Add
            </Button>
          </Box>
        </Box>
        
        <FormControl margin="normal" fullWidth>
          <FormControlLabel
            control={
              <Switch
                checked={formState.isRecurring || false}
                onChange={(e) => setFormState(prev => ({ ...prev, isRecurring: e.target.checked }))}
                name="isRecurring"
              />
            }
            label="Recurring Task"
          />
        </FormControl>
        
        {formState.isRecurring && (
          <TextField
            fullWidth
            label="Recurrence Pattern"
            name="recurringPattern"
            value={formState.recurringPattern || ''}
            onChange={handleChange}
            placeholder="e.g., Every Monday, Daily, Weekly"
            margin="normal"
          />
        )}
        
        <FormActions>
          <Button 
            onClick={onClose} 
            variant="outlined" 
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
          >
            {isEditing ? 'Update Task' : 'Create Task'}
          </Button>
        </FormActions>
      </form>
    </TaskFormContainer>
  );
};

// TaskDrawer component
const TaskDrawer = () => {
  const { state, dispatch } = useContext(AppContext);
  const { ui, tasks } = state;
  
  const selectedTask = ui.selectedTaskId ? tasks[ui.selectedTaskId] : undefined;
  
  const handleClose = () => {
    dispatch({ type: 'SET_SELECTED_TASK', payload: { id: null } });
  };
  
  return (
    <TaskDrawerContainer
      anchor="right"
      open={!!ui.selectedTaskId}
      onClose={handleClose}
    >
      <IconButton
        onClick={handleClose}
        sx={{ position: 'absolute', right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>
      
      {selectedTask && (
        <TaskForm task={selectedTask} onClose={handleClose} />
      )}
      
      {ui.selectedTaskId === 'new' && (
        <TaskForm onClose={handleClose} />
      )}
    </TaskDrawerContainer>
  );
};

// Header component
const Header = () => {
  const { state, dispatch } = useContext(AppContext);
  const theme = useTheme();
  
  const toggleSidebar = () => {
    dispatch({ 
      type: 'SET_UI_STATE', 
      payload: { sidebarOpen: !state.ui.sidebarOpen } 
    });
  };
  
  const toggleTheme = () => {
    dispatch({
      type: 'UPDATE_USER',
      payload: { 
        theme: state.user.theme === 'light' ? 'dark' : 'light' 
      }
    });
  };
  
  return (
    <AppBar position="fixed" color="primary">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={toggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          TaskMaster Pro
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Toggle Theme">
            <IconButton color="inherit" onClick={toggleTheme}>
              <ThemeIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Settings">
            <IconButton 
              color="inherit"
              onClick={() => dispatch({ 
                type: 'SET_UI_STATE', 
                payload: { settingsOpen: true } 
              })}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Notifications">
            <IconButton color="inherit">
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          <Tooltip title={state.user.name}>
            <Avatar 
              sx={{ ml: 2, bgcolor: theme.secondary }}
            >
              {state.user.name.charAt(0)}
            </Avatar>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

// Sidebar component
const Sidebar = () => {
  const { state, dispatch } = useContext(AppContext);
  const theme = useTheme();
  
  const handleViewChange = (view: AppState['ui']['currentView']) => {
    dispatch({ type: 'SET_UI_STATE', payload: { currentView: view } });
  };
  
  const menuItems = [
    { icon: <HomeIcon />, text: 'All Tasks', view: 'list' },
    { icon: <ViewKanbanIcon />, text: 'Kanban Board', view: 'kanban' },
    { icon: <CalendarTodayIcon />, text: 'Calendar', view: 'calendar' },
    { icon: <TimelineIcon />, text: 'Analytics', view: 'analytics' },
  ];
  
  const categoryItems = [
    { icon: <WorkIcon />, text: 'Work', category: 'work' as TaskCategory },
    { icon: <PersonIcon />, text: 'Personal', category: 'personal' as TaskCategory },
    { icon: <ShoppingCartIcon />, text: 'Shopping', category: 'shopping' as TaskCategory },
    { icon: <FitnessCenterIcon />, text: 'Health', category: 'health' as TaskCategory },
    { icon: <AccountBalanceIcon />, text: 'Finance', category: 'finance' as TaskCategory },
    { icon: <SchoolIcon />, text: 'Education', category: 'education' as TaskCategory },
    { icon: <PeopleIcon />, text: 'Social', category: 'social' as TaskCategory },
    { icon: <MoreHorizIcon />, text: 'Other', category: 'other' as TaskCategory },
  ];
  
  const setCategoryFilter = (category: TaskCategory) => {
    dispatch({
      type: 'SET_FILTERS',
      payload: { category: [category] }
    });
    dispatch({
      type: 'SET_UI_STATE',
      payload: { currentView: 'list' }
    });
  };
  
  return (
    <SidebarContainer isOpen={state.ui.sidebarOpen}>
      <List>
        <UserLevel />
        <Divider />
        
        {menuItems.map((item) => (
          // Fix for ListItem props
          <ListItem 
            key={item.text}
            sx={{ 
              bgcolor: state.ui.currentView === item.view ? 'action.selected' : 'transparent',
              "&:hover": { bgcolor: 'action.hover' }
            }}
            onClick={() => handleViewChange(item.view as any)}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      
      <Divider />
      
      <List subheader={
        <Typography variant="subtitle2" sx={{ px: 2, pt: 1, pb: 0.5 }}>
          Categories
        </Typography>
      }>
        {categoryItems.map((item) => (
          <ListItem 
            key={item.text}
            onClick={() => setCategoryFilter(item.category)}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
            <Typography variant="caption" color="textSecondary">
              {Object.values(state.tasks).filter(t => t.category === item.category).length}
            </Typography>
          </ListItem>
        ))}
      </List>
      
      <Divider />
      
      <List subheader={
        <Typography variant="subtitle2" sx={{ px: 2, pt: 1, pb: 0.5 }}>
          Achievements
        </Typography>
      }>
        {state.user.achievements
          .filter(a => a.unlockedAt)
          .slice(0, 3)
          .map(achievement => (
            <ListItem key={achievement.id}>
              <ListItemIcon>
                <Typography fontSize="1.5rem">{achievement.icon}</Typography>
              </ListItemIcon>
              <ListItemText 
                primary={achievement.title} 
                secondary={achievement.description}
              />
            </ListItem>
          ))}
        
        {state.user.achievements.filter(a => a.unlockedAt).length === 0 && (
          <ListItem>
            <ListItemText 
              secondary="Complete tasks to earn achievements!" 
              sx={{ textAlign: 'center' }}
            />
          </ListItem>
        )}
      </List>
    </SidebarContainer>
  );
};

// Settings component
const SettingsModal = () => {
  const { state, dispatch } = useContext(AppContext);
  const { user, ui } = state;
  
  const handleClose = () => {
    dispatch({ type: 'SET_UI_STATE', payload: { settingsOpen: false } });
  };
  
  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked, value, type } = e.target;
    
    dispatch({
      type: 'UPDATE_USER',
      payload: {
        settings: {
          ...user.settings,
          [name]: type === 'checkbox' ? checked : value
        }
      }
    });
  };
  
  const handleThemeChange = (e: SelectChangeEvent<"light" | "dark" | "system">) => {
    dispatch({
      type: 'UPDATE_USER',
      payload: { theme: e.target.value as 'light' | 'dark' | 'system' }
    });
  };
  
  return (
    <Drawer
      anchor="right"
      open={ui.settingsOpen}
      onClose={handleClose}
      sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: 400 }, p: 3 } }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Settings</Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <Typography variant="subtitle1" gutterBottom>App Settings</Typography>
      
      <FormControl fullWidth margin="normal">
        <InputLabel>Theme</InputLabel>
        <Select
          value={user.theme}
          onChange={handleThemeChange}
          label="Theme"
        >
          <MenuItem value="light">Light</MenuItem>
          <MenuItem value="dark">Dark</MenuItem>
          <MenuItem value="system">System</MenuItem>
        </Select>
      </FormControl>
      
      <FormControl fullWidth margin="normal">
        <InputLabel>Default View</InputLabel>
        <Select
          name="defaultView"
          value={user.settings.defaultView}
          onChange={(e) => {
            dispatch({
              type: 'UPDATE_USER',
              payload: {
                settings: {
                  ...user.settings,
                  defaultView: e.target.value as 'list' | 'kanban' | 'calendar'
                }
              }
            });
          }}
          label="Default View"
        >
          <MenuItem value="list">List</MenuItem>
          <MenuItem value="kanban">Kanban</MenuItem>
          <MenuItem value="calendar">Calendar</MenuItem>
        </Select>
      </FormControl>
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle1" gutterBottom>Notifications</Typography>
      
      <FormControlLabel
        control={
          <Switch
            checked={user.settings.enableNotifications}
            onChange={handleSettingChange}
            name="enableNotifications"
          />
        }
        label="Enable Notifications"
      />
      
      <FormControlLabel
        control={
          <Switch
            checked={user.settings.enableSounds}
            onChange={handleSettingChange}
            name="enableSounds"
          />
        }
        label="Enable Sounds"
      />
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle1" gutterBottom>Accessibility</Typography>
      
      <FormControlLabel
        control={
          <Switch
            checked={user.settings.enableAnimations}
            onChange={handleSettingChange}
            name="enableAnimations"
          />
        }
        label="Enable Animations"
      />
      
      <FormControlLabel
        control={
          <Switch
            checked={user.settings.enableVoiceCommands}
            onChange={handleSettingChange}
            name="enableVoiceCommands"
          />
        }
        label="Enable Voice Commands"
      />
      
      <FormControlLabel
        control={
          <Switch
            checked={user.settings.showCompletedTasks}
            onChange={handleSettingChange}
            name="showCompletedTasks"
          />
        }
        label="Show Completed Tasks"
      />
    </Drawer>
  );
};

// TaskList component
const TaskList = () => {
  const { dispatch } = useContext(AppContext);
  const filteredTasks = useFilteredTasks();
  
  // Group tasks by parent for proper hierarchy display
  const taskTree = useMemo(() => {
    const rootTasks = filteredTasks.filter(task => !task.parentId);
    return rootTasks;
  }, [filteredTasks]);

  const handleAddTask = () => {
    dispatch({ 
      type: 'SET_SELECTED_TASK', 
      payload: { id: 'new' } 
    });
  };
  
  if (filteredTasks.length === 0) {
    return (
      <EmptyStateContainer>
        <Typography variant="h5" gutterBottom>
          No tasks found
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Try changing your filters or create a new task
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddTask}
        >
          Create Task
        </Button>
      </EmptyStateContainer>
    );
  }
  
  return (
    <div>
      {taskTree.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};

// KanbanBoard component
const KanbanBoard = () => {
  const { state, dispatch } = useContext(AppContext);
  const filteredTasks = useFilteredTasks();
  const theme = useTheme();
  
  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      'todo': [],
      'in-progress': [],
      'done': [],
      'archived': []
    };
    
    filteredTasks.forEach(task => {
      grouped[task.status].push(task);
    });
    
    return grouped;
  }, [filteredTasks]);
  
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'todo': return theme.info;
      case 'in-progress': return theme.warning;
      case 'done': return theme.success;
      case 'archived': return theme.textSecondary;
      default: return theme.info;
    }
  };
  
  const getStatusTitle = (status: TaskStatus) => {
    switch (status) {
      case 'todo': return 'To Do';
      case 'in-progress': return 'In Progress';
      case 'done': return 'Completed';
      case 'archived': return 'Archived';
      default: return status;
    }
  };
  
  const handleAddTask = (status: TaskStatus) => {
    dispatch({ 
      type: 'SET_SELECTED_TASK', 
      payload: { id: 'new' } 
    });
  };
  
  return (
    <Box 
      sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: 2,
        overflow: 'auto',
        pb: 2
      }}
    >
      {Object.entries(tasksByStatus)
        .filter(([status]) => status !== 'archived') // Don't show archived by default
        .map(([status, tasks]) => (
          <Paper 
            key={status} 
            elevation={1}
            sx={{ 
              p: 2, 
              borderTop: `4px solid ${getStatusColor(status as TaskStatus)}`,
              height: 'fit-content',
              maxHeight: 'calc(100vh - 160px)',
              overflow: 'auto'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {getStatusTitle(status as TaskStatus)} ({tasks.length})
              </Typography>
              <IconButton 
                size="small" 
                onClick={() => handleAddTask(status as TaskStatus)}
              >
                <AddIcon />
              </IconButton>
            </Box>
            
            {tasks.map(task => (
              <Card 
                key={task.id} 
                sx={{ 
                  mb: 2, 
                  cursor: 'pointer',
                  transition: theme.transition,
                  '&:hover': {
                    boxShadow: theme.shadow
                  }
                }}
                onClick={() => dispatch({ type: 'SET_SELECTED_TASK', payload: { id: task.id } })}
              >
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        textDecoration: task.status === 'done' ? 'line-through' : 'none',
                        wordBreak: 'break-word'
                      }}
                    >
                      {task.title}
                    </Typography>
                    <PriorityBadge priority={task.priority} />
                  </Box>
                  
                  {task.description && (
                    <Typography 
                      variant="body2" 
                      color="textSecondary"
                      sx={{ 
                        mt: 1, 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {task.description}
                    </Typography>
                  )}
                  
                  <TaskProgressBar progress={task.progress} color={getStatusColor(task.status)} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    {task.dueDate && (
                      <Typography variant="caption" color="textSecondary">
                        <AlarmIcon fontSize="inherit" sx={{ verticalAlign: 'text-bottom', mr: 0.5 }} />
                        {formatDate(task.dueDate)}
                      </Typography>
                    )}
                    
                    {task.childIds.length > 0 && (
                      <Chip 
                        size="small" 
                        label={`${task.childIds.length} subtasks`} 
                        variant="outlined"
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
            
            {tasks.length === 0 && (
              <Box sx={{ textAlign: 'center', p: 2, color: 'text.secondary' }}>
                <Typography variant="body2">No tasks</Typography>
              </Box>
            )}
          </Paper>
        ))}
    </Box>
  );
};

// Analytics component
const Analytics = () => {
  const { state } = useContext(AppContext);
  const { user, tasks } = state;
  const theme = useTheme();
  
  // Productivity chart data
  const productivityData = useMemo(() => {
    const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return {
      labels,
      datasets: [
        {
          label: 'Tasks Completed',
          data: user.stats.productiveDays,
          backgroundColor: theme.primary,
          borderColor: theme.primary,
          borderWidth: 2,
          borderRadius: 5,
        }
      ]
    };
  }, [user.stats.productiveDays, theme]);
  
  // Category distribution data
  const categoryData = useMemo(() => {
    const labels = Object.keys(user.stats.categoriesDistribution);
    const data = Object.values(user.stats.categoriesDistribution);
    
    const backgroundColors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#2E7D32', '#607D8B'
    ];
    
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors,
          borderWidth: 0,
        }
      ]
    };
  }, [user.stats.categoriesDistribution]);
  
  // Tasks status distribution data
  const statusData = useMemo(() => {
    const statusCounts = {
      'todo': 0,
      'in-progress': 0,
      'done': 0,
      'archived': 0
    };
    
    Object.values(tasks).forEach(task => {
      statusCounts[task.status]++;
    });
    
    return {
      labels: ['To Do', 'In Progress', 'Done', 'Archived'],
      datasets: [
        {
          data: Object.values(statusCounts),
          backgroundColor: [theme.info, theme.warning, theme.success, theme.textSecondary],
          borderWidth: 0,
        }
      ]
    };
  }, [tasks, theme]);
  
  // Task completion over time (last 7 days)
  const completionData = useMemo(() => {
    const dates = [];
    const completedCounts = [];
    
    // Generate last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      
      // Count tasks completed on this day
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      
      const count = Object.values(tasks).filter(task => 
        task.completedAt && 
        new Date(task.completedAt) >= dayStart && 
        new Date(task.completedAt) <= dayEnd
      ).length;
      
      completedCounts.push(count);
    }
    
    return {
      labels: dates,
      datasets: [
        {
          label: 'Tasks Completed',
          data: completedCounts,
          borderColor: theme.primary,
          backgroundColor: `${theme.primary}33`, // Add transparency
          borderWidth: 2,
          tension: 0.3,
          fill: true,
        }
      ]
    };
  }, [tasks, theme]);
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: `${theme.textSecondary}22`,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };
  
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
    },
  };
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom>Analytics</Typography>
      
      <Grid container spacing={3}>
        {/* Summary cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Tasks
              </Typography>
              <Typography variant="h4">
                {Object.keys(tasks).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Completed Tasks
              </Typography>
              <Typography variant="h4">
                {user.stats.tasksCompleted}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Current Streak
              </Typography>
              <Typography variant="h4">
                {user.stats.currentStreak} days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Time Spent
              </Typography>
              <Typography variant="h4">
                {formatDuration(user.stats.totalTimeSpent)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Task Completion Trend
              </Typography>
              <Box sx={{ height: 300 }}>
                <Line data={completionData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Task Status
              </Typography>
              <Box sx={{ height: 300 }}>
                <Pie data={statusData} options={pieOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Category Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <Pie data={categoryData} options={pieOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Productive Days
              </Typography>
              <Box sx={{ height: 300 }}>
                <Bar data={productivityData} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// Voice Command Button
const VoiceCommandButton = () => {
  const { state, dispatch } = useContext(AppContext);
  const { user } = state;
  
  const handleVoiceResult = useCallback((text: string) => {
  // Process the voice command
  const taskDetails = parseTaskText(text);
  
  // Add the task with all required fields explicitly provided but WITHOUT childIds
  dispatch({
  type: 'ADD_TASK',
  payload: {
    title: taskDetails.title || 'New Task',
    description: taskDetails.description || '',
    status: taskDetails.status || 'todo',
    priority: taskDetails.priority || 'medium',
    category: taskDetails.category || 'other',
    tags: taskDetails.tags || [],
    dueDate: taskDetails.dueDate,
    estimatedTime: taskDetails.estimatedTime,
    actualTime: undefined,
    parentId: undefined,
    reminderTime: undefined,
    isRecurring: false,
    recurringPattern: undefined,
    assignee: undefined,
    attachments: [],
    notes: undefined,
    location: undefined,
    relatedIds: []
  }
});
  
  dispatch({
    type: 'SET_NOTIFICATION',
    payload: {
      show: true,
      message: `Task created: ${taskDetails.title || 'New Task'}`,
      type: 'success'
    }
  });
}, [dispatch]);
  
  const handleStart = useCallback(() => {
    dispatch({ 
      type: 'SET_UI_STATE', 
      payload: { isRecording: true } 
    });
  }, [dispatch]);
  
  const handleEnd = useCallback(() => {
    dispatch({ 
      type: 'SET_UI_STATE', 
      payload: { isRecording: false } 
    });
  }, [dispatch]);
  
  const { isListening, startListening, stopListening } = useVoiceCommands(
    user.settings.enableVoiceCommands,
    handleVoiceResult,
    handleStart,
    handleEnd
  );
  
  if (!user.settings.enableVoiceCommands) return null;
  
  return (
    <Tooltip title={isListening ? "Listening..." : "Add Task with Voice"}>
      <Fab 
        color={isListening ? "secondary" : "primary"}
        sx={{ 
          position: 'fixed',
          bottom: 24,
          right: 100,
          animation: isListening ? 'pulse 1.5s infinite' : 'none',
          '@keyframes pulse': {
            '0%': {
              boxShadow: '0 0 0 0 rgba(255, 0, 0, 0.7)'
            },
            '70%': {
              boxShadow: '0 0 0 10px rgba(255, 0, 0, 0)'
            },
            '100%': {
              boxShadow: '0 0 0 0 rgba(255, 0, 0, 0)'
            }
          }
        }}
        onClick={isListening ? stopListening : startListening}
      >
        <VoiceIcon />
      </Fab>
    </Tooltip>
  );
};

// Theme definitions
const lightTheme: ThemeType = {
  primary: '#2196f3',
  secondary: '#ff9800',
  background: '#f5f5f5',
  surface: '#ffffff',
  error: '#f44336',
  text: '#212121',
  textSecondary: '#757575',
  divider: '#e0e0e0',
  success: '#4caf50',
  warning: '#ff9800',
  info: '#2196f3',
  shadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  transition: 'all 500ms cubic-bezier(0.16, 1, 0.3, 1)'
};

const darkTheme: ThemeType = {
  primary: '#90caf9',
  secondary: '#ffb74d',
  background: '#121212',
  surface: '#1e1e1e',
  error: '#f44336',
  text: '#ffffff',
  textSecondary: '#b0b0b0',
  divider: '#424242',
  success: '#66bb6a',
  warning: '#ffa726',
  info: '#42a5f5',
  shadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
  transition: 'all 500ms cubic-bezier(0.16, 1, 0.3, 1)'
};

// Safe wrapper for useKeyboardShortcuts
const useSafeKeyboardShortcuts = () => {
  const { state, dispatch } = useContext(AppContext);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if in an input element or if state is not ready
      if (!state || !state.ui || 
          e.target instanceof HTMLInputElement || 
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement) {
        return;
      }
      
      // Command/Ctrl + Z for undo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        dispatch({ type: 'UNDO' });
      }
      
      // Command/Ctrl + Shift + Z for redo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        dispatch({ type: 'REDO' });
      }
      
      // Command/Ctrl + N for new task
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        dispatch({
          type: 'ADD_TASK',
          payload: {
            title: 'New Task',
            description: '',
            status: 'todo',
            priority: 'medium',
            category: 'other',
            tags: [],
            isRecurring: false,
            relatedIds: []
          }
        });
      }
      
      // Escape key to close modals or deselect task
      if (e.key === 'Escape' && state.ui.selectedTaskId) {
        dispatch({ type: 'SET_SELECTED_TASK', payload: { id: null } });
      }
      
      // / key to focus search
      if (e.key === '/' && !state.ui.selectedTaskId) {
        e.preventDefault();
        const searchInput = document.getElementById('task-search');
        if (searchInput) {
          searchInput.focus();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state, dispatch]);
};

// Main App component with initialization phases
const App = () => {
  // Create an initial state first to prevent undefined errors
  const initialState = getInitialState();
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Create context immediately with initial state
  const contextValue = useMemo(() => ({ state, dispatch }), [state]);
  
  // Fetch from localStorage
  // Helper function to revive dates in JSON
const reviveDates = (obj: any): any => {
  if (obj === null || obj === undefined || typeof obj !== 'object') {
    return obj;
  }
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      
      // Check date strings
      if (typeof value === 'string' && 
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          obj[key] = date;
        }
      } else if (typeof value === 'object') {
        obj[key] = reviveDates(value);
      }
    }
  }
  
  return obj;
};

// In App component
useEffect(() => {
  const loadState = async () => {
    try {
      const storedState = localStorage.getItem('taskmaster-state');
      if (storedState) {
        const parsedState = JSON.parse(storedState);
        
        // Process dates and restore state
        if (parsedState.tasks) {
          dispatch({ type: 'SET_TASKS', payload: reviveDates(parsedState.tasks) });
        }
        if (parsedState.user) {
          dispatch({ type: 'SET_USER', payload: reviveDates(parsedState.user) });
        }
        if (parsedState.ui) {
          dispatch({ type: 'SET_UI', payload: parsedState.ui });
        }
        if (parsedState.isLoading !== undefined) {
          dispatch({ type: 'SET_IS_LOADING', payload: parsedState.isLoading });
        }
        if (parsedState.error !== undefined) {
          dispatch({ type: 'SET_ERROR', payload: parsedState.error });
        }
      }
    } catch (error) {
      console.error('Error loading state:', error);
      dispatch({
        type: 'SET_NOTIFICATION',
        payload: {
          show: true,
          message: 'Error loading saved data. Using default settings.',
          type: 'error'
        }
      });
    } finally {
      setIsInitializing(false);
    }
  };
  
  loadState();
}, []);
  
  // Save to localStorage whenever state changes
useEffect(() => {
  if (!isInitializing) {
    const stateToSave = {
      tasks: state.tasks,
      user: state.user,
      ui: {
        ...state.ui,
        selectedTaskId: null,  // Don't save modal/ephemeral states
        settingsOpen: false,
        isRecording: false
      },
      isLoading: false,
      error: null,
      notification: {
        show: false,
        message: '',
        type: 'info'
      }
      // Don't save history
    };
    
    try {
      localStorage.setItem('taskmaster-state', JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      // Show notification about storage issues if needed
    }
  }
}, [state, isInitializing]);
  
  // Use our safe keyboard hooks wrapper
  useSafeKeyboardShortcuts();
  
  // Check for achievements - safely
  useEffect(() => {
    if (isInitializing) return;
    
    const { tasks, user } = state;
    if (!tasks || !user || !user.achievements) return;
    
    const tasksList = Object.values(tasks) as Task[];
    
    // First task achievement
    if (tasksList.length > 0 && !user.achievements.find((a: Achievement) => a.id === 'first-task')?.unlockedAt) {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: { id: 'first-task' } });
    }
    
    // Complete 10 tasks achievement
    if (user.stats.tasksCompleted >= 10 && !user.achievements.find((a: Achievement) => a.id === 'task-master')?.unlockedAt) {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: { id: 'task-master' } });
    }
    
    // Organization guru achievement
    const uniqueCategories = new Set(tasksList.map((task: Task) => task.category));
    if (uniqueCategories.size >= 5 && !user.achievements.find((a: Achievement) => a.id === 'organization-guru')?.unlockedAt) {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: { id: 'organization-guru' } });
    }
    
    // Task with 3 subtasks achievement
    const hasTaskWithThreeSubtasks = tasksList.some((task: Task) => task.childIds.length >= 3);
    if (hasTaskWithThreeSubtasks && !user.achievements.find((a: Achievement) => a.id === 'planning-pro')?.unlockedAt) {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: { id: 'planning-pro' } });
    }
  }, [state.tasks, state.user, isInitializing]);
  
  // Use a random challenge as an example
  useEffect(() => {
    if (isInitializing || !state.user?.activeChallenges) return;
    
    // Add a daily challenge if there are none active
    if (state.user.activeChallenges.length === 0) {
      const challenges = [
        {
          id: generateId(),
          title: 'Complete 3 Tasks Today',
          description: 'Finish three tasks before the day ends',
          startDate: new Date(),
          endDate: new Date(new Date().setHours(23, 59, 59, 999)),
          xpReward: 100,
          progress: 0,
          taskIds: []
        },
        {
          id: generateId(),
          title: 'Priority Focus',
          description: 'Complete 2 high priority tasks',
          startDate: new Date(),
          endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
          xpReward: 150,
          progress: 0,
          taskIds: []
        },
        {
          id: generateId(),
          title: 'Early Bird',
          description: 'Complete a task before 10am',
          startDate: new Date(),
          endDate: new Date(new Date().setHours(10, 0, 0, 0)),
          xpReward: 75,
          progress: 0,
          taskIds: []
        }
      ];
      
      const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
      dispatch({ type: 'START_CHALLENGE', payload: randomChallenge });
    }
  }, [state.user?.activeChallenges, isInitializing]);
  
  // Content based on current view
  const renderContent = () => {
    if (!state.ui) return null;
    
    switch (state.ui.currentView) {
      case 'kanban':
        return <KanbanBoard />;
      case 'calendar':
        return (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5">Calendar View</Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
              Calendar integration coming soon
            </Typography>
          </Box>
        );
      case 'analytics':
        return <Analytics />;
      case 'list':
      default:
        return <TaskList />;
    }
  };
  
  // Get theme based on user preferences with safe fallbacks
  const theme = state.user?.theme === 'dark' ? darkTheme : 
               state.user?.theme === 'light' ? lightTheme :
               window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? darkTheme : lightTheme;
  
  // Show loading during initialization
  if (isInitializing) {
    return (
      <AppContext.Provider value={contextValue}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          backgroundColor: lightTheme.background,
          color: lightTheme.text
        }}>
          <div>Loading TaskMaster Pro...</div>
        </div>
      </AppContext.Provider>
    );
  }
  
  return (
    <AppContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <GlobalStyle theme={theme} />
        <ErrorBoundary>
          <AppContainer>
            <Header />
            <MainContainer>
              <Sidebar />
              <ContentContainer sidebarOpen={state.ui.sidebarOpen}>
                <Box sx={{ mt: { xs: '56px', sm: '64px' }, pt: 2 }}>
                  <SearchBar
                    id="task-search"
                    placeholder="Search tasks..."
                    value={state.ui.searchQuery}
                    onChange={(e) => dispatch({ 
                      type: 'SET_UI_STATE', 
                      payload: { searchQuery: e.target.value } 
                    })}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
                    }}
                  />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5">
                      {state.ui.currentView === 'list' && 'My Tasks'}
                      {state.ui.currentView === 'kanban' && 'Kanban Board'}
                      {state.ui.currentView === 'calendar' && 'Calendar'}
                      {state.ui.currentView === 'analytics' && 'Analytics'}
                    </Typography>
                    
                    {(state.ui.currentView === 'list' || state.ui.currentView === 'kanban') && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          variant="outlined" 
                          startIcon={<FilterIcon />}
                          size="small"
                        >
                          Filter
                        </Button>
                        <Button 
                          variant="outlined" 
                          startIcon={<SortIcon />}
                          size="small"
                        >
                          Sort
                        </Button>
                      </Box>
                    )}
                  </Box>
                  
                  {renderContent()}
                </Box>
              </ContentContainer>
            </MainContainer>
            
            <TaskDrawer />
            <SettingsModal />
            <NotificationSystem />
            
            <AddTaskFab 
              color="primary" 
              onClick={() => dispatch({ 
                type: 'SET_SELECTED_TASK', 
                payload: { id: 'new' } 
              })}
            >
              <AddIcon />
            </AddTaskFab>
            
            <VoiceCommandButton />
            
            <ConfettiEffect active={state.notification.type === 'success' && state.notification.message.includes('completed')} />
          </AppContainer>
        </ErrorBoundary>
      </ThemeProvider>
    </AppContext.Provider>
  );
};

export default App;