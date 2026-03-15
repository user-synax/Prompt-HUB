import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const handleError = (error: any) => {
  console.error('Error handled by global handler:', error);
  
  if (error instanceof AppError) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    const errorMessages = error.issues.map(issue => issue.message).join(', ');
    return NextResponse.json(
      { success: false, message: errorMessages || 'Validation failed' },
      { status: 400 }
    );
  }

  if (error.name === 'ValidationError') {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }

  if (error.code === 11000) {
    return NextResponse.json(
      { success: false, message: 'Duplicate field value entered' },
      { status: 400 }
    );
  }

  // Include error message in development for easier debugging
  const isDev = process.env.NODE_ENV === 'development';
  return NextResponse.json(
    { 
      success: false, 
      message: isDev ? error.message || 'Internal server error' : 'Internal server error' 
    },
    { status: 500 }
  );
};
