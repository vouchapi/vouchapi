import { version1 } from "../api/contract";
import { VouchClient } from "../client/VouchClient";
import { Profile } from "../structure/Profile";
import { ProfileFetchOptions } from "../types";

export class ProfileManager {
  public readonly cache = new Map<string, Profile>();

  constructor(public readonly vouchClient: VouchClient) {
    const profiles = this.vouchClient.apiClient.getProfiles();

    profiles.then((profiles) => {
      if (profiles.status !== 200) {
        return;
      }

      for (const profile of profiles.body) {
        this.cache.set(
          profile.id.toString(),
          new Profile(profile, this.vouchClient)
        );
      }
    });
  }

  async fetch(options: ProfileFetchOptions | string) {
    let id;
    if (typeof options === "string") {
      id = options;
    } else {
      id = options.id;
    }

    const profile = await this.vouchClient.apiClient.getProfile({
      params: {
        id: id.toString(),
      },
      query: {
        username: options instanceof Object ? options.username : undefined,
      },
    });

    if (profile.status !== 200) {
      return null;
    }

    return new Profile(profile.body, this.vouchClient);
  }

  async fetchAll() {
    const profiles = await this.vouchClient.apiClient.getProfiles();

    if (profiles.status !== 200) {
      return [];
    }

    return profiles.body.map(
      (profile) => new Profile(profile, this.vouchClient)
    );
  }

  async register({ id, username }: { id: string; username: string }) {
    const profile = await this.vouchClient.apiClient.registerProfile({
      params: {
        id,
      },
      body: {
        userId: id,
        username,
      },
    });

    if (profile.status !== 201) {
      return null;
    }

    return new Profile(profile.body, this.vouchClient);
  }

  async update(id: string, update: typeof version1.updateProfile.body._type) {
    return await this.vouchClient.apiClient.updateProfile({
      params: {
        id,
      },
      body: update,
    });
  }
}
