import { NextRequest, NextResponse } from 'next/server';
import { saveContact } from '@/lib/contacts';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // 입력 값 검증
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: '모든 필드를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '올바른 이메일 주소를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 길이 검증
    if (name.length > 50) {
      return NextResponse.json(
        { error: '이름은 50자 이하로 입력해주세요.' },
        { status: 400 }
      );
    }

    if (email.length > 100) {
      return NextResponse.json(
        { error: '이메일은 100자 이하로 입력해주세요.' },
        { status: 400 }
      );
    }

    if (subject.length > 100) {
      return NextResponse.json(
        { error: '제목은 100자 이하로 입력해주세요.' },
        { status: 400 }
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { error: '메시지는 1000자 이하로 입력해주세요.' },
        { status: 400 }
      );
    }

    // 문의 저장
    const contact = saveContact({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    return NextResponse.json(
      { 
        message: '문의가 성공적으로 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.',
        contactId: contact.id
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { error: '문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}