import { apiData } from '../../api/apiData';
import { httpClient } from '../../api/httpClient';
import type { CreateProjectPayload, ProjectSummary } from './projectsTypes';

const useMockApi = import.meta.env.VITE_USE_MOCK_API !== 'false';

let mockProjects: ProjectSummary[] = [
  {
    id: 'project-1',
    name: 'Customer Portal',
    owner: 'Aroha Smith',
    status: 'active',
    updatedAt: '2026-06-02T08:20:00.000Z',
  },
  {
    id: 'project-2',
    name: 'Billing API Migration',
    owner: 'James Wilson',
    status: 'planning',
    updatedAt: '2026-06-01T21:10:00.000Z',
  },
];

export async function listProjects() {
  if (useMockApi) {
    return mockDelay([...mockProjects]);
  }

  return apiData<ProjectSummary[]>(httpClient.get('/projects'), {
    defaultErrorMessage: 'Failed to load projects',
  });
}

export async function createProject(payload: CreateProjectPayload) {
  if (useMockApi) {
    const project: ProjectSummary = {
      id: crypto.randomUUID(),
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    mockProjects = [project, ...mockProjects];
    return mockDelay(project);
  }

  return apiData<ProjectSummary>(httpClient.post('/projects', payload), {
    defaultErrorMessage: 'Failed to create project',
  });
}

function mockDelay<T>(value: T) {
  return new Promise<T>((resolve) => {
    window.setTimeout(() => resolve(value), 350);
  });
}
