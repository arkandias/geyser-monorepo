<script setup lang="ts">
import { usePermissions } from "@/composables/usePermissions.ts";
import { useQueryParam } from "@/composables/useQueryParam.ts";
import { useTypedI18n } from "@/composables/useTypedI18n.ts";
import { useLeftPanelStore } from "@/stores/useLeftPanelStore.ts";
import { useProfileStore } from "@/stores/useProfileStore.ts";
import { buttonColor } from "@/utils";

const { t } = useTypedI18n();
const { getValue: selectedService, toggleValue: toggleService } = useQueryParam(
  "serviceId",
  true,
);
const { isLeftPanelOpen, toggleLeftPanel } = useLeftPanelStore();
const { hasService, currentServiceId } = useProfileStore();
const perm = usePermissions();
</script>

<template>
  <QIcon name="sym_s_chevron_right" />
  <QBtn
    icon="sym_s_vertical_split"
    :color="buttonColor(isLeftPanelOpen)"
    :disable="!perm.toViewAllServices"
    flat
    square
    @click="toggleLeftPanel()"
  >
    <QTooltip>
      {{ t("header.courses.servicesTable") }}
    </QTooltip>
  </QBtn>
  <QBtn
    icon="sym_s_assignment"
    :color="buttonColor(hasService && selectedService === currentServiceId)"
    :disable="!hasService"
    flat
    square
    @click="toggleService(currentServiceId)"
  >
    <QTooltip>
      {{ t("header.courses.myService") }}
    </QTooltip>
  </QBtn>
</template>

<style scoped lang="scss"></style>
