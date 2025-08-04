'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'new' | 'read' | 'replied';
}

interface ContactStats {
  total: number;
  new: number;
  read: number;
  replied: number;
}

interface ContactsResponse {
  contacts: Contact[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  stats: ContactStats;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [stats, setStats] = useState<ContactStats>({ total: 0, new: 0, read: 0, replied: 0 });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0, hasNext: false, hasPrev: false });
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [token, setToken] = useState('');

  // 인증 확인
  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
      fetchContacts(1, statusFilter, savedToken);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    try {
      const response = await fetch('/api/xk9m2p8admin7q3w/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setIsAuthenticated(true);
        localStorage.setItem('adminToken', data.token);
        fetchContacts(1, statusFilter, data.token);
      } else {
        setAuthError(data.error);
      }
    } catch {
      setAuthError('네트워크 오류가 발생했습니다.');
    }
  };

  const fetchContacts = async (page: number = 1, status: string = 'all', authToken: string = token) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/xk9m2p8admin7q3w/contacts?page=${page}&limit=10&status=${status}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data: ContactsResponse = await response.json();
        setContacts(data.contacts);
        setStats(data.stats);
        setPagination(data.pagination);
      } else {
        console.error('Failed to fetch contacts');
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = async (contactId: string, newStatus: Contact['status']) => {
    try {
      const response = await fetch('/api/xk9m2p8admin7q3w/contacts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ contactId, status: newStatus }),
      });

      if (response.ok) {
        fetchContacts(pagination.page, statusFilter);
        setSelectedContact(null);
      }
    } catch (error) {
      console.error('Error updating contact status:', error);
    }
  };

  const deleteContact = async (contactId: string) => {
    if (!confirm('이 문의를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/xk9m2p8admin7q3w/contacts?id=${contactId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchContacts(pagination.page, statusFilter);
        setSelectedContact(null);
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setToken('');
    setContacts([]);
    setPassword('');
  };

  const getStatusBadge = (status: Contact['status']) => {
    const badges = {
      new: 'bg-red-100 text-red-800',
      read: 'bg-yellow-100 text-yellow-800',
      replied: 'bg-green-100 text-green-800',
    };
    const labels = {
      new: '새 문의',
      read: '읽음',
      replied: '답변완료',
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR');
  };

  // 로그인 화면
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <Link href="/" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-8">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>홈으로 돌아가기</span>
            </Link>
          </div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            관리자 로그인
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  비밀번호
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="관리자 비밀번호를 입력하세요"
                  />
                </div>
              </div>

              {authError && (
                <div className="text-red-600 text-sm">
                  {authError}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  로그인
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 관리자 대시보드
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="text-3xl">📧</div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">전체 문의</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="text-3xl">🆕</div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">새 문의</p>
                <p className="text-2xl font-bold text-red-600">{stats.new}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="text-3xl">👀</div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">읽은 문의</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.read}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="text-3xl">✅</div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">답변 완료</p>
                <p className="text-2xl font-bold text-green-600">{stats.replied}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 필터 및 새로고침 */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">상태 필터:</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  fetchContacts(1, e.target.value);
                }}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="all">전체</option>
                <option value="new">새 문의</option>
                <option value="read">읽음</option>
                <option value="replied">답변완료</option>
              </select>
            </div>
            <button
              onClick={() => fetchContacts(pagination.page, statusFilter)}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? '로딩...' : '새로고침'}
            </button>
          </div>
        </div>

        {/* 문의 목록 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    문의자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작성일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                        <div className="text-sm text-gray-500">{contact.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div 
                        className="text-sm text-gray-900 truncate max-w-xs cursor-pointer hover:text-blue-600"
                        onClick={() => setSelectedContact(contact)}
                      >
                        {contact.subject}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(contact.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(contact.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedContact(contact)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          보기
                        </button>
                        <button
                          onClick={() => deleteContact(contact.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          {pagination.totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:justify-end space-x-2">
                <button
                  onClick={() => fetchContacts(pagination.page - 1, statusFilter)}
                  disabled={!pagination.hasPrev}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  이전
                </button>
                <span className="relative inline-flex items-center px-4 py-2 text-sm text-gray-700">
                  {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => fetchContacts(pagination.page + 1, statusFilter)}
                  disabled={!pagination.hasNext}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  다음
                </button>
              </div>
            </div>
          )}
        </div>

        {contacts.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500">
              {statusFilter === 'all' ? '문의가 없습니다.' : `${statusFilter} 상태의 문의가 없습니다.`}
            </p>
          </div>
        )}
      </div>

      {/* 문의 상세 모달 */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">문의 상세</h2>
              <button
                onClick={() => setSelectedContact(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">문의자</label>
                <p className="text-gray-900">{selectedContact.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                <p className="text-gray-900">{selectedContact.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                <p className="text-gray-900">{selectedContact.subject}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">메시지</label>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                {getStatusBadge(selectedContact.status)}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">작성일</label>
                <p className="text-gray-500">{formatDate(selectedContact.createdAt)}</p>
              </div>
            </div>

            <div className="flex justify-between items-center p-6 border-t border-gray-200">
              <div className="flex space-x-2">
                <button
                  onClick={() => updateContactStatus(selectedContact.id, 'read')}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  읽음으로 표시
                </button>
                <button
                  onClick={() => updateContactStatus(selectedContact.id, 'replied')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  답변완료로 표시
                </button>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}