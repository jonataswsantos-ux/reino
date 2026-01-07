
import { Branch, User, MeetingRecord, UserStatus } from '../types';
import { INITIAL_BRANCHES } from '../constants';

const KEYS = {
  BRANCHES: 'gr_branches',
  USERS: 'gr_users',
  RECORDS: 'gr_records',
  AUTH: 'gr_auth'
};

export const storage = {
  getBranches: (): Branch[] => {
    const data = localStorage.getItem(KEYS.BRANCHES);
    return data ? JSON.parse(data) : INITIAL_BRANCHES;
  },
  saveBranches: (branches: Branch[]) => {
    localStorage.setItem(KEYS.BRANCHES, JSON.stringify(branches));
  },
  getUsers: (): User[] => {
    const data = localStorage.getItem(KEYS.USERS);
    // No initial users now, they will be registered
    return data ? JSON.parse(data) : [];
  },
  saveUsers: (users: User[]) => {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },
  getRecords: (): MeetingRecord[] => {
    const data = localStorage.getItem(KEYS.RECORDS);
    return data ? JSON.parse(data) : [];
  },
  saveRecords: (records: MeetingRecord[]) => {
    localStorage.setItem(KEYS.RECORDS, JSON.stringify(records));
  },
  addRecord: (record: MeetingRecord) => {
    const records = storage.getRecords();
    records.push(record);
    storage.saveRecords(records);
  }
};
