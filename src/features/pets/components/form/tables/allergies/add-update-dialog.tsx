'use client';

import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/client';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import {
  allergyEntrySchema,
  AllergyEntryUpdateModel,
  allergySeverities
} from '@/types/pet';
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTrigger,
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';

export const AddUpdateAllergyDialog: React.FC<{
  petId: string;
  allergyId?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ petId, allergyId, isOpen, onOpenChange: propOnOpenChange }) => {
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
          `/api/pets/${petId}/allergies/${allergyId}`
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
    if (allergyId && petId && isOpen) {
      getInitialData();
    }
  }, [allergyId, petId, isOpen]);

  const form = useForm<AllergyEntryUpdateModel>({
    resolver: zodResolver(allergyEntrySchema),
    defaultValues: {
      allergy: '',
      severity: 'low',
      reaction: '',
      note: ''
    },
    mode: 'all'
  });
  const { t } = useTranslation();

  const router = useRouter();
  const onSubmit = async (data: AllergyEntryUpdateModel) => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `/api/pets/${petId}/allergies/${allergyId ?? ''}`,
        {
          method: allergyId ? 'PUT' : 'POST',
          body: JSON.stringify(data)
        }
      );

      if (response.status >= 400) {
        throw new Error(response.status.toString());
      }

      router.refresh();

      toast.success(
        t(allergyId ? 'allergy_updated_toast' : 'allergy_created_toast')
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
            {allergyId ? t('update_allergy_title') : t('add_allergy_title')}
          </DialogTitle>
          <DialogDescription>
            {allergyId
              ? t('update_allergy_description')
              : t('add_allergy_description')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex w-full flex-col gap-2'
          >
            <FormField
              control={form.control}
              name={`allergy`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('allergy_label')}</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} {...field} />
                  </FormControl>
                  <FormFieldMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`severity`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('allergies_severity_label')}</FormLabel>
                  <FormControl>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder={t('allergies_severity_label')}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {allergySeverities.map((severity) => (
                          <SelectItem key={severity} value={severity}>
                            {t(`allergies_severity_${severity}_label`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormFieldMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`reaction`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('allergies_reaction_label')}</FormLabel>
                  <FormControl>
                    <Textarea disabled={isLoading} {...field} />
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
            {allergyId ? t('update_label') : t('add_label')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
