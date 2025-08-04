import { redirect } from '@sveltejs/kit';

export async function POST({ cookies }) {
  cookies.delete('loggedIn', { path: '/' });
  throw redirect(302, '/admin/login');
}