export type ProjectStatus = 'planning' | 'active' | 'paused';

export type ProjectSummary = {
  id: string;
  name: string;
  owner: string;
  status: ProjectStatus;
  updatedAt: string;
};

export type CreateProjectFormValues = {
  name: string;
  owner: string;
  status: ProjectStatus;
};

export type CreateProjectPayload = CreateProjectFormValues;
