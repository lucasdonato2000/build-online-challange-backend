export interface Note {
  id: string;
  userId: string;
  contactId: string;
  content: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
