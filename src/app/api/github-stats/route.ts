import { NextResponse } from 'next/server';

let cachedData: { public_repos: number; updated_at: string } | null = null;
let lastFetch: number = 0;
const CACHE_DURATION = 60 * 60 * 1000;

export async function GET() {
  try {
    const now = Date.now();
    
    if (cachedData && (now - lastFetch) < CACHE_DURATION) {
      return NextResponse.json({
        public_repos: cachedData.public_repos,
        cached: true,
        lastUpdated: cachedData.updated_at
      });
    }

    const response = await fetch('https://api.github.com/users/Krex381', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      if (cachedData) {
        return NextResponse.json({
          public_repos: cachedData.public_repos,
          cached: true,
          lastUpdated: cachedData.updated_at
        });
      }
      
      return NextResponse.json(
        { public_repos: 10, cached: false, error: 'Failed to fetch data' },
        { status: 200 }
      );
    }

    const data = await response.json();
    
    const newRepoCount = data.public_repos;
    const shouldUpdateCache = !cachedData || cachedData.public_repos !== newRepoCount;
    
    if (shouldUpdateCache) {
      cachedData = {
        public_repos: newRepoCount,
        updated_at: data.updated_at
      };
      lastFetch = now;
    }

    return NextResponse.json({
      public_repos: cachedData!.public_repos,
      cached: false,
      lastUpdated: cachedData!.updated_at
    });

  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    
    if (cachedData) {
      return NextResponse.json({
        public_repos: cachedData.public_repos,
        cached: true,
        lastUpdated: cachedData.updated_at
      });
    }

    return NextResponse.json(
      { public_repos: 10, cached: false, error: 'Failed to fetch data' },
      { status: 200 }
    );
  }
}