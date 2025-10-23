'use client';

import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { vaccinationSchema, VaccinationUpdateModel } from '@/types/pet';
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FormFieldMessage } from '@/components/form-field-message';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';

export const AddUpdateVaccinationDialog: React.FC<{
  petId: string;
  vaccinationId?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ petId, vaccinationId, isOpen, onOpenChange: propOnOpenChange }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const onOpenChange = (open: boolean) => {
    if (!isLoading) {
      propOnOpenChange(open);
    }
  };

  useEffect(() => {
    const getInitialData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/pets/${petId}/vaccination/${vaccinationId}`
        );
        if (response.ok) {
          const data = await response.json();
          form.reset(data);
        } else {
          toast.error(t('error_toast_message'));
        }
      } catch (error: any) {
        toast.error(t('error_toast_message'));
      } finally {
        setIsLoading(false);
      }
    };
    if (vaccinationId && petId && isOpen) {
      getInitialData();
    }
  }, [vaccinationId, petId, isOpen]);

  const form = useForm<VaccinationUpdateModel>({
    resolver: zodResolver(vaccinationSchema),
    defaultValues: {
      vaccine: '',
      date: new Date(),
      note: ''
    },
    mode: 'all'
  });
  const { t } = useTranslation();

  const router = useRouter();
  const onSubmit = async (data: VaccinationUpdateModel) => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `/api/pets/${petId}/vaccination/${vaccinationId ?? ''}`,
        {
          method: vaccinationId ? 'PUT' : 'POST',
          body: JSON.stringify(data)
        }
      );

      if (response.status >= 400) {
        throw new Error(response.status.toString());
      }

      router.refresh();

      toast.success(
        t(
          vaccinationId
            ? 'vaccination_updated_toast'
            : 'vaccination_created_toast'
        )
      );

      onOpenChange(false);
    } catch (error: any) {
      toast.error(t('error_toast_message'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {vaccinationId
              ? t('update_vaccination_title')
              : t('add_vaccination_title')}
          </DialogTitle>
          <DialogDescription>
            {vaccinationId
              ? t('update_vaccination_description')
              : t('add_vaccination_description')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex w-full flex-col gap-2'
          >
            <FormField
              control={form.control}
              name={`vaccine`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('vaccine_label')}</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} {...field} />
                  </FormControl>
                  <FormFieldMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`date`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('date_label')}</FormLabel>
                  <FormControl>
                    <DatePicker
                      disabled={isLoading}
                      className='w-full'
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        field.onBlur();
                      }}
                    />
                  </FormControl>
                  <FormFieldMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`note`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('note_label')}</FormLabel>
                  <FormControl>
                    <Textarea disabled={isLoading} {...field} />
                  </FormControl>
                  <FormFieldMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='outline'>
              {t('cancel_label')}
            </Button>
          </DialogClose>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
            {vaccinationId ? t('update_label') : t('add_label')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
