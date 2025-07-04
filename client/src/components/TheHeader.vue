<script setup lang="ts">
import { useRouter } from "vue-router";

import { useDarkMode } from "@/composables/useDarkMode.ts";
import { usePermissions } from "@/composables/usePermissions.ts";
import { useRefreshData } from "@/composables/useRefreshData.ts";
import { useTypedI18n } from "@/composables/useTypedI18n.ts";
import { version } from "@/config/environment.ts";
import { useOrganizationStore } from "@/stores/useOrganizationStore.ts";
import { useProfileStore } from "@/stores/useProfileStore.ts";
import { bgColor } from "@/utils";

import MenuInfo from "@/components/header/MenuInfo.vue";
import MenuLang from "@/components/header/MenuLang.vue";
import MenuUser from "@/components/header/MenuUser.vue";
import MenuYear from "@/components/header/MenuYear.vue";
import NavBtn from "@/components/header/NavBtn.vue";
import ToolbarCourses from "@/components/header/ToolbarCourses.vue";

defineProps<{ disable: boolean; warning?: string }>();

const { t } = useTypedI18n();
const router = useRouter();
const { isRefreshing, refreshData } = useRefreshData();
const { isDarkModeActive, toggleDarkMode } = useDarkMode();
const { organization } = useOrganizationStore();
const { hasService } = useProfileStore();
const perm = usePermissions();
</script>

<template>
  <QHeader>
    <QToolbar id="main-toolbar" :class="bgColor">
      <QToolbarTitle shrink class="title">
        <QAvatar icon="sym_s_spa" square size="xl" />
        Geyser
        <QBadge v-if="version" outline align="middle">
          {{ version }}
        </QBadge>
      </QToolbarTitle>
      <div class="organization-info">
        <QSeparator vertical />
        <div class="organization-text">
          <div class="label">
            {{ organization.label }}
          </div>
          <div v-if="organization.sublabel" class="sublabel">
            {{ organization.sublabel }}
          </div>
        </div>
      </div>
      <QSpace />
      <NavBtn
        name="home"
        icon="sym_s_home"
        :disable
        :tooltip="t('header.home.label')"
      />
      <QSeparator vertical inset />
      <NavBtn
        name="service"
        icon="sym_s_id_card"
        :disable="disable || !hasService"
        :tooltip="t('header.service.label')"
      />
      <QSeparator vertical inset />
      <NavBtn
        name="courses"
        icon="sym_s_menu_book"
        :disable
        :tooltip="t('header.courses.label')"
      />
      <ToolbarCourses
        v-if="!disable && router.currentRoute.value.name === 'courses'"
      />
      <QSeparator vertical inset />
      <NavBtn
        v-if="perm.toAdmin"
        name="admin"
        icon="sym_s_settings"
        :disable
        :tooltip="t('header.admin.label')"
      />
      <QSeparator v-if="perm.toAdmin" vertical inset />
      <QBtn
        icon="sym_s_refresh"
        :disable
        :loading="isRefreshing"
        flat
        square
        @click="refreshData()"
      >
        <QTooltip>
          {{ t("header.refreshData.label") }}
        </QTooltip>
      </QBtn>
      <MenuYear />
      <QBtn
        :icon="isDarkModeActive ? 'sym_s_dark_mode' : 'sym_s_light_mode'"
        flat
        square
        @click="toggleDarkMode()"
      >
        <QTooltip>
          {{ t("header.darkMode.label") }}
        </QTooltip>
      </QBtn>
      <MenuLang />
      <MenuInfo />
      <MenuUser />
    </QToolbar>

    <QToolbar v-if="!disable && warning" id="warning-toolbar">
      <QSpace />
      <QToolbarTitle shrink class="text-center text-body1">
        {{ warning }}
      </QToolbarTitle>
      <QSpace />
    </QToolbar>
  </QHeader>
</template>

<style scoped lang="scss">
#main-toolbar {
  min-height: $main-toolbar-height;
  height: $main-toolbar-height;
  overflow-x: auto;
}

#warning-toolbar {
  min-height: $warning-toolbar-height;
  height: $warning-toolbar-height;
  background-color: $warning;
  color: black;
}

.title {
  flex-shrink: 0;
}

.organization-info {
  display: flex;
  align-items: center;
  margin: 0 12px;

  .q-separator {
    margin: 0;
  }

  .organization-text {
    margin-left: 12px;
    line-height: 1.2;
    white-space: nowrap;

    .label {
      font-size: 0.875rem;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.9);
    }

    .sublabel {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.7);
      margin-top: 1px;
    }
  }
}
</style>
