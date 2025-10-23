'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslation } from '@/i18n/client';
import { VaccinationListModel } from '@/types/pet';
import { format } from 'date-fns';
import * as locales from 'date-fns/locale';

const DateCell = ({ date }: { date: Date }) => {
  const { i18n } = useTranslation();
  return format(date, 'PPP', {
    locale: locales[(i18n.resolvedLanguage || 'en') as keyof typeof locales]
  });
};

export const columns: ColumnDef<VaccinationListModel>[] = [
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
    accessorFn: (vaccine) => vaccine.vaccine,
    header: 'vaccine_label'
  },
  {
    cell: ({ row }) => <DateCell date={row.original.date} />,
    header: 'date_label'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
