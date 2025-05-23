import { RoleTypeEnum } from "@/gql/graphql.ts";
import type { AdminColNameOptions } from "@/locales/types.ts";

import type { ColName as AdminRolesRolesColName } from "@/components/admin/AdminGeneralRoles.vue";

export default {
  general: {
    title: "General Settings",
    phase: {
      label: "Current phase",
      error: {
        setCurrent: "Failed to update current phase",
      },
      success: {
        setCurrent: "Current phase updated",
      },
    },
    years: {
      label: "Years",
      year: "Year",
      visible: "Visible",
      current: "Current",
      button: {
        create: "Create",
        update: "Update",
        createServices: "Create services for active teachers",
        copyCourses: "Copy courses from previous year",
        computePriorities: "Compute priorities",
      },
      confirm: {
        delete: `Are you sure you want to delete the year {year}?
If courses or services are associated with this year, you will not be able to delete it.`,
      },
      error: {
        setCurrent: "Failed to update current year",
        createServices: "Failed to create services",
        copyCourses: "Failed to copy courses",
        computePriorities: "Failed to compute priorities",
        emptyValue: "Enter a value for the year",
      },
      success: {
        setCurrent: "Current year updated",
        insert: "Year created",
        update: "Year updated",
        delete: "Year deleted",
        createServices:
          "0 service created | 1 service created | {count} services created",
        copyCourses:
          "0 course copied | 1 course copied | {count} courses copied",
        computePriorities:
          "0 priority computed | 1 priority computed | {count} priorities computed",
      },
    },
    roles: {
      label: "Roles",
      column: {
        uid: {
          label: "Teacher",
          tooltip: "",
        },
        type: {
          label: "Type",
          tooltip: "",
        },
        comment: {
          label: "Comment",
          tooltip: "",
        },
      } satisfies Record<AdminRolesRolesColName, AdminColNameOptions>,
      form: {
        title: {
          none: "New role",
          single: "{label}",
          multiple: "{count} roles selected",
        },
        error: {
          invalidRole: `Role type must be ${RoleTypeEnum.Admin} or ${RoleTypeEnum.Commissioner}`,
        },
      },
      data: {
        success: {
          insert: "No role created | Role created | {count} roles created",
          update: "No role updated | Role updated | {count} roles updated",
          delete: "No role deleted | Role deleted | {count} roles deleted",
          import: "0 role imported | 1 role imported | {count} roles imported",
          export: "0 role exported | 1 role exported | {count} roles exported",
        },
        confirm: {
          delete: {
            single: `Are you sure you want to delete the role "{label}"?`,
            multiple: `Are you sure you want to delete the {count} selected roles?`,
          },
        },
      },
    },
    customTexts: {
      label: "Interface customization",
      button: {
        edit: "Edit",
        delete: "Delete",
      },
      confirm: {
        delete: `Are you sure you want to reset "{label}" to its default value?`,
      },
    },
  },
} as const;
