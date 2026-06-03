import { Button, Group, Modal, Select, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useCreateProjectMutation } from '../../shared/features/projects/projectsQueries';
import type {
  CreateProjectFormValues,
  ProjectStatus,
} from '../../shared/features/projects/projectsTypes';
import { showError, showSuccess } from '../../shared/notifications/appNotifications';

type DesktopProjectCreateModalProps = {
  opened: boolean;
  onClose: () => void;
};

const projectStatusOptions: { value: ProjectStatus; label: string }[] = [
  { value: 'planning', label: 'Planning' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
];

export function DesktopProjectCreateModal({ opened, onClose }: DesktopProjectCreateModalProps) {
  const createProjectMutation = useCreateProjectMutation();
  const form = useForm<CreateProjectFormValues>({
    initialValues: {
      name: '',
      owner: '',
      status: 'planning',
    },
    validate: {
      name: (value) => (value.trim() ? null : 'Project name is required'),
      owner: (value) => (value.trim() ? null : 'Owner is required'),
    },
  });

  async function handleSubmit(values: CreateProjectFormValues) {
    try {
      await createProjectMutation.mutateAsync({
        name: values.name.trim(),
        owner: values.owner.trim(),
        status: values.status,
      });

      showSuccess('Project created');
      form.reset();
      onClose();
    } catch (error) {
      showError(error, 'Failed to create project');
    }
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Create project">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Project name"
            placeholder="Customer Portal"
            withAsterisk
            {...form.getInputProps('name')}
          />

          <TextInput
            label="Owner"
            placeholder="Aroha Smith"
            withAsterisk
            {...form.getInputProps('owner')}
          />

          <Select
            label="Status"
            data={projectStatusOptions}
            allowDeselect={false}
            {...form.getInputProps('status')}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={createProjectMutation.isPending}>
              Create
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
