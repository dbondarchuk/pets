'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/i18n/client';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { VaccinationListModel } from '@/types/pet';
import { AddUpdateVaccinationDialog } from './add-update-dialog';

interface CellActionProps {
  data: VaccinationListModel;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);

  const router = useRouter();

  const { t } = useTranslation();

  const onDeleteConfirm = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/pets/${data.petId}/vaccination/${data.id}`,
        {
          method: 'DELETE'
        }
      );

      if (response.status >= 400) {
        throw new Error(response.status.toString());
      }

      toast.success(t('delete_vaccination_toast_success_message'));

      setDeleteOpen(false);
      router.refresh();
    } catch (error: any) {
      toast.error(t('error_toast_message'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AddUpdateVaccinationDialog
        petId={data.petId}
        vaccinationId={data.id}
        isOpen={updateOpen}
        onOpenChange={setUpdateOpen}
      />
      <AlertModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={onDeleteConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>{t('actions_label')}</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => setUpdateOpen(true)}>
            <Edit className='mr-2 h-4 w-4' /> {t('update_label')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
            <Trash className='mr-2 h-4 w-4' /> {t('delete_label')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
