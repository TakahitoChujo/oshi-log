import { create } from 'zustand';
import { Oshi, OshiLog } from '../types';
import {
  getAllOshis,
  insertOshi,
  updateOshi,
  deleteOshi,
  getAllLogs,
  insertLog,
  deleteLog,
  getLogsByOshiId,
} from '../db/database';
import { Genre, LogType } from '../types';

interface OshiStore {
  oshis: Oshi[];
  logs: OshiLog[];

  // Oshi actions
  loadOshis: () => void;
  addOshi: (name: string, group_name: string, genre: Genre, icon_path: string, color: string) => void;
  editOshi: (id: number, name: string, group_name: string, genre: Genre, icon_path: string, color: string) => void;
  removeOshi: (id: number) => void;

  // Log actions
  loadLogs: () => void;
  addLog: (oshi_id: number, type: LogType, date: string, amount: number, memo: string, photo_path: string) => void;
  removeLog: (id: number) => void;
  getLogsByOshi: (oshi_id: number) => OshiLog[];
}

export const useOshiStore = create<OshiStore>((set, get) => ({
  oshis: [],
  logs: [],

  loadOshis: () => {
    const oshis = getAllOshis();
    set({ oshis });
  },

  addOshi: (name, group_name, genre, icon_path, color) => {
    insertOshi(name, group_name, genre, icon_path, color);
    get().loadOshis();
  },

  editOshi: (id, name, group_name, genre, icon_path, color) => {
    updateOshi(id, name, group_name, genre, icon_path, color);
    get().loadOshis();
  },

  removeOshi: (id) => {
    deleteOshi(id);
    get().loadOshis();
    get().loadLogs();
  },

  loadLogs: () => {
    const logs = getAllLogs();
    set({ logs });
  },

  addLog: (oshi_id, type, date, amount, memo, photo_path) => {
    insertLog(oshi_id, type, date, amount, memo, photo_path);
    get().loadLogs();
  },

  removeLog: (id) => {
    deleteLog(id);
    get().loadLogs();
  },

  getLogsByOshi: (oshi_id) => {
    return getLogsByOshiId(oshi_id);
  },
}));
