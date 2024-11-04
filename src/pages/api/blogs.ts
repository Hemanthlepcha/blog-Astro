import type { APIRoute } from 'astro';
import mongoose from 'mongoose';
import { Blog } from '../../models/Blog';
import { authMiddleware } from '../../middleware/auth';
import { uploadImage } from '../../utils/imageUpload';

export const POST: APIRoute = async (context) => {
  try {
    // Verify authentication
    const authResult = await authMiddleware(context);
    if (authResult instanceof Response) {
      return authResult;
    }

    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blog');

    const formData = await context.request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const imageFile = formData.get('image') as File;

    // Upload image and get URL
    const imageUrl = await uploadImage(imageFile);
    
    // Create new blog post
    const blog = new Blog({
      title,
      description,
      image: imageUrl,
      author: authResult.user.userId,
    });

    await blog.save();

    return new Response(JSON.stringify({ message: 'Blog created successfully' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } finally {
    await mongoose.disconnect();
  }
};