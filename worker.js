export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (
      url.pathname === "/404" ||
      url.pathname === "/404/" ||
      url.pathname === "/404.html"
    ) {
      return Response.redirect(`${url.origin}/`, 301);
    }

    const response = await env.ASSETS.fetch(request);

    if (response.status === 404) {
      return Response.redirect(`${url.origin}/`, 301);
    }

    return response;
  },
};
