import { api_call } from "./constant";

export const signupFn = async (user: {
  username: string;
}): Promise<User | null> => {
  const username = user.username?.trim();

  if (!username || username.length < 2 || username.length > 40) {
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const apiUser = await fetch(`${api_call}/users`, {
      method: "POST",
      body: JSON.stringify({ username }),
      headers: {
        "content-type": "application/json",
      },
      signal: controller.signal,
      cache: "no-store",
    });

    if (apiUser.ok)
      return apiUser.json() as Promise<User | null>;
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
};
