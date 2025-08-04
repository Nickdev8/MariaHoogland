export function load({ cookies }) {
  return {
    loggedIn: cookies.get('loggedIn') === 'true'
  };
}