import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/jwt';
import { registerSchema } from '@/utils/validation';
import { handleError } from '@/utils/errorHandler';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    // Validate input
    const validatedData = registerSchema.parse(body);

    // Check if user exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(validatedData.password, salt);

    // Create user
    const newUser = new User({
      name: validatedData.name,
      email: validatedData.email,
      passwordHash,
    });

    await newUser.save();

    // Generate JWT for immediate login after registration
    const token = generateToken(newUser._id.toString());

    // Set cookie
    const response = NextResponse.json(
      { success: true, message: 'User registered successfully' },
      { status: 201 }
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
