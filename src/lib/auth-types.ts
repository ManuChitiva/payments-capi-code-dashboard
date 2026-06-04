export type AuthStoreSummary = {
  id: number;
  name: string;
  slug: string;
  label: string | null;
  logoUrl: string | null;
  primaryColor: string | null;
};

export type AuthClientDetail = {
  id: number;
  name: string;
  email: string;
  activeStoreId: number | null;
  stores: AuthStoreSummary[];
};

export type AuthLoginResponse = {
  token: string;
  client: AuthClientDetail;
};

export type AuthRegisterPayload = {
  name: string;
  email: string;
  password: string;
  storeName: string;
  storeLabel?: string;
  storeSlug?: string;
};
