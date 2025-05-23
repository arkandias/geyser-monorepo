<script lang="ts">
export type ColName = "label" | "description" | "baseServiceHours";
</script>

<script setup lang="ts">
import { useMutation } from "@urql/vue";
import { computed } from "vue";

import { useTypedI18n } from "@/composables/useTypedI18n.ts";
import { type FragmentType, graphql, useFragment } from "@/gql";
import {
  type AdminPositionFragment,
  AdminPositionFragmentDoc,
  DeletePositionsDocument,
  InsertPositionsDocument,
  PositionConstraint,
  type PositionInsertInput,
  PositionUpdateColumn,
  UpdatePositionsDocument,
  UpsertPositionsDocument,
} from "@/gql/graphql.ts";
import type { NullableParsedRow, RowDescriptorExtra } from "@/types/data.ts";

import AdminData from "@/components/admin/core/AdminData.vue";

type Row = AdminPositionFragment;
type FlatRow = NullableParsedRow<typeof rowDescriptor>;
type InsertInput = PositionInsertInput;

const { positionFragments } = defineProps<{
  positionFragments: FragmentType<typeof AdminPositionFragmentDoc>[];
}>();

const { t } = useTypedI18n();

const idKey: keyof Row = "id";
const rowDescriptor = {
  label: {
    type: "string",
    formType: "input",
  },
  description: {
    type: "string",
    nullable: true,
    formType: "input",
  },
  baseServiceHours: {
    type: "number",
    nullable: true,
    formType: "inputNum",
  },
} as const satisfies RowDescriptorExtra<ColName, Row>;

graphql(`
  fragment AdminPosition on Position {
    id
    label
    description
    baseServiceHours
  }

  mutation InsertPositions($objects: [PositionInsertInput!]!) {
    insertData: insertPosition(objects: $objects) {
      returning {
        id
      }
    }
  }

  mutation UpsertPositions(
    $objects: [PositionInsertInput!]!
    $onConflict: PositionOnConflict!
  ) {
    upsertData: insertPosition(objects: $objects, onConflict: $onConflict) {
      returning {
        id
      }
    }
  }

  mutation UpdatePositions($ids: [Int!]!, $changes: PositionSetInput!) {
    updateData: updatePosition(where: { id: { _in: $ids } }, _set: $changes) {
      returning {
        id
      }
    }
  }

  mutation DeletePositions($ids: [Int!]!) {
    deleteData: deletePosition(where: { id: { _in: $ids } }) {
      returning {
        id
      }
    }
  }
`);

const positions = computed(() =>
  positionFragments.map((f) => useFragment(AdminPositionFragmentDoc, f)),
);
const insertPositions = useMutation(InsertPositionsDocument);
const upsertPositions = useMutation(UpsertPositionsDocument);
const updatePositions = useMutation(UpdatePositionsDocument);
const deletePositions = useMutation(DeletePositionsDocument);

const importConstraint = PositionConstraint.PositionLabelKey;
const importUpdateColumns = [
  PositionUpdateColumn.Label,
  PositionUpdateColumn.Description,
  PositionUpdateColumn.BaseServiceHours,
];

const formatRow = (row: Row) => row.label;

const validateFlatRow = (flatRow: FlatRow): InsertInput => {
  const object: InsertInput = {};

  if (flatRow.label !== undefined) {
    object.label = flatRow.label;
  }

  if (flatRow.description !== undefined) {
    object.description = flatRow.description;
  }

  if (flatRow.baseServiceHours !== undefined) {
    if (flatRow.baseServiceHours !== null && flatRow.baseServiceHours < 0) {
      throw new Error(
        t("admin.teachers.positions.form.error.baseServiceHoursNegative"),
      );
    }
    object.baseServiceHours = flatRow.baseServiceHours;
  }

  return object;
};
</script>

<template>
  <AdminData
    section="teachers"
    name="positions"
    :id-key
    :row-descriptor
    :rows="positions"
    :format-row
    :validate-flat-row
    :insert-data="insertPositions"
    :upsert-data="upsertPositions"
    :update-data="updatePositions"
    :delete-data="deletePositions"
    :import-constraint
    :import-update-columns
  />
</template>

<style scoped lang="scss"></style>
