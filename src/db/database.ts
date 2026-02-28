import Dexie, { type Table } from 'dexie';
import type { UserProfile, LessonProgress, Note } from '../types/index.ts';

export class DHTutorialDatabase extends Dexie {
  userProfiles!: Table<UserProfile, string>;
  lessonProgress!: Table<LessonProgress, string>;
  notes!: Table<Note, string>;

  constructor() {
    super('dh-tutorial-lab');
    this.version(1).stores({
      userProfiles: 'id, createdAt',
      lessonProgress: 'lessonId, status',
      notes: 'id, type, *tags, lessonId, moduleId, updatedAt',
    });
  }
}

export const db = new DHTutorialDatabase();
