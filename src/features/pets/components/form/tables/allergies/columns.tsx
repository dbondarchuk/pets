'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslation } from '@/i18n/client';
import { AllergyEntryListModel, AllergySeverity } from '@/types/pet';

const SeverityCell = ({ severity }: { severity: AllergySeverity }) => {
  const { t } = useTranslation();
  return t(`allergies_severity_${severity}_label`);
};

export const columns: ColumnDef<AllergyEntryListModel>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'name',
    accessorFn: (allergy) => allergy.allergy,
    header: 'allergy_label'
  },
  {
    cell: ({ row }) => <SeverityCell severity={row.original.severity} />,
    header: 'allergies_severity_label'
  },
  {
    accessorFn: (allergy) => allergy.reaction,
    header: 'allergies_reaction_label'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
