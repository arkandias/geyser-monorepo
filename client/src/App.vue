<script setup lang="ts">
import { useQuery } from "@urql/vue";
import { computed, watch } from "vue";

import { NotifyType, useNotify } from "@/composables/useNotify.ts";
import { useTypedI18n } from "@/composables/useTypedI18n.ts";
import { graphql } from "@/gql";
import { GetAppDataDocument, PhaseEnum, RoleEnum } from "@/gql/graphql.ts";
import type { AuthManager } from "@/services/auth.ts";
import { useCurrentPhaseStore } from "@/stores/useCurrentPhaseStore.ts";
import { useCustomTextsStore } from "@/stores/useCustomTextsStore.ts";
import { useOrganizationStore } from "@/stores/useOrganizationStore.ts";
import { useProfileStore } from "@/stores/useProfileStore.ts";
import { useYearsStore } from "@/stores/useYearsStore.ts";

import TheHeader from "@/components/TheHeader.vue";
import PageHome from "@/pages/PageHome.vue";

const { authManager } = defineProps<{ authManager: AuthManager }>();

const { t } = useTypedI18n();
const { notify } = useNotify();
const { setOrganization } = useOrganizationStore();
const { profile, setProfile } = useProfileStore();
const { currentPhase, setCurrentPhase } = useCurrentPhaseStore();
const { activeYear, isCurrentYearActive, setYears } = useYearsStore();
const { setCustomTexts } = useCustomTextsStore();

if (authManager.authError) {
  notify(NotifyType.Error, {
    message: t("app.auth.error"),
    caption: authManager.authError,
  });
}

// Sync profile's activeRole with authManager role
watch(
  () => profile.activeRole,
  (role) => {
    authManager.setRole(role);
  },
);

graphql(`
  query GetAppData($orgId: Int!, $userId: Int!) {
    organization: organizationByPk(id: $orgId) {
      label
      sublabel
      email
      locale
      currentPhases {
        value
      }
      years(orderBy: { value: DESC }) {
        value
        current
        visible
      }
      customTexts: appSettings(orderBy: [{ key: ASC }]) {
        key
        value
      }
    }
    profile: teacherByPk(oid: $orgId, id: $userId) {
      displayname
      services {
        id
        year
      }
    }
  }
`);

// Fetch app data
const getAppData = useQuery({
  query: GetAppDataDocument,
  variables: {
    orgId: authManager.orgId,
    userId: authManager.userId,
  },
  pause: () => !authManager.hasAccess,
  context: {
    additionalTypenames: [
      "All",
      "AppSetting",
      "CurrentPhase",
      "Service",
      "Year",
    ],
  },
});

// Sync the stores on data update
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

    if (data?.organization) {
      setOrganization({
        id: authManager.orgId,
        label: data.organization.label,
        sublabel: data.organization.sublabel ?? null,
        email: data.organization.email,
        locale: data.organization.locale,
      });
      setCurrentPhase(
        data.organization.currentPhases[0]?.value ?? PhaseEnum.Shutdown,
      );
      setYears(data.organization.years);
      setCustomTexts(data.organization.customTexts);
    }

    setProfile({
      id: authManager.userId,
      roles: authManager.allowedRoles,
      activeRole: authManager.role,
      displayname: data?.profile?.displayname ?? "",
      services: data?.profile?.services ?? [],
      logout: () => authManager.logout(),
    });
  },
  { immediate: true },
);

// Access check and alert message
const alertMessage = computed(() => {
  if (!authManager.organizationKey) {
    return t("home.alert.organizationNotFound");
  }
  if (!authManager.hasAccess) {
    return t("home.alert.noAccess");
  }
  if (getAppData.fetching.value) {
    return t("home.alert.appDataFetching");
  }
  if (getAppData.error.value) {
    return t("home.alert.appDataError");
  }
  if (!getAppData.data.value?.organization) {
    return t("home.alert.organizationNotLoaded");
  }
  if (
    currentPhase.value === PhaseEnum.Shutdown &&
    profile.activeRole !== RoleEnum.Organizer
  ) {
    return t("home.alert.shutdown");
  }
  if (
    profile.activeRole === RoleEnum.Commissioner &&
    currentPhase.value !== PhaseEnum.Assignments
  ) {
    return t("home.alert.commissioner");
  }
  if (!getAppData.data.value.profile) {
    return t("home.alert.profileNotLoaded");
  }
  return "";
});

const warningMessage = computed(() =>
  activeYear.value === null
    ? t("header.warning.noActiveYear")
    : !isCurrentYearActive.value
      ? t("header.warning.archive", { year: activeYear.value })
      : "",
);
</script>

<template>
  <QLayout view="hHh LpR fFf" class="text-body-1">
    <TheHeader :disable="!!alertMessage" :warning="warningMessage" />
    <QPageContainer>
      <PageHome v-if="alertMessage" :alert="alertMessage" />
      <RouterView v-else />
    </QPageContainer>
  </QLayout>
</template>

<style scoped lang="scss"></style>
