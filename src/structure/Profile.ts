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

  get warningBy() {
    return this.profileData.warningBy;
  }

  get warningByUser() {
    return this.profileData.warningByUser;
  }

  get waringReason() {
    return this.profileData.waringReason;
  }

  get warningAt() {
    if (!this.profileData.warningAt) return null;
    return new Date(this.profileData.warningAt);
  }

  get markedBy() {
    return this.profileData.markedBy;
  }

  get markedByUser() {
    return this.profileData.markedByUser;
  }

  get markedFor() {
    return this.profileData.markedFor;
  }

  get markedAt() {
    if (!this.profileData.markedAt) return null;
    return new Date(this.profileData.markedAt);
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
    return this.profileData.products;
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

  get isMarked() {
    return this.markedBy !== null;
  }

  get isMarkedByStaff() {
    return this.markedByUser !== null;
  }

  get isWarned() {
    return this.warningBy !== null;
  }

  get isWarnedByStaff() {
    return this.warningByUser !== null;
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
    const updated = await this.update({
      products,
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
      body: update,
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
