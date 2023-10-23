import { initClient } from "@ts-rest/core";
import { BaseClientConfig } from "../api/baseUrl";
import { version1 } from "../api/contract";
import { VouchManager } from "../managers/VouchManager";

import { io, Socket } from "socket.io-client";
import {
  EventMap,
  EventTypes,
  ProfileCreatedEvent,
  ProfileUpdatedEvent,
  VouchCreatedEvent,
  VouchUpdatedEvent,
  WebhookEvents,
} from "../api/events";
import { EventEmitter } from "../event/EventEmitter";
import { ProfileManager } from "../managers/ProfileManager";
import { Vouch } from "../structure/Vouch";
import { Profile } from "../structure/Profile";
import { LeaderboardManager } from "../managers/LeaderBoardManager";

export class VouchClient extends EventEmitter<EventMap> {
  public ws: Socket;
  public apiClient = initClient(version1, BaseClientConfig(this));
  public vouches = new VouchManager(this);
  public profiles = new ProfileManager(this);
  public leaderboard = new LeaderboardManager(this);

  constructor() {
    super();
    this.ws = io(BaseClientConfig(this).baseUrl); // You can specify the server URL if needed
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.ws.on(WebhookEvents.ProfileCreated, (data: ProfileCreatedEvent) => {
      this.emit(EventTypes.ProfileCreated, data);

      for (const profile of data.profiles) {
        this.profiles.cache.set(profile.userId, new Profile(profile, this));
      }
    });

    this.ws.on(WebhookEvents.ProfileUpdated, (data: ProfileUpdatedEvent) => {
      this.emit(EventTypes.ProfileUpdated, data);

      this.profiles.cache.set(
        data.newProfile.userId,
        new Profile(data.newProfile, this)
      );
    });

    this.ws.on(WebhookEvents.VouchCreated, (data: VouchCreatedEvent) => {
      this.emit(EventTypes.VouchCreated, data);

      this.vouches.cache.set(
        data.vouch.id.toString(),
        new Vouch(data.vouch, this)
      );
    });

    this.ws.on(WebhookEvents.VouchUpdated, (data: VouchUpdatedEvent) => {
      this.emit(EventTypes.VouchUpdated, data);
      this.vouches.cache.set(
        data.newVouch.id.toString(),
        new Vouch(data.newVouch, this)
      );
    });
    this.ws.on("connect", () => {
      this.emit("ready");
    });
  }

  // Clean up resources when needed
  public disconnect() {
    this.ws.disconnect();
  }
}
