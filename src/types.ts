export interface ProfileRegister {
  userId: string;
  username: string;
}

export interface ProfileFetchOptions {
  id: string;
  username?: string;
}

export interface ProfilesFetchOptions {
  limit?: number;
  sortBy?: "createdAt" | "positiveVouches" | "importedVouches";
}
