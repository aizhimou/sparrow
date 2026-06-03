import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createProject, listProjects } from './projectsApi';

export const projectsQueryKeys = {
  list: () => ['projects', 'list'] as const,
};

export function useProjectsQuery() {
  return useQuery({
    queryKey: projectsQueryKeys.list(),
    queryFn: listProjects,
  });
}

export function useCreateProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: projectsQueryKeys.list(),
      });
    },
  });
}
