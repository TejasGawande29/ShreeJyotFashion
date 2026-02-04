// API Route to keep backend alive
// Vercel Cron Job will call this every 5 minutes

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
    const response = await fetch(`${backendUrl}/health`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Vercel-Cron-KeepAlive'
      }
    });

    if (response.ok) {
      return Response.json({ 
        success: true, 
        message: 'Backend is alive',
        timestamp: new Date().toISOString()
      });
    }

    return Response.json({ 
      success: false, 
      message: 'Backend check failed' 
    }, { status: 500 });
    
  } catch (error) {
    console.error('Keep-alive check failed:', error);
    return Response.json({ 
      success: false, 
      error: 'Failed to ping backend' 
    }, { status: 500 });
  }
}
