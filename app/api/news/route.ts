import { supabase } from '@/lib/supabase';

/**
 * GET /api/news - Fetch all news posts
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const published = searchParams.get('published');

    let query = supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });

    if (published !== null) {
      query = query.eq('published', published === 'true');
    }

    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      return Response.json({ error: 'Failed to fetch news' }, { status: 500 });
    }

    return Response.json({
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/news - Create a new news post
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title_en,
      title_ha,
      content_en,
      content_ha,
      excerpt_en,
      excerpt_ha,
      featured_image,
      published,
      author,
      tags,
    } = body;

    // Validation
    const errors: Record<string, string> = {};

    if (!title_en || title_en.trim().length < 5) {
      errors.title_en = 'English title must be at least 5 characters';
    }
    if (!content_en || content_en.trim().length < 50) {
      errors.content_en = 'English content must be at least 50 characters';
    }

    if (Object.keys(errors).length > 0) {
      return Response.json({ error: 'Validation failed', details: errors }, { status: 400 });
    }

    // Upload featured image if provided
    let imageUrl = '';
    if (featured_image) {
      try {
        const base64Data = featured_image.split(',')[1] || featured_image;
        const buffer = Buffer.from(base64Data, 'base64');
        const fileName = `news/${Date.now()}-${title_en.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.jpg`;

        const { data, error: uploadError } = await supabase.storage
          .from('gallery-images')
          .upload(fileName, buffer, {
            contentType: 'image/jpeg',
            upsert: false,
          });

        if (!uploadError && data) {
          const { data: urlData } = supabase.storage
            .from('gallery-images')
            .getPublicUrl(fileName);
          imageUrl = urlData.publicUrl;
        }
      } catch (imageError) {
        console.error('Image upload failed:', imageError);
      }
    }

    // Create news post
    const { data, error } = await supabase
      .from('news')
      .insert([
        {
          title_en: title_en.trim(),
          title_ha: title_ha?.trim() || null,
          content_en: content_en.trim(),
          content_ha: content_ha?.trim() || null,
          excerpt_en: excerpt_en?.trim() || null,
          excerpt_ha: excerpt_ha?.trim() || null,
          featured_image: imageUrl || null,
          published: published || false,
          author: author || 'Admin',
          tags: tags || [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      return Response.json({ error: 'Failed to create news post' }, { status: 500 });
    }

    return Response.json({
      success: true,
      news: data[0],
      message: 'News post created successfully',
    });
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PUT /api/news/[id] - Update a news post
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      title_en,
      title_ha,
      content_en,
      content_ha,
      excerpt_en,
      excerpt_ha,
      featured_image,
      published,
      author,
      tags,
    } = body;

    // Validation
    const errors: Record<string, string> = {};

    if (!title_en || title_en.trim().length < 5) {
      errors.title_en = 'English title must be at least 5 characters';
    }
    if (!content_en || content_en.trim().length < 50) {
      errors.content_en = 'English content must be at least 50 characters';
    }

    if (Object.keys(errors).length > 0) {
      return Response.json({ error: 'Validation failed', details: errors }, { status: 400 });
    }

    // Handle image upload if new image provided
    let imageUrl = featured_image;
    if (featured_image && featured_image.startsWith('data:image')) {
      try {
        const base64Data = featured_image.split(',')[1] || featured_image;
        const buffer = Buffer.from(base64Data, 'base64');
        const fileName = `news/${Date.now()}-update-${title_en.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.jpg`;

        const { data, error: uploadError } = await supabase.storage
          .from('gallery-images')
          .upload(fileName, buffer, {
            contentType: 'image/jpeg',
            upsert: false,
          });

        if (!uploadError && data) {
          const { data: urlData } = supabase.storage
            .from('gallery-images')
            .getPublicUrl(fileName);
          imageUrl = urlData.publicUrl;
        }
      } catch (imageError) {
        console.error('Image upload failed:', imageError);
      }
    }

    // Update news post
    const { data, error } = await supabase
      .from('news')
      .update({
        title_en: title_en.trim(),
        title_ha: title_ha?.trim() || null,
        content_en: content_en.trim(),
        content_ha: content_ha?.trim() || null,
        excerpt_en: excerpt_en?.trim() || null,
        excerpt_ha: excerpt_ha?.trim() || null,
        featured_image: imageUrl || null,
        published: published || false,
        author: author || 'Admin',
        tags: tags || [],
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select();

    if (error) {
      return Response.json({ error: 'Failed to update news post' }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return Response.json({ error: 'News post not found' }, { status: 404 });
    }

    return Response.json({
      success: true,
      news: data[0],
      message: 'News post updated successfully',
    });
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/news/[id] - Delete a news post
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', params.id);

    if (error) {
      return Response.json({ error: 'Failed to delete news post' }, { status: 500 });
    }

    return Response.json({
      success: true,
      message: 'News post deleted successfully',
    });
  } catch (error) {
    console.error('API error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}