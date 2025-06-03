import { Phase, RequestType, RoleType } from "@/gql/graphql.ts";

export const isPhase = (phase: unknown): phase is Phase =>
  Object.values(Phase).includes(phase as Phase);

export const isRequestType = (rt: unknown): rt is RequestType =>
  Object.values(RequestType).includes(rt as RequestType);

export const isRole = (role: unknown): role is RoleType =>
  Object.values(RoleType).includes(role as RoleType);
