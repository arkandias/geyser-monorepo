<script setup lang="ts">
import { useMutation } from "@urql/vue";
import { computed, ref } from "vue";

import { type FragmentType, graphql, useFragment } from "@/gql";
import {
  type AdminServiceModificationTypeFragment,
  AdminServiceModificationTypeFragmentDoc,
  DeleteServiceModificationTypesDocument,
  InsertServiceModificationTypesDocument,
  ServiceModificationTypeConstraint,
  type ServiceModificationTypeInsertInput,
  ServiceModificationTypeUpdateColumn,
  UpdateServiceModificationTypesDocument,
  UpsertServiceModificationTypesDocument,
} from "@/gql/graphql.ts";
import { useOrganizationStore } from "@/stores/useOrganizationStore.ts";
import type {
  NullableParsedRow,
  RowDescriptorExtra,
  Scalar,
} from "@/types/data.ts";

import type { AdminTeachersServiceModificationTypesColName } from "@/components/admin/col-names.ts";
import AdminData from "@/components/admin/core/AdminData.vue";

type Row = AdminServiceModificationTypeFragment;
type FlatRow = NullableParsedRow<typeof rowDescriptor>;
type InsertInput = ServiceModificationTypeInsertInput;

const { serviceModificationTypeFragments } = defineProps<{
  fetching: boolean;
  serviceModificationTypeFragments: FragmentType<
    typeof AdminServiceModificationTypeFragmentDoc
  >[];
}>();

const { organization } = useOrganizationStore();

const rowDescriptor = {
  label: {
    type: "string",
    formComponent: "input",
  },
  description: {
    type: "string",
    nullable: true,
    formComponent: "input",
  },
} as const satisfies RowDescriptorExtra<
  AdminTeachersServiceModificationTypesColName,
  Row
>;

graphql(`
  fragment AdminServiceModificationType on ServiceModificationType {
    id
    label
    description
  }

  mutation InsertServiceModificationTypes(
    $objects: [ServiceModificationTypeInsertInput!]!
  ) {
    insertData: insertServiceModificationType(objects: $objects) {
      returning {
        oid
        id
      }
    }
  }

  mutation UpsertServiceModificationTypes(
    $objects: [ServiceModificationTypeInsertInput!]!
    $onConflict: ServiceModificationTypeOnConflict
  ) {
    upsertData: insertServiceModificationType(
      objects: $objects
      onConflict: $onConflict
    ) {
      returning {
        oid
        id
      }
    }
  }

  mutation UpdateServiceModificationTypes(
    $ids: [Int!]!
    $changes: ServiceModificationTypeSetInput!
  ) {
    updateData: updateServiceModificationType(
      where: { id: { _in: $ids } }
      _set: $changes
    ) {
      returning {
        oid
        id
      }
    }
  }

  mutation DeleteServiceModificationTypes($ids: [Int!]!) {
    deleteData: deleteServiceModificationType(where: { id: { _in: $ids } }) {
      returning {
        oid
        id
      }
    }
  }
`);

const serviceModificationTypes = computed(() =>
  serviceModificationTypeFragments.map((f) =>
    useFragment(AdminServiceModificationTypeFragmentDoc, f),
  ),
);
const insertServiceModificationTypes = useMutation(
  InsertServiceModificationTypesDocument,
);
const upsertServiceModificationTypes = useMutation(
  UpsertServiceModificationTypesDocument,
);
const updateServiceModificationTypes = useMutation(
  UpdateServiceModificationTypesDocument,
);
const deleteServiceModificationTypes = useMutation(
  DeleteServiceModificationTypesDocument,
);

const importConstraint =
  ServiceModificationTypeConstraint.ServiceModificationTypeOidLabelKey;
const importUpdateColumns = [
  ServiceModificationTypeUpdateColumn.Oid,
  ServiceModificationTypeUpdateColumn.Label,
  ServiceModificationTypeUpdateColumn.Description,
];

const validateFlatRow = (flatRow: FlatRow): InsertInput => {
  const object: InsertInput = {
    oid: organization.id,
  };

  if (flatRow.label !== undefined) {
    object.label = flatRow.label;
  }

  if (flatRow.description !== undefined) {
    object.description = flatRow.description;
  }

  return object;
};

const formValues = ref<Record<string, Scalar>>({});
const filterValues = ref<Record<string, Scalar[]>>({});
</script>

<template>
  <AdminData
    v-model:form-values="formValues"
    v-model:filter-values="filterValues"
    section="teachers"
    name="serviceModificationTypes"
    :row-descriptor
    :rows="serviceModificationTypes"
    :fetching
    :validate-flat-row
    :insert-data="insertServiceModificationTypes"
    :upsert-data="upsertServiceModificationTypes"
    :update-data="updateServiceModificationTypes"
    :delete-data="deleteServiceModificationTypes"
    :import-constraint
    :import-update-columns
  />
</template>

<style scoped lang="scss"></style>
