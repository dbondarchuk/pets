'use client';
import { useTranslation } from '@/i18n/client';
import { Button } from '../button';

type DataTableResetFilterProps = {
  isFilterActive: boolean;
  onReset: () => void;
};

export function DataTableResetFilter({
  isFilterActive,
  onReset
}: DataTableResetFilterProps) {
  const { t } = useTranslation();
  return (
    <>
      {isFilterActive ? (
        <Button variant='outline' onClick={onReset}>
          {t('reset_filters_label')}
        </Button>
      ) : null}
    </>
  );
}
