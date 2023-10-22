// contract.ts

import { initContract } from "@ts-rest/core";
import {
  ProfileInsertSchema,
  ProfileSelectSchema,
  VouchActivitySchema,
  VouchInsertSchema,
  VouchSelectSchema,
  profile,
} from "./schema";
import { z } from "zod";

const c = initContract();

export const version1 = c.router(
  {
    getProfiles: {
      path: "v1/profiles",
      method: "GET",
      summary: "Get all profiles",
      responses: {
        200: ProfileSelectSchema.array(),
      },
    },
    getProfile: {
      path: "v1/profiles/:id",
      method: "GET",
      summary: "Get profile by id",
      query: z.object({
        username: z.string().optional(),
      }),
      responses: {
        200: ProfileSelectSchema,
      },
    },
    registerProfile: {
      path: "v1/profiles/:id/register",
      method: "POST",
      summary: "Register profile",
      body: ProfileInsertSchema,
      responses: {
        201: ProfileSelectSchema,
        400: z.object({
          statusCode: z.number(),
          message: z.string(),
        }),
      },
    },
    updateProfile: {
      path: "v1/profiles/:id/update",
      method: "POST",
      summary: "Update profile",
      body: ProfileSelectSchema.omit({
        id: true,
        createdAt: true,
        positiveVouches: true,
        importedVouches: true,
        latestComments: true,
      }).partial(),
      responses: {
        201: ProfileSelectSchema,
        400: z.object({
          statusCode: z.number(),
          message: z.string(),
        }),
      },
    },
    getProfileVouch: {
      path: "v1/profiles/:id/vouches/:vouchId",
      method: "GET",
      summary: "Get a User Vouch",
      responses: {
        200: VouchSelectSchema.array(),
      },
    },
    postVouch: {
      path: "v1/profiles/:id/vouches",
      method: "POST",
      summary: "Post a vouch",
      body: VouchInsertSchema.omit({
        id: true,
        activities: true,
        createdAt: true,
        vouchStatus: true,
        deniedReason: true,
      }),
      responses: {
        201: VouchSelectSchema,
        400: z.object({
          statusCode: z.number(),
          message: z.string(),
        }),
      },
    },
    getVouches: {
      path: "v1/vouches",
      method: "GET",
      summary: "Get All Vouches",
      query: z.object({
        vouchIds: z.string().optional(),
        status: z.string().optional(),
        receiverId: z.string().optional(),
        senderId: z.string().optional(),
        limit: z.number().optional(),
        sortBy: z.string().optional(),
      }),
      responses: {
        200: VouchSelectSchema.array(),
      },
    },
    getVouch: {
      path: "v1/vouches/:vouchId",
      method: "GET",
      summary: "Get All Vouches",
      responses: {
        200: VouchSelectSchema || null,
      },
    },
    updateVouch: {
      path: "v1/vouches/:vouchId/update",
      method: "POST",
      summary: "Update a vouch",
      body: VouchInsertSchema.omit({
        id: true,
        activities: true,
        createdAt: true,
        vouchStatus: true,
        deniedReason: true,
      }).partial(),
      responses: {
        201: VouchSelectSchema,
        400: z.object({
          statusCode: z.number(),
          message: z.string(),
        }),
      },
    },

    approveVouch: {
      path: "v1/vouches/:vouchId/approve",
      method: "POST",
      summary: "Approve a vouch",
      body: VouchActivitySchema.omit({
        at: true,
        activity: true,
      }),
      responses: {
        201: VouchSelectSchema,
        400: z.object({
          statusCode: z.number(),
          message: z.string(),
        }),
      },
    },
    denyVouch: {
      path: "v1/vouches/:vouchId/deny",
      method: "POST",
      summary: "Deny a vouch",
      body: VouchActivitySchema.extend({
        reason: z.string(),
      }).omit({
        at: true,
        activity: true,
      }),
      responses: {
        201: VouchSelectSchema,
        400: z.object({
          statusCode: z.number(),
          message: z.string(),
        }),
      },
    },
    askProofVouch: {
      path: "v1/vouches/:vouchId/askproof/:who",
      method: "POST",
      summary: "Ask proof for a vouch",
      body: VouchActivitySchema.omit({
        at: true,
        activity: true,
      }),
      responses: {
        201: VouchSelectSchema,
        400: z.object({
          statusCode: z.number(),
          message: z.string(),
        }),
      },
    },
    deleteVouch: {
      path: "v1/vouches/:vouchId/delete",
      method: "POST",
      summary: "Delete a vouch",
      responses: {
        201: VouchSelectSchema,
        400: z.object({
          statusCode: z.number(),
          message: z.string(),
        }),
      },
      body: VouchActivitySchema.omit({
        at: true,
        activity: true,
      }),
    },
    getTop10: {
      path: "v1/leaderboard/top",
      method: "GET",
      summary: "Get top 10 vouchers",
      responses: {
        200: ProfileSelectSchema.array(),
      },
    },
    getHot10: {
      path: "v1/leaderboard/hot",
      method: "GET",
      summary: "Get hot 10 vouchers",
      responses: {
        200: ProfileSelectSchema.array(),
      },
    },
  },
  {
    baseHeaders: z.object({
      "x-client-key": z.string(),
      "x-client-secret": z.string(),
    }),
  }
);
