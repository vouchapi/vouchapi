import { VouchSelectSchema } from "../api/schema";
import { VouchClient } from "../client/VouchClient";
import { User, GuildMember } from "discord.js";

export class Vouch {
  constructor(
    private vouchData: typeof VouchSelectSchema._type,
    public vouchClient: VouchClient
  ) {}

  get id() {
    return this.vouchData.id.toString();
  }

  get receiverId() {
    return this.vouchData.receiverId;
  }

  get receiverName() {
    return this.vouchData.receiverName;
  }

  get voucherId() {
    return this.vouchData.voucherId;
  }

  get voucherName() {
    return this.vouchData.voucherName;
  }

  get serverId() {
    return this.vouchData.serverId;
  }

  get serverName() {
    return this.vouchData.serverName;
  }

  get vouchStatus() {
    return this.vouchData.vouchStatus;
  }

  get deniedReason() {
    return this.vouchData.deniedReason;
  }

  get comment() {
    return this.vouchData.comment;
  }

  get customData() {
    return this.vouchData.customData;
  }

  get createdAt() {
    return new Date(this.vouchData.createdAt);
  }

  get activities() {
    return this.vouchData.activities;
  }

  get isApproved() {
    return this.vouchData.vouchStatus === "APPROVED";
  }

  get isDenied() {
    return this.vouchData.vouchStatus === "DENIED";
  }

  get isPending() {
    return this.vouchData.vouchStatus === "UNCHECKED";
  }

  get isPendingProofReceiver() {
    return this.vouchData.vouchStatus === "PENDING_PROOF_RECEIVER";
  }

  get isPendingProofVoucher() {
    return this.vouchData.vouchStatus === "PENDING_PROOF_VOUCHER";
  }

  get isApprovedWithProof() {
    return this.vouchData.vouchStatus === "APPROVED_WITH_PROOF";
  }

  get isDeniedForProof() {
    return this.vouchData.vouchStatus === "DENIED_FOR_PROOF";
  }

  get isDeleted() {
    return this.vouchData.vouchStatus === "DELETED";
  }

  get isApprovedOrApprovedWithProof() {
    return this.isApproved || this.isApprovedWithProof;
  }

  get isDeniedOrDeniedForProof() {
    return this.isDenied || this.isDeniedForProof;
  }

  get isApprovedOrDenied() {
    return this.isApproved || this.isDenied;
  }

  async approve({ staff }: { staff: User }) {
    return await this.vouchClient.apiClient.approveVouch({
      body: {
        staffId: staff.id,
        staffName: staff.username,
      },
      params: {
        vouchId: this.id,
      },
    });
  }

  async deny({ staff, reason }: { staff: User; reason: string }) {
    return await this.vouchClient.apiClient.denyVouch({
      body: {
        staffId: staff.id,
        staffName: staff.username,
        reason,
      },
      params: {
        vouchId: this.id,
      },
    });
  }

  async delete(staff: User) {
    return await this.vouchClient.apiClient.deleteVouch({
      params: {
        vouchId: this.id,
      },
      body: {
        staffId: staff.id,
        staffName: staff.username,
      },
    });
  }

  async askForProof({
    staff,
    who,
  }: {
    staff: User;

    who: "VOUCHER" | "RECEIVER";
  }) {
    return await this.vouchClient.apiClient.askProofVouch({
      body: {
        staffId: staff.id,
        staffName: staff.username,
      },
      params: {
        vouchId: this.id,
        who,
      },
    });
  }

  async update(
    data: Partial<
      Omit<
        typeof VouchSelectSchema._type,
        "id" | "createdAt" | "activities" | "vouchStatus"
      >
    >
  ) {
    return await this.vouchClient.apiClient.updateVouch({
      body: data,
      params: {
        vouchId: this.id,
      },
    });
  }

  setCustomData(data: Record<string, any>) {
    return this.update({ customData: data });
  }

  addCustomData(data: Record<string, any>) {
    // @ts-ignore
    return this.update({ customData: { ...this.customData, ...data } });
  }
}
