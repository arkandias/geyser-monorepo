<script setup lang="ts">
import { useLocale } from "@/composables/useLocale.ts";
import { useTypedI18n } from "@/composables/useTypedI18n.ts";
import { LocaleEnum } from "@/gql/graphql.ts";
import type { Option } from "@/types/data.ts";

import MenuBase from "@/components/header/MenuBase.vue";

const { t, locale } = useTypedI18n();
const { setLocale } = useLocale();

const localeLabels: Record<LocaleEnum, string> = {
  [LocaleEnum.Fr]: "Français",
  [LocaleEnum.En]: "English",
} as const;

const localeOptions: Option<LocaleEnum>[] = Object.values(LocaleEnum).map(
  (l) => ({
    value: l,
    label: localeLabels[l],
  }),
);
</script>

<template>
  <MenuBase :label="t('header.lang.label')" icon="sym_s_language">
    <QList>
      <QItem class="flex-center text-no-wrap">
        <QItemLabel header>
          {{ t("header.lang.label") }}
        </QItemLabel>
      </QItem>
      <QSeparator />
      <QItem class="q-pl-sm">
        <QOptionGroup
          v-model="locale"
          :options="localeOptions"
          type="radio"
          @update:model-value="setLocale"
        />
      </QItem>
    </QList>
  </MenuBase>
</template>

<style scoped lang="scss"></style>
