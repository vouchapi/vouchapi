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

export class VouchClient extends EventEmitter<EventMap> {
  private socket: Socket;
  public apiClient = initClient(version1, BaseClientConfig(this));
  public vouches = new VouchManager(this);
  public profiles = new ProfileManager(this);

  constructor() {
    super();
    this.socket = io(BaseClientConfig(this).baseUrl); // You can specify the server URL if needed
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.socket.on(
      WebhookEvents.ProfileCreated,
      (data: ProfileCreatedEvent) => {
        this.emit(EventTypes.ProfileCreated, data);

        for (const profile of data.profiles) {
          this.profiles.cache.set(
            profile.id.toString(),
            new Profile(profile, this)
          );
        }
      }
    );

    this.socket.on(
      WebhookEvents.ProfileUpdated,
      (data: ProfileUpdatedEvent) => {
        this.emit(EventTypes.ProfileUpdated, data);

        this.profiles.cache.set(
          data.newProfiles.id.toString(),
          new Profile(data.newProfiles, this)
        );
      }
    );

    this.socket.on(WebhookEvents.VouchCreated, (data: VouchCreatedEvent) => {
      this.emit(EventTypes.VouchCreated, data);

      this.vouches.cache.set(
        data.vouch.id.toString(),
        new Vouch(data.vouch, this)
      );
    });

    this.socket.on(WebhookEvents.VouchUpdated, (data: VouchUpdatedEvent) => {
      this.emit(EventTypes.VouchUpdated, data);
      this.vouches.cache.set(
        data.newVouch.id.toString(),
        new Vouch(data.newVouch, this)
      );
    });
    this.socket.on("connect", () => {
      this.emit("ready");
    });
  }

  // Clean up resources when needed
  public disconnect() {
    this.socket.disconnect();
  }
}
