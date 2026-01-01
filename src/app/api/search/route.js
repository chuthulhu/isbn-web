import { NextResponse } from 'next/server';
import axios from 'axios';

export const runtime = 'edge';

export async function OPTIONS() {
    return NextResponse.json({}, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const isbn = searchParams.get('isbn');

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (!isbn) {
        return NextResponse.json({ error: 'ISBN parameter is required' }, { status: 400, headers: corsHeaders });
    }

    const clientId = process.env.NAVER_CLIENT_ID;
    const clientSecret = process.env.NAVER_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500, headers: corsHeaders });
    }

    const apiUrl = 'https://openapi.naver.com/v1/search/book.json';

    try {
        const response = await axios.get(apiUrl, {
            params: {
                query: isbn, // query is mandatory
                d_isbn: isbn
            },
            headers: {
                'X-Naver-Client-Id': clientId,
                'X-Naver-Client-Secret': clientSecret
            }
        });

        const items = response.data.items;

        if (items && items.length > 0) {
            const book = items[0];
            return NextResponse.json({
                title: book.title,
                author: book.author,
                publisher: book.publisher,
                pubdate: book.pubdate,
                image: book.image,
                isbn: book.isbn
            }, { headers: corsHeaders });
        } else {
            return NextResponse.json({ error: 'Book not found' }, { status: 404, headers: corsHeaders });
        }

    } catch (error) {
        console.error('Error searching book:', error.message);
        return NextResponse.json({ error: 'Failed to fetch book data' }, { status: 500, headers: corsHeaders });
    }
}
