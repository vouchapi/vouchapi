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
    return this.profileData.warningAt;
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
    return this.profileData.markedAt;
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
    return this.profileData.createdAt;
  }

  get badges() {
    return this.profileData.badges;
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
}
