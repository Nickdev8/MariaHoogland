import type { PageLoad } from './$types.ts';

export const load: PageLoad = ({ params }) => {
  return {
    event: params.event
  };
};