import {
  index,
  integer,
  json,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const profileStatus = pgEnum("ProfileStatus", [
  "DEAL_WITH_CAUTION",
  "BLACKLISTED_AND_DEAL_WITH_CAUTION",
  "SCAMMER",
  "BLOCKED",
  "BLACKLISTED",
  "GOOD",
]);

export const ProfileStatusSchema = z.enum(profileStatus.enumValues);

export const badges = pgEnum("Badges", [
  "SHINEX_ADMIN",
  "SHINEX_STAFF",
  "APPEAL_STAFF",
  "REPORT_STAFF",
  "MEMBER",
  "EARLYSUPPORTER",
]);

export const role = pgEnum("Role", [
  "USER",
  "REPORT_STAFF",
  "MODERATOR",
  "ADMIN",
  "OWNER",
]);

export const RoleSchema = z.enum(role.enumValues);

export const vouchStatus = pgEnum("VouchStatus", [
  "DENIED",
  "DENIED_FOR_PROOF",
  "APPROVED",
  "APPROVED_WITH_PROOF",
  "PENDING_PROOF_RECEIVER",
  "PENDING_PROOF_VOUCHER",
  "UNCHECKED",
  "DELETED",
]);

export const VouchStatusSchema = z.enum(vouchStatus.enumValues);

type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<
  infer ElementType
>
  ? ElementType
  : never;

export type VouchActivity = {
  vouchId: number;
  staffId: string;
  staffName: string;
  client?: string;
  activity: ElementType<typeof vouchStatus.enumValues>;
  reason?: string;
  at: Date;
};

export const vouch = pgTable("Vouchs", {
  id: serial("id").primaryKey().notNull(),
  vouchStatus: vouchStatus("vouchStatus").default("UNCHECKED").notNull(),
  voucherId: text("voucherId").notNull(),
  voucherName: text("voucherName").notNull(),
  receiverId: text("receiverId")
    .notNull()
    .references(() => profile.userId, {
      onDelete: "restrict",
      onUpdate: "cascade",
    }),
  receiverName: text("receiverName").notNull(),
  comment: text("comment").notNull(),
  serverId: text("serverId").notNull(),
  serverName: text("serverName").notNull(),
  customData: json("customData").$type<Record<string, any>>(),
  deniedReason: text("deniedReason"),
  activities: json("activities").array().$type<VouchActivity[]>(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});

export const profile = pgTable(
  "Profile",
  {
    id: serial("id").primaryKey().notNull(),
    userId: text("userId").notNull(),
    username: text("username").notNull(),
    customAvatar: text("customAvatar"),
    role: role("role").default("USER").notNull(),
    profileStatus: profileStatus("profileStatus").default("GOOD").notNull(),
    warning: json("warning")
      .default({})
      .$type<{
        reason: string;
        by: string;
        at: Date;
      }>()
      .notNull(),
    mark: json("mark")
      .default({})
      .$type<{
        for: string;
        by: string;
        at: Date;
      }>()
      .notNull(),
    color: integer("color"),
    shop: text("shop").default("Set your shop"),
    forum: text("forum").default("Set your forum"),
    products: text("products").default("Set your products"),
    banner: text("banner").default(""),
    positiveVouches: integer("positiveVouches").default(0).notNull(),
    importedVouches: integer("importedVouches").default(0).notNull(),
    latestComments: text("latestComments").notNull().default(""),
    createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
    badges: text("badges"),
    alternative: text("alternative").default("").notNull(),
  },
  (table) => {
    return {
      userId: index("userId").on(table.userId),
    };
  }
);

export const VouchActivitySchema = z.object({
  staffId: z.string(),
  staffName: z.string(),
  activity: z.enum(vouchStatus.enumValues),
  reason: z.string().optional(),
  at: z.date().optional(),
});

export const VouchSelectSchema = createSelectSchema(vouch).extend({
  activities: z.array(VouchActivitySchema),
});
export const ProfileSelectSchema = createSelectSchema(profile);

export const VouchInsertSchema = createInsertSchema(vouch).extend({
  activities: z.array(VouchActivitySchema),
});
export const ProfileInsertSchema = createInsertSchema(profile);

export const VouchActivityWithReasonSchema = VouchActivitySchema.extend({
  reason: z.string(),
});
