export const version = import.meta.env.DEV
  ? "dev"
  : (import.meta.env.VITE_BUILD_VERSION ?? null);

export const apiUrl = import.meta.env.VITE_API_URL;

export const graphqlUrl = apiUrl + "/graphql";
