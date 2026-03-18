import { NextResponse } from 'next/server'

export function successResponse(data: any, message?: string, status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status }
  )
}

export function errorResponse(message: string, status: number, errors?: any) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      errors,
    },
    { status }
  )
}

export function paginatedResponse(data: any[], total: number, page: number, perPage: number) {
  const totalPages = Math.ceil(total / perPage)
  const hasNext = page < totalPages
  const hasPrev = page > 1

  return NextResponse.json({
    success: true,
    data,
    pagination: {
      total,
      page,
      perPage,
      totalPages,
      hasNext,
      hasPrev,
    },
  })
}
