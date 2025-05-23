<script setup lang="ts">
import { useQuery } from "@urql/vue";
import { computed, inject, watch } from "vue";

import { NotifyType, useNotify } from "@/composables/useNotify.ts";
import { useTypedI18n } from "@/composables/useTypedI18n.ts";
import { graphql } from "@/gql";
import { GetAppDataDocument, PhaseEnum, RoleTypeEnum } from "@/gql/graphql.ts";
import type { AuthManager } from "@/services/auth.ts";
import { useCurrentPhaseStore } from "@/stores/useCurrentPhaseStore.ts";
import { useCustomTextsStore } from "@/stores/useCustomTextsStore.ts";
import { useServicesStore } from "@/stores/useServicesStore.ts";
import { useYearsStore } from "@/stores/useYearsStore.ts";

import TheHeader from "@/components/TheHeader.vue";
import PageHome from "@/pages/PageHome.vue";

graphql(`
  query GetAppData($uid: String!) {
    phase: currentPhase(
      limit: 1 # unique
    ) {
      value
    }
    years: year(orderBy: { value: DESC }) {
      value
      current
      visible
    }
    customTexts: appSetting(orderBy: [{ key: ASC }]) {
      key
      value
    }
    services: service(where: { uid: { _eq: $uid } }) {
      id
      year
    }
  }
`);

const { t } = useTypedI18n();
const { notify } = useNotify();
const { currentPhase, setCurrentPhase } = useCurrentPhaseStore();
const { setYears } = useYearsStore();
const { setCustomTexts } = useCustomTextsStore();
const { setServices } = useServicesStore();

const authManager = inject<AuthManager>("authManager");
if (!authManager) {
  throw new Error("Authentication manager is not provided to the app");
}

// Fetch app data
const getAppData = useQuery({
  query: GetAppDataDocument,
  variables: { uid: authManager.uid },
  pause: () => !authManager.isAuthenticated || !authManager.isActive,
  context: { additionalTypenames: ["All", "AppSetting", "Phase", "Year"] },
});
watch(
  [getAppData.data, getAppData.error],
  ([data, error]) => {
    if (error) {
      notify(NotifyType.Error, {
        message: t("app.data.error"),
        caption: error.message,
      });
      return;
    }
    if (data?.phase[0]?.value) {
      setCurrentPhase(data.phase[0].value);
    }
    if (data?.years) {
      setYears(
        data.years.map((year) => ({
          value: year.value,
          current: year.current,
          visible: year.visible,
        })),
      );
    }
    if (data?.customTexts) {
      setCustomTexts(data.customTexts);
    }
    if (data?.services) {
      setServices(data.services);
    }
  },
  { immediate: true },
);

watch(
  currentPhase,
  (phase) => {
    if (!authManager.isAuthenticated || !authManager.isActive) {
      return;
    }

    if (authManager.allowedRoles.includes(RoleTypeEnum.Admin)) {
      authManager.setActiveRole(RoleTypeEnum.Admin);
    } else if (
      authManager.allowedRoles.includes(RoleTypeEnum.Commissioner) &&
      phase === PhaseEnum.Assignments
    ) {
      authManager.setActiveRole(RoleTypeEnum.Commissioner);
    }
  },
  { immediate: true },
);

// Access check and information messages
const accessDeniedMessage = computed(() => {
  if (!authManager.isAuthenticated) {
    return t("home.alert.notAuthenticated");
  }
  if (!authManager.isActive) {
    return t("home.alert.notActive");
  }
  if (getAppData.fetching.value) {
    return t("home.alert.loadingAppData");
  }
  if (
    currentPhase.value === PhaseEnum.Shutdown &&
    authManager.activeRole.value !== RoleTypeEnum.Admin
  ) {
    return t("home.alert.shutdown");
  }
  return "";
});
const accessGranted = computed(() => !accessDeniedMessage.value);

// Apply distinct styling in development vs production environments to provide
// visual feedback to developers about which environment they're using
const devClass = {
  dev: import.meta.env.DEV,
};
</script>

<template>
  <QLayout view="hHh lpR fFf" class="text-body-1" :class="devClass">
    <TheHeader :disable="!accessGranted" />
    <QPageContainer>
      <RouterView v-if="accessGranted" />
      <PageHome v-else :alert="accessDeniedMessage" />
    </QPageContainer>
  </QLayout>
</template>

<style scoped lang="scss"></style>
