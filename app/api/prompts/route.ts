import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Prompt from '@/models/Prompt';
import { promptSchema } from '@/utils/validation';
import { handleError, AppError } from '@/utils/errorHandler';
import { encrypt, decrypt } from '@/lib/crypto';
import { getUserId } from '@/middleware/auth';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const userId = await getUserId(req);

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const body = await req.json();
    const validatedData = promptSchema.parse(body);

    // Encrypt content
    const encryptedContent = encrypt(validatedData.content);

    // Create prompt
    const newPrompt = new Prompt({
      ...validatedData,
      content: encryptedContent,
      userId,
    });

    await newPrompt.save();

    return NextResponse.json(
      { success: true, data: newPrompt },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const userId = await getUserId(req);

    if (!userId) {
      throw new AppError('Unauthorized', 401);
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const favorite = searchParams.get('favorite') === 'true';

    const skip = (page - 1) * limit;

    // Build query
    const query: Record<string, unknown> = { userId };

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    if (favorite) {
      query.isFavorite = true;
    }

    const prompts = await Prompt.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Prompt.countDocuments(query);

    // Decrypt content for each prompt
    const decryptedPrompts = prompts.map((prompt) => {
      const promptObj = prompt.toObject();
      try {
        promptObj.content = decrypt(promptObj.content);
      } catch (e) {
        console.error('Decryption failed for prompt:', promptObj._id);
        promptObj.content = '[Encrypted Content Error]';
      }
      return promptObj;
    });

    return NextResponse.json(
      {
        success: true,
        data: decryptedPrompts,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
