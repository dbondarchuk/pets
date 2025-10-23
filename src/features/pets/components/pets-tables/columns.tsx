'use client';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { format } from 'date-fns';
import * as locales from 'date-fns/locale';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslation } from '@/i18n/client';
import { PetListModel } from '@/types/pet';
import { Link } from '@/components/ui/link';

export const DateOfBirthCell = ({ pet: record }: { pet: PetListModel }) => {
  const { i18n } = useTranslation();
  return format(record.dateOfBirth, 'PP', {
    locale: locales[(i18n.resolvedLanguage || 'en') as keyof typeof locales]
  });
};

const TypeCell = ({ pet }: { pet: PetListModel }) => {
  const { t } = useTranslation();
  return t(`type_${pet.type}_label`);
};

const NameCell = ({ pet }: { pet: PetListModel }) => {
  return (
    <Link href={`/dashboard/pets/${pet.id}`} variant='underline'>
      {pet.name}
    </Link>
  );
};

export const columns: ColumnDef<PetListModel>[] = [
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
    cell: ({ row }) => <NameCell pet={row.original} />,
    header: 'name_label'
  },
  {
    cell: ({ row }) => <TypeCell pet={row.original} />,
    header: 'type_label'
  },
  {
    accessorFn: (pet) => pet.breed,
    header: 'breed_label'
  },
  {
    id: 'date_of_birth',
    cell: ({ row }) => <DateOfBirthCell pet={row.original} />,
    header: 'date_of_birth_label'
  },
  {
    accessorFn: (pet) => pet.ownerName,
    header: 'owner_label'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
