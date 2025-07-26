import fs from 'fs';
import path from 'path';

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'new' | 'read' | 'replied';
}

const CONTACTS_FILE = path.join(process.cwd(), 'data', 'contacts.json');

// 데이터 디렉토리가 없으면 생성
function ensureDataDir() {
  const dataDir = path.dirname(CONTACTS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// 문의 목록 읽기
export function getContacts(): Contact[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(CONTACTS_FILE)) {
      return [];
    }
    const data = fs.readFileSync(CONTACTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading contacts:', error);
    return [];
  }
}

// 문의 저장
export function saveContact(contact: Omit<Contact, 'id' | 'createdAt' | 'status'>): Contact {
  try {
    ensureDataDir();
    const contacts = getContacts();
    
    const newContact: Contact = {
      id: Date.now().toString(),
      ...contact,
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    
    contacts.unshift(newContact); // 최신 문의가 맨 위에 오도록
    
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
    return newContact;
  } catch (error) {
    console.error('Error saving contact:', error);
    throw new Error('문의 저장에 실패했습니다.');
  }
}

// 문의 상태 업데이트
export function updateContactStatus(id: string, status: Contact['status']): boolean {
  try {
    const contacts = getContacts();
    const contactIndex = contacts.findIndex(contact => contact.id === id);
    
    if (contactIndex === -1) {
      return false;
    }
    
    contacts[contactIndex].status = status;
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
    return true;
  } catch (error) {
    console.error('Error updating contact status:', error);
    return false;
  }
}

// 문의 삭제
export function deleteContact(id: string): boolean {
  try {
    const contacts = getContacts();
    const filteredContacts = contacts.filter(contact => contact.id !== id);
    
    if (filteredContacts.length === contacts.length) {
      return false; // 삭제할 문의를 찾지 못함
    }
    
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(filteredContacts, null, 2));
    return true;
  } catch (error) {
    console.error('Error deleting contact:', error);
    return false;
  }
}

// 문의 통계
export function getContactStats() {
  const contacts = getContacts();
  return {
    total: contacts.length,
    new: contacts.filter(c => c.status === 'new').length,
    read: contacts.filter(c => c.status === 'read').length,
    replied: contacts.filter(c => c.status === 'replied').length,
  };
}