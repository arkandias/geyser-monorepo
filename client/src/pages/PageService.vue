<script setup lang="ts">
import { useQuery } from "@urql/vue";
import { computed } from "vue";

import { usePermissions } from "@/composables/usePermissions.ts";
import { useQueryParam } from "@/composables/useQueryParam.ts";
import { useTypedI18n } from "@/composables/useTypedI18n.ts";
import { graphql } from "@/gql";
import { GetServiceDetailsDocument } from "@/gql/graphql.ts";
import { useOrganizationStore } from "@/stores/useOrganizationStore.ts";
import { useProfileStore } from "@/stores/useProfileStore.ts";

import ServiceDetails from "@/components/service/ServiceDetails.vue";
import ServiceMessage from "@/components/service/ServiceMessage.vue";
import ServicePriorities from "@/components/service/ServicePriorities.vue";
import ServiceRequests from "@/components/service/ServiceRequests.vue";
import ServiceTeacher from "@/components/service/ServiceTeacher.vue";

graphql(`
  query GetServiceDetails($oid: Int!, $id: Int!) {
    service: serviceByPk(oid: $oid, id: $id) {
      teacherId
      teacher {
        ...ServiceTeacher
      }
      ...ServiceDetails
      ...ServiceRequests
      ...ServicePriorities
      ...ServiceMessage
    }
  }
`);

const { t } = useTypedI18n();
const { getValue: selectedService } = useQueryParam("serviceId", true);
const { organization } = useOrganizationStore();
const { currentServiceId: myServiceId } = useProfileStore();
const perm = usePermissions();

const serviceId = computed(() => selectedService.value ?? myServiceId.value);

const getServiceDetails = useQuery({
  query: GetServiceDetailsDocument,
  variables: () => ({
    oid: organization.id,
    id: serviceId.value ?? -1,
  }),
  pause: () => serviceId.value === null,
  context: {
    additionalTypenames: [
      "All",
      "Coordination",
      "ExternalCourse",
      "Message",
      "Priority",
      "Request",
      "Service",
      "ServiceModification",
    ],
  },
});
const fetching = computed(() => getServiceDetails.fetching.value);
const service = computed(() =>
  serviceId.value ? (getServiceDetails.data.value?.service ?? null) : null,
);
</script>

<template>
  <QPage id="service-page" class="column items-center">
    <QCard v-if="fetching" flat square>
      <QCardSection class="text-h4 q-pa-xl">
        {{ t("service.fetching") }}
      </QCardSection>
    </QCard>
    <QCard v-else-if="service" flat square>
      <ServiceTeacher :data-fragment="service.teacher" />
      <ServiceDetails :data-fragment="service" />
      <ServiceRequests :data-fragment="service" />
      <ServicePriorities :data-fragment="service" />
      <ServiceMessage
        v-if="perm.toViewAMessage(service)"
        :data-fragment="service"
      />
    </QCard>
    <QCard v-else flat square>
      <QCardSection class="text-h4 q-pa-xl">
        {{ t("service.notFound") }}
      </QCardSection>
    </QCard>
  </QPage>
</template>

<style scoped lang="scss">
.q-card {
  width: $page-service-width;
}
:deep(.q-card__section) {
  text-align: center;
}
</style>
