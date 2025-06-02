import { useMutation } from "@urql/vue";
import { inject, ref } from "vue";

import { graphql } from "@/gql";
import { DummyMutationDocument } from "@/gql/graphql.ts";
import type { AuthManager } from "@/services/auth.ts";

graphql(`
  mutation DummyMutation($uid: String!) {
    updateTeacher(input: { uid: $uid, patch: {} }) {
      clientMutationId
    }
  }
`);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const authManager = inject<AuthManager>("authManager")!;

export const useRefreshData = () => {
  const dummyMutation = useMutation(DummyMutationDocument);
  const isRefreshing = ref(false);

  const refreshData = async (): Promise<void> => {
    isRefreshing.value = true;
    await dummyMutation.executeMutation(
      { uid: authManager.uid },
      { additionalTypenames: ["All"] },
    );
    isRefreshing.value = false;
  };

  return { isRefreshing, refreshData };
};
