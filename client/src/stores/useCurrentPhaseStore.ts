import { readonly, ref } from "vue";

import { Phase } from "@/gql/graphql.ts";

const currentPhase = ref<Phase>(Phase.Shutdown);

const setCurrentPhase = (phase: Phase) => {
  currentPhase.value = phase;
};

export const useCurrentPhaseStore = () => ({
  currentPhase: readonly(currentPhase),
  setCurrentPhase,
});
