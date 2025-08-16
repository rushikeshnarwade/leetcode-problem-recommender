import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { query, variables } = await req.json();

    const leetcodeResponse = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com', // Important for LeetCode's API
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!leetcodeResponse.ok) {
      const errorText = await leetcodeResponse.text();
      console.error('Error from LeetCode GraphQL:', leetcodeResponse.status, errorText);
      return NextResponse.json({ error: 'Failed to fetch from LeetCode GraphQL', details: errorText }, { status: leetcodeResponse.status });
    }

    const data = await leetcodeResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Proxy API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
