<script setup lang="ts">
import { useQuery } from "@urql/vue";
import { computed, inject, watch } from "vue";

import { NotifyType, useNotify } from "@/composables/useNotify.ts";
import { useTypedI18n } from "@/composables/useTypedI18n.ts";
import { graphql } from "@/gql";
import { GetAppDataDocument, Phase, RoleType } from "@/gql/graphql.ts";
import type { AuthManager } from "@/services/auth.ts";
import { useCurrentPhaseStore } from "@/stores/useCurrentPhaseStore.ts";
import { useCustomTextsStore } from "@/stores/useCustomTextsStore.ts";
import { useServicesStore } from "@/stores/useServicesStore.ts";
import { useYearsStore } from "@/stores/useYearsStore.ts";

import TheHeader from "@/components/TheHeader.vue";
import PageHome from "@/pages/PageHome.vue";

graphql(`
  query GetAppData($uid: String!) {
    currentPhase(id: 1) {
      value
    }
    years(orderBy: [VALUE_DESC]) {
      value
      current
      visible
    }
    appSettings(orderBy: [KEY_ASC]) {
      key
      value
    }
    services(condition: { uid: $uid }) {
      id
      year: yearValue
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
    if (data?.currentPhase?.value) {
      setCurrentPhase(data.currentPhase.value);
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
    if (data?.appSettings) {
      setCustomTexts(data.appSettings);
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

    if (authManager.allowedRoles.includes(RoleType.Admin)) {
      authManager.setActiveRole(RoleType.Admin);
    } else if (
      authManager.allowedRoles.includes(RoleType.Commissioner) &&
      phase === Phase.Assignments
    ) {
      authManager.setActiveRole(RoleType.Commissioner);
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
    currentPhase.value === Phase.Shutdown &&
    authManager.activeRole.value !== RoleType.Admin
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
