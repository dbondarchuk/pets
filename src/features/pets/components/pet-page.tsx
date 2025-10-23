import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { PetDetailsForm } from './form/details';
import { ID } from '@/types/with-id';
import { getI18nAsync } from '@/i18n';
import { Link } from '@/components/ui/link';
import { cn } from '@/lib/utils';
import { AllergiesTablePage } from './form/allergies';
import { SearchParams } from 'next/dist/server/request/search-params';
import { VaccinationTablePage } from './form/vaccination';

export interface PetFormProps {
  id?: ID;
  tab: 'details' | 'vaccinations' | 'allergies';
  searchParams: SearchParams;
}

const getTabs = (id?: ID) => ({
  details: {
    href: `/dashboard/pets/${id ? `${id}` : 'new'}`,
    label: 'tab_details_title',
    enabledOnCreate: true
  },
  vaccinations: {
    href: `/dashboard/pets/${id ? `${id}` : 'new'}/vaccinations`,
    label: 'tab_vaccinations_title',
    enabledOnCreate: false
  },
  allergies: {
    href: `/dashboard/pets/${id ? `${id}` : 'new'}/allergies`,
    label: 'tab_allergies_title',
    enabledOnCreate: false
  }
});

export const PetPage: React.FC<PetFormProps> = async ({
  id,
  tab: currentTab,
  searchParams
}) => {
  const { t } = await getI18nAsync();

  const title = id ? 'edit_pet_title' : 'create_pet_title';
  const description = id ? 'edit_pet_description' : 'create_pet_description';

  const tabs = getTabs(id);

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading title={t(title)} description={t(description)} />
      </div>
      <Separator />
      <div>
        <ul className='flex flex-1 gap-4'>
          {Object.entries(tabs)
            .filter(([key, tab]) => tab.enabledOnCreate || id)
            .map(([key, tab]) => (
              <li key={key} className='md:flex-1'>
                {/* {currentStep > index ? (
                <div className='group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                  <Button
                    variant='link'
                    className='text-sm font-medium text-sky-600 transition-colors'
                    onClick={() => handleStepClick(index)}
                  >
                    {step.name}
                  </Button>
                  {/* <span className='text-sm font-medium'>{step.name}</span> 
                </div>
              ) : currentStep === index ? ( */}
                <div
                  className={cn(
                    'flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4',
                    currentTab === key && 'border-gray-200'
                  )}
                  aria-current='step'
                >
                  <Link
                    variant='ghost'
                    button
                    className='text-sm font-medium text-sky-600 transition-colors'
                    href={id ? tab.href : '/dashboard/pets/new'}
                  >
                    {t(tab.label)}
                  </Link>
                </div>
              </li>
            ))}
        </ul>
      </div>
      <Separator />
      <div className='flex w-full flex-1 flex-col space-y-8'>
        {currentTab === 'details' && <PetDetailsForm id={id} />}
        {currentTab === 'allergies' && id && (
          <AllergiesTablePage petId={id} searchParams={searchParams} />
        )}
        {currentTab === 'vaccinations' && id && (
          <VaccinationTablePage petId={id} searchParams={searchParams} />
        )}
      </div>
    </>
  );
};
