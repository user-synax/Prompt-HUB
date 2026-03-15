import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Prompt from '@/models/Prompt';
import { updatePromptSchema } from '@/utils/validation';
import { handleError, AppError } from '@/utils/errorHandler';
import { encrypt, decrypt } from '@/lib/crypto';
import { getUserId } from '@/middleware/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const userId = await getUserId(req);

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const prompt = await Prompt.findOne({ _id: params.id, userId });

    if (!prompt) {
      throw new AppError('Prompt not found', 404);
    }

    const promptObj = prompt.toObject();
    try {
      promptObj.content = decrypt(promptObj.content);
    } catch {
      console.error('Decryption failed for prompt:', promptObj._id);
      promptObj.content = '[Encrypted Content Error]';
    }

    return NextResponse.json({ success: true, data: promptObj }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const userId = await getUserId(req);

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const body = await req.json();
    const validatedData = updatePromptSchema.parse(body);

    // If content is provided, encrypt it
    if (validatedData.content) {
      validatedData.content = encrypt(validatedData.content);
    }

    const prompt = await Prompt.findOneAndUpdate(
      { _id: params.id, userId },
      { $set: validatedData },
      { new: true, runValidators: true }
    );

    if (!prompt) {
      throw new AppError('Prompt not found or unauthorized', 404);
    }

    const promptObj = prompt.toObject();
    try {
      promptObj.content = decrypt(promptObj.content);
    } catch {
      console.error('Decryption failed for prompt:', promptObj._id);
      promptObj.content = '[Encrypted Content Error]';
    }

    return NextResponse.json({ success: true, data: promptObj }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const userId = await getUserId(req);

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const prompt = await Prompt.findOneAndDelete({ _id: params.id, userId });

    if (!prompt) {
      throw new AppError('Prompt not found or unauthorized', 404);
    }

    return NextResponse.json(
      { success: true, message: 'Prompt deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
