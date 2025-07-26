import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: '비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: '잘못된 비밀번호입니다.' },
        { status: 401 }
      );
    }

    // 간단한 토큰 생성 (Base64 인코딩)
    const token = Buffer.from(ADMIN_PASSWORD).toString('base64');

    return NextResponse.json({
      message: '로그인 성공',
      token,
    });

  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}