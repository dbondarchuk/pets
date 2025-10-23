'use client';

import * as React from 'react';
import { format } from 'date-fns';
import * as locales from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { useTranslation } from '@/i18n/client';

export const DatePicker: React.FC<{
  className?: string;
  disabled?: boolean;
  value?: Date;
  onChange: (value?: Date) => void;
}> = ({ value: date, onChange, className, disabled }) => {
  const { t, i18n } = useTranslation();
  const locale =
    locales[(i18n.resolvedLanguage || 'en') as keyof typeof locales];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {date ? (
            format(date, 'PPP', { locale })
          ) : (
            <span>{t('pick_date_label')}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          locale={locale}
          mode='single'
          selected={date}
          onSelect={onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
