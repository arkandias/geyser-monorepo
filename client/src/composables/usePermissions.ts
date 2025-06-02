import { computed, inject, readonly } from "vue";

import { Phase, RoleType } from "@/gql/graphql.ts";
import type { AuthManager } from "@/services/auth.ts";
import { useCurrentPhaseStore } from "@/stores/useCurrentPhaseStore.ts";
import { useServicesStore } from "@/stores/useServicesStore.ts";
import { useYearsStore } from "@/stores/useYearsStore.ts";

export const usePermissions = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { uid, activeRole } = inject<AuthManager>("authManager")!;
  const { isCurrentYearActive } = useYearsStore();
  const { currentPhase } = useCurrentPhaseStore();
  const { hasService } = useServicesStore();

  const toAdmin = computed(() => activeRole.value === RoleType.Admin);

  const toSubmitRequestsForSelf = computed(
    () =>
      activeRole.value === RoleType.Admin ||
      (activeRole.value === RoleType.Teacher &&
        currentPhase.value === Phase.Requests &&
        isCurrentYearActive.value &&
        hasService.value),
  );

  const toSubmitRequestsForOthers = computed(
    () => activeRole.value === RoleType.Admin,
  );

  const toSubmitRequests = computed(
    () => toSubmitRequestsForSelf.value || toSubmitRequestsForOthers.value,
  );

  const toDeleteRequests = computed(() => activeRole.value === RoleType.Admin);

  const toViewAssignments = computed(
    () =>
      toEditAssignments.value ||
      currentPhase.value === Phase.Results ||
      !isCurrentYearActive.value,
  );

  const toEditAssignments = computed(
    () =>
      activeRole.value === RoleType.Admin ||
      (activeRole.value === RoleType.Commissioner &&
        currentPhase.value === Phase.Assignments &&
        isCurrentYearActive.value),
  );

  const toEditPriorities = computed(() => activeRole.value === RoleType.Admin);

  const toEditADescription = computed(
    () => (coordinators: string[]) =>
      activeRole.value === RoleType.Admin ||
      (isCurrentYearActive.value && coordinators.includes(uid)),
  );

  const toViewAllServices = computed(
    () =>
      activeRole.value === RoleType.Admin ||
      (activeRole.value === RoleType.Commissioner &&
        currentPhase.value === Phase.Assignments),
  );

  const toEditAService = computed(
    () => (service: { uid: string }) =>
      activeRole.value === RoleType.Admin ||
      (activeRole.value === RoleType.Teacher &&
        currentPhase.value === Phase.Requests &&
        isCurrentYearActive.value &&
        service.uid === uid),
  );

  const toEditAMessage = computed(
    () => (message: { uid: string }) =>
      activeRole.value === RoleType.Admin ||
      (activeRole.value === RoleType.Teacher &&
        currentPhase.value === Phase.Requests &&
        isCurrentYearActive.value &&
        message.uid === uid),
  );

  return readonly({
    toAdmin,
    toSubmitRequestsForSelf,
    toSubmitRequestsForOthers,
    toSubmitRequests,
    toDeleteRequests,
    toViewAssignments,
    toEditAssignments,
    toEditPriorities,
    toEditADescription,
    toViewAllServices,
    toEditAService,
    toEditAMessage,
  });
};
