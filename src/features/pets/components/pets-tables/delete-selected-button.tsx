'use client';

import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/client';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';
import { PetListModel } from '@/types/pet';
import { BulkDeleteRequestSchema } from '@/types/requests';

export const DeleteSelectedRecordsButton: React.FC<{
  selected: PetListModel[];
}> = ({ selected }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const { t } = useTranslation();

  const router = useRouter();
  const action = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/pets/delete`, {
        method: 'POST',
        body: JSON.stringify({
          ids: selected.map((r) => r.id)
        } satisfies BulkDeleteRequestSchema)
      });

      if (response.status >= 400) {
        throw new Error(response.status.toString());
      }

      router.refresh();

      toast.success(
        t('delete_pets_toast_success_message', { count: selected.length })
      );

      setIsOpen(false);
    } catch (error: any) {
      toast.error(t('error_toast_message'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={action}
        loading={isLoading}
      />
      <Button
        variant='destructive'
        onClick={() => setIsOpen(true)}
        disabled={isLoading || !selected || !selected.length}
      >
        <Trash className='mr-2 h-4 w-4' />
        <span>
          {t('remove_selected_pets_button_label', {
            count: selected.length
          })}
        </span>
      </Button>
    </>
  );
};
