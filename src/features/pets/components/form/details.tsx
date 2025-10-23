'use client';

import { FormFieldMessage } from '@/components/form-field-message';
import { DatePicker } from '@/components/ui/date-picker';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Form
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  animals,
  Pet,
  petGenders,
  petSchema,
  PetUpdateModel
} from '@/types/pet';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { t } from 'i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ID } from '@/types/with-id';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from 'next-auth/react';
import { Combobox } from '@/components/ui/combobox';
import { UserListModel } from '@/types/user';

const initialDate = new Date();

export const PetDetailsForm = ({ id: initialId }: { id?: ID }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [initialData, setInitialData] = useState<Pet | null>(null);

  const [users, setUsers] = useState<UserListModel[]>([]);

  const session = useSession();
  const isAdmin = session.data?.user?.isAdmin;
  const [ownerId, setOwnerId] = useState<ID | null>(null);

  const form = useForm<PetUpdateModel>({
    resolver: zodResolver(petSchema),
    values: {
      dateOfBirth: initialDate,
      gender: 'male',
      type: 'dog',
      name: '',
      breed: '',
      insurance: {
        provider: '',
        policyNumber: ''
      }
    },
    mode: 'all'
  });

  useEffect(() => {
    const getInitialData = async () => {
      setIsInitialLoading(true);
      try {
        const response = await fetch(`/api/pets/${initialId}`);
        if (response.ok) {
          const data = (await response.json()) as Pet;
          setInitialData(data);
          form.reset(data);
        } else {
          toast.error(t('error_toast_message'));
        }
      } finally {
        setIsInitialLoading(false);
      }
    };

    if (initialId) {
      getInitialData();
    }
  }, [initialId]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await fetch('/api/users');
      const data = (await response.json()) as UserListModel[];
      setUsers(data);
    };

    if (isAdmin && !initialId) {
      getUsers();
    }
  }, [isAdmin, initialId]);

  const router = useRouter();

  const onSubmit = async (data: PetUpdateModel) => {
    if (isAdmin && !ownerId) {
      toast.error(t('owner_id_required_validation_message'));
      return;
    }

    try {
      setIsLoading(true);
      const url = initialId
        ? `/api/pets/${initialId ?? ''}`
        : `/api/pets${isAdmin ? `?ownerId=${encodeURIComponent(ownerId ?? '')}` : ''}`;
      const response = await fetch(url, {
        method: initialId ? 'PUT' : 'POST',
        body: JSON.stringify(data)
      });

      if (response.status >= 400) {
        throw new Error(response.status.toString());
      }

      toast.success(t(initialId ? 'pet_updated_toast' : 'pet_created_toast'));
      if (!initialId) {
        const responseData = await response.json();
        const id = responseData.id;
        router.push(`/dashboard/pets/${id}`);
      }
    } catch (error: any) {
      toast.error(t('error_toast_message'));
    } finally {
      setIsLoading(false);
    }
  };

  return isInitialLoading ? (
    <Skeleton className='h-40 w-full' />
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-8'>
        <div className='flex items-center justify-between'>
          <h2>{t('tab_details_title')}</h2>
          <Button
            variant='outline'
            onClick={form.handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {t(initialId ? 'update_label' : 'add_new_label')}
          </Button>
        </div>
        <div className='w-full gap-8 md:grid md:grid-cols-3'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('name_label')}</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder={t('name_placeholder')}
                    {...field}
                  />
                </FormControl>
                <FormFieldMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='type'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('type_label')}</FormLabel>
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
                        placeholder={t('type_label')}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {animals.map((animalType) => (
                      <SelectItem key={animalType} value={animalType}>
                        {t(`type_${animalType}_label`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormFieldMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='breed'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('breed_label')}</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder={t('breed_placeholder')}
                    {...field}
                  />
                </FormControl>
                <FormFieldMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='gender'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('gender_label')}</FormLabel>
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
                        placeholder={t('gender_label')}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {petGenders.map((gender) => (
                      <SelectItem key={gender} value={gender}>
                        {t(`gender_${gender}_label`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormFieldMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='dateOfBirth'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('date_of_birth_label')}</FormLabel>
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
            name='veterinarian'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('veterinarian_label')}</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder='John Doe'
                    {...field}
                  />
                </FormControl>
                <FormFieldMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='insurance.provider'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('insurance_provider_label')}</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder={t('insurance_provider_placeholder')}
                    {...field}
                  />
                </FormControl>
                <FormFieldMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='insurance.policyNumber'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('insurance_policy_number_label')}</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder={t('insurance_policy_number_placeholder')}
                    {...field}
                  />
                </FormControl>
                <FormFieldMessage />
              </FormItem>
            )}
          />
          {isAdmin && !initialData && (
            <div className='mb-2 space-y-2 lg:mb-0'>
              <FormLabel>{t('owner_label')}</FormLabel>
              <Combobox
                disabled={isLoading}
                onItemSelect={setOwnerId}
                value={ownerId ?? undefined}
                allowClear={false}
                className='w-full'
                customSearch={(search) =>
                  (
                    users?.filter((user) =>
                      user.name.toLowerCase().includes(search.toLowerCase())
                    ) ??
                    users?.filter((user) =>
                      user.email.toLowerCase().includes(search.toLowerCase())
                    ) ??
                    []
                  ).map((user) => ({
                    value: user.id,
                    label: `${user.name} (${user.email})`
                  }))
                }
                values={
                  users?.map((user) => ({
                    value: user.id,
                    label: `${user.name} (${user.email})`
                  })) ?? []
                }
              />
            </div>
          )}
        </div>
      </form>
    </Form>
  );
};
