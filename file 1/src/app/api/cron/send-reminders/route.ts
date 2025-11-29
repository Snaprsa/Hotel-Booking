import { NextRequest, NextResponse } from 'next/server'
import { sendCheckInReminders } from '@/lib/notifications'

/**
 * GET /api/cron/send-reminders
 * Send check-in reminder emails and WhatsApp messages
 *
 * This endpoint should be called by a cron job daily
 * For free cron services, use:
 * - Vercel Cron (if deployed on Vercel)
 * - cron-job.org (free, reliable)
 * - EasyCron (free tier available)
 *
 * Recommended: Run daily at 9:00 AM
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authorization (optional but recommended)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Send check-in reminders
    const result = await sendCheckInReminders()

    return NextResponse.json({
      success: true,
      remindersSent: result.sent,
      message: `Successfully sent ${result.sent} check-in reminders`,
    })
  } catch (error) {
    console.error('Error sending reminders:', error)
    return NextResponse.json(
      { error: 'Failed to send reminders' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/cron/send-reminders
 * Same as GET but for cron services that only support POST
 */
export async function POST(request: NextRequest) {
  return GET(request)
}
