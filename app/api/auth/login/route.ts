import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/jwt';
import { loginSchema } from '@/utils/validation';
import { handleError } from '@/utils/errorHandler';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    // Validate input
    const validatedData = loginSchema.parse(body);

    // Find user
    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isMatch = await bcrypt.compare(validatedData.password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = generateToken(user._id.toString());

    // Set cookie
    const response = NextResponse.json(
      { success: true, message: 'Login successful' },
      { status: 200 }
    );

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    return handleError(error);
  }
}
