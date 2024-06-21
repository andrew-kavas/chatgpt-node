const { fetch } = globalThis;

export default async ({ url }) => {
  const res = await fetch(url);

  return await res.text();
};
