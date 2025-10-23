'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { AddUpdateVaccinationDialog } from './add-update-dialog';
import { useTranslation } from '@/i18n/client';

export const AddVaccinationButton: React.FC<{
  petId: string;
}> = ({ petId }) => {
  const { t } = useTranslation();
  const [updateOpen, setUpdateOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setUpdateOpen(true)}>
        <Plus className='mr-2 h-4 w-4' />
        {t('add_new_label')}
      </Button>
      <AddUpdateVaccinationDialog
        petId={petId}
        vaccinationId={undefined}
        isOpen={updateOpen}
        onOpenChange={setUpdateOpen}
      />
    </>
  );
};
