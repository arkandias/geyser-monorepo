import { Phase } from "@/gql/graphql.ts";
import { capitalize, toLowerCase } from "@/utils/misc.ts";

export const CUSTOM_TEXT_KEYS = [
  "homeTitle",
  `homeSubtitle${capitalize(toLowerCase(Phase.Requests))}`,
  `homeSubtitle${capitalize(toLowerCase(Phase.Assignments))}`,
  `homeSubtitle${capitalize(toLowerCase(Phase.Results))}`,
  `homeSubtitle${capitalize(toLowerCase(Phase.Shutdown))}`,
  `homeMessage${capitalize(toLowerCase(Phase.Requests))}`,
  `homeMessage${capitalize(toLowerCase(Phase.Assignments))}`,
  `homeMessage${capitalize(toLowerCase(Phase.Results))}`,
  `homeMessage${capitalize(toLowerCase(Phase.Shutdown))}`,
  "contact",
  "legalNotice",
] as const;

export type CustomTextKey = (typeof CUSTOM_TEXT_KEYS)[number];

export const isCustomTextKey = (key: unknown): key is CustomTextKey =>
  CUSTOM_TEXT_KEYS.includes(key as CustomTextKey);
