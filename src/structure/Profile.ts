import { version1 } from "../api/contract";
import { ProfileSelectSchema } from "../api/schema";
import { VouchClient } from "../client/VouchClient";
import { VouchManager } from "../managers/VouchManager";

export class Profile {
  public vouches: VouchManager;

  constructor(
    private profileData: typeof ProfileSelectSchema._type,
    public vouchClient: VouchClient
  ) {
    this.vouches = new VouchManager(this.vouchClient, this.id);
  }

  get id() {
    return this.profileData.id.toString();
  }

  get userId() {
    return this.profileData.userId;
  }

  get username() {
    return this.profileData.username;
  }

  get customAvatar() {
    return this.profileData.customAvatar;
  }

  get role() {
    return this.profileData.role;
  }

  get profileStatus() {
    return this.profileData.profileStatus;
  }

  get waring() {
    return this.profileData.warning as null | {
      reason: string;
      by: string;
      at: Date;
    };
  }

  get mark() {
    return this.profileData.mark as null | {
      for: string;
      by: string;
      at: Date;
    };
  }

  get color() {
    return this.profileData.color;
  }

  get shop() {
    return this.profileData.shop;
  }

  get forum() {
    return this.profileData.forum;
  }

  get products() {
    return this.profileData.products?.split(",") ?? [];
  }

  get banner() {
    return this.profileData.banner;
  }

  get positiveVouches() {
    return this.profileData.positiveVouches;
  }

  get importedVouches() {
    return this.profileData.importedVouches;
  }

  get latestComments() {
    return this.profileData.latestComments;
  }

  get createdAt() {
    return new Date(this.profileData.createdAt);
  }

  get badges() {
    return this.profileData.badges?.split(",") ?? [];
  }

  get isScammer() {
    return this.profileStatus === "SCAMMER";
  }

  get isBlacklisted() {
    return (
      this.profileStatus === "BLACKLISTED" ||
      this.profileStatus === "BLACKLISTED_AND_DEAL_WITH_CAUTION"
    );
  }

  get isBlocked() {
    return this.profileStatus === "BLOCKED";
  }

  get isDWC() {
    return (
      this.profileStatus === "DEAL_WITH_CAUTION" ||
      this.profileStatus === "BLACKLISTED_AND_DEAL_WITH_CAUTION"
    );
  }

  async addBadge(badge: string) {
    const updated = await this.update({
      badges: [...this.badges, badge].join(","),
    });

    if (updated === null) {
      return null;
    }

    return updated;
  }

  async setBadges(badges: string[]) {
    const updated = await this.update({
      badges: badges.join(","),
    });

    if (updated === null) {
      return null;
    }

    return updated;
  }

  async setShop(shop: string) {
    const updated = await this.update({
      shop,
    });

    if (updated === null) {
      return null;
    }

    return updated;
  }

  async setForum(forum: string) {
    const updated = await this.update({
      forum,
    });

    if (updated === null) {
      return null;
    }

    return updated;
  }

  async setProducts(products: string) {
    const formatted = products.replace(/\n/g, ",").trim();

    const updated = await this.update({
      products: formatted,
    });

    if (updated === null) {
      return null;
    }

    return updated;
  }

  async setBanner(banner: string) {
    const updated = await this.update({
      banner,
    });

    if (updated === null) {
      return null;
    }

    return updated;
  }

  async setColor(color: number) {
    const updated = await this.update({
      color,
    });

    if (updated === null) {
      return null;
    }

    return updated;
  }

  async setCustomAvatar(customAvatar: string) {
    const updated = await this.update({
      customAvatar,
    });

    if (updated === null) {
      return null;
    }

    return updated;
  }

  async update(update: typeof version1.updateProfile.body._type) {
    const updatedData = await this.vouchClient.apiClient.updateProfile({
      params: {
        id: this.id,
      },
      body: { ...update, username: this.username },
    });

    if (updatedData.status === 400) {
      if (updatedData.body.statusCode === 400) {
        throw new Error(updatedData.body.message + ". on updateProfile");
      }
    }

    if (updatedData.status !== 201) {
      return null;
    }

    const updated = new Profile(updatedData.body, this.vouchClient);

    this.profileData = updated.profileData;

    return updated;
  }
}
