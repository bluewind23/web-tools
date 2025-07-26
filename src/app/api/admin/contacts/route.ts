import { NextRequest, NextResponse } from 'next/server';
import { getContacts, updateContactStatus, deleteContact, getContactStats } from '@/lib/contacts';

// 간단한 인증 (실제 프로덕션에서는 더 강력한 인증 시스템 사용)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

function isAuthenticated(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.substring(7);
  return token === Buffer.from(ADMIN_PASSWORD).toString('base64');
}

// 문의 목록 조회
export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    let contacts = getContacts();
    
    // 상태 필터링
    if (status && status !== 'all') {
      contacts = contacts.filter(contact => contact.status === status);
    }

    // 페이지네이션
    const total = contacts.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedContacts = contacts.slice(startIndex, endIndex);

    // 통계
    const stats = getContactStats();

    return NextResponse.json({
      contacts: paginatedContacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: endIndex < total,
        hasPrev: page > 1
      },
      stats
    });

  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 문의 상태 업데이트
export async function PATCH(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { contactId, status } = await request.json();

    if (!contactId || !status) {
      return NextResponse.json(
        { error: 'Contact ID and status are required' },
        { status: 400 }
      );
    }

    if (!['new', 'read', 'replied'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const success = updateContactStatus(contactId, status);

    if (!success) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Status updated successfully' });

  } catch (error) {
    console.error('Error updating contact status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 문의 삭제
export async function DELETE(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get('id');

    if (!contactId) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      );
    }

    const success = deleteContact(contactId);

    if (!success) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Contact deleted successfully' });

  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}