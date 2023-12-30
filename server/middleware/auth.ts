import { getServerSession } from '#auth';

export default defineEventHandler(async (event) => {

  const targetUrl = event.req.url;
	const securedUrls = '/api/dashboard/';
  
  if (targetUrl.startsWith(securedUrls)) {

    const session = await getServerSession(event);

    if (!session) {
      throw createError({
        statusMessage: 'Unauthenticated',
        statusCode: 403
      });
    };

    event.session = session
  }
});