import { NextRequest, NextResponse } from 'next/server';

// API Health check endpoint
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: {
      claims: '/api/claims',
      tasks: '/api/tasks',
      documents: '/api/documents',
      approvals: '/api/approvals',
      users: '/api/users',
      notifications: '/api/notifications',
      audit: '/api/audit',
      templates: '/api/templates',
      masterData: '/api/master-data',
      lessonsLearned: '/api/lessons-learned',
      reports: {
        dashboard: '/api/reports/dashboard',
        financial: '/api/reports/financial',
        aging: '/api/reports/aging',
      },
    },
  });
}
