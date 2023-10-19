import {
  profile,
  ProfileSelectSchema,
  VouchSelectSchema,
  vouch as VouchType,
} from "./schema";

export const WebhookEvents = {
  ProfileCreated: "profile.created",
  ProfileUpdated: "profile.updated",
  VouchCreated: "vouch.created",
  VouchUpdated: "vouch.updated",
};

export enum EventTypes {
  ProfileCreated = "profileCreated",
  ProfileUpdated = "profileUpdated",
  VouchCreated = "vouchCreated",
  VouchUpdated = "vouchUpdated",
}

export class ProfileCreatedEvent {
  constructor(public profiles: (typeof ProfileSelectSchema._type)[]) {}
}

export class ProfileUpdatedEvent {
  constructor(
    public oldProfiles: typeof ProfileSelectSchema._type,
    public newProfiles: typeof ProfileSelectSchema._type
  ) {}
}

export class VouchCreatedEvent {
  constructor(public vouch: typeof VouchSelectSchema._type) {}
}

export class VouchUpdatedEvent {
  constructor(
    public oldVouch: typeof VouchSelectSchema._type,
    public newVouch: typeof VouchSelectSchema._type
  ) {}
}

export type EventMap = {
  [EventTypes.ProfileCreated]: [ProfileCreatedEvent];
  [EventTypes.ProfileUpdated]: [ProfileUpdatedEvent];
  [EventTypes.VouchCreated]: [VouchCreatedEvent];
  [EventTypes.VouchUpdated]: [VouchUpdatedEvent];
  ready: [];
};
