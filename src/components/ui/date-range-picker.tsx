'use client';
import { CalendarIcon } from '@radix-ui/react-icons';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Calendar, CalendarProps } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { endOfDay, format, startOfDay } from 'date-fns';
import { useTranslation } from '@/i18n/client';
import * as locales from 'date-fns/locale';

export type DateRange = {
  start?: Date;
  end?: Date;
};

export type RangeOption = {
  label: string;
  name: string;
  value: DateRange | undefined;
};

export type CalendarDateRangePickerProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onChange'
> &
  Omit<
    Extract<CalendarProps, { mode: 'range' }>,
    'mode' | 'defaultMonth' | 'selected' | 'onSelect' | 'numberOfMonths'
  > & {
    range?: DateRange;
    onChange?: (range?: DateRange) => void;
    rangeOptions?: RangeOption[];
  };

export const CalendarDateRangePicker: React.FC<
  CalendarDateRangePickerProps
> = ({ className, range, onChange, rangeOptions, ...rest }) => {
  const [date, setDate] = React.useState<DateRange | undefined>(range);
  React.useEffect(() => {
    setDate(range);
  }, [range]);

  const { t, i18n } = useTranslation();
  const locale =
    locales[(i18n.resolvedLanguage || 'en') as keyof typeof locales];

  const onSelect = (range?: DateRange) => {
    setDate(range);
    onChange?.(range);
  };

  return (
    <div className={cn('grid w-full gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id='date'
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {date?.start ? (
              date.end ? (
                <>
                  {format(date.start, 'LLL dd, y')} -{' '}
                  {format(date.end, 'LLL dd, y')}
                </>
              ) : (
                format(date.start, 'LLL dd, y', { locale })
              )
            ) : (
              <span className='text-sm text-muted-foreground'>
                {t('date_range_picker_placeholder')}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='flex w-auto flex-col gap-2 p-0 md:flex-row'
          align='end'
        >
          {!!rangeOptions?.length && (
            <div className='flex flex-col gap-1 px-2 py-4'>
              {rangeOptions?.map((option) => (
                <Button
                  key={option.name}
                  variant='outline'
                  className='w-full'
                  onClick={() => onSelect(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          )}
          <Calendar
            autoFocus
            {...rest}
            mode='range'
            defaultMonth={date?.start}
            selected={{
              from: date?.start,
              to: date?.end
            }}
            onSelect={(range) =>
              onSelect(
                range
                  ? {
                      start: range.from ? startOfDay(range.from) : undefined,
                      end: range.to ? endOfDay(range.to) : undefined
                    }
                  : undefined
              )
            }
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
