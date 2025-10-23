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
import { PetListModel } from '@/types/pet';

interface CellActionProps {
  data: PetListModel;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const router = useRouter();

  const { t } = useTranslation();

  const onDeleteConfirm = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/pets/${data.id}`, {
        method: 'DELETE'
      });

      if (response.status >= 400) {
        throw new Error(response.status.toString());
      }

      toast.success(t('delete_pet_toast_success_message'));

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

          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/pets/${data.id}`)}
          >
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
