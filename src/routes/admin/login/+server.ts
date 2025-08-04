import { json } from '@sveltejs/kit';
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '$env/static/private';

export async function POST({ request, cookies }) {
  const { username, password } = await request.json();

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    cookies.set('loggedIn', 'true', { path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 7 }); // 1 week
    return json({ message: 'Logged in successfully' }, { status: 200 });
  } else {
    return json({ message: 'Invalid credentials' }, { status: 401 });
  }
}