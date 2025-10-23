import { z } from 'zod';
import { ID, WithId } from './with-id';

export const animals = ['cat', 'dog', 'bird', 'rabbit'] as const;
export const petGenders = ['male', 'female'] as const;

export const vaccinationSchema = z.object({
  date: z.coerce.date(),
  vaccine: z.string().min(2, 'vaccine_validation_message'),
  note: z
    .string({ message: 'vaccination_note_validation_message' })
    .min(1, 'vaccination_note_validation_message')
});

export const vaccinationHistorySchema = z.array(vaccinationSchema);

export type VaccinationUpdateModel = z.infer<typeof vaccinationSchema>;
export type VaccinationEntry = WithId<VaccinationUpdateModel> & {
  petId: ID;
};

export const allergySeverities = ['low', 'medium', 'high'] as const;
export type AllergySeverity = (typeof allergySeverities)[number];

export const allergyEntrySchema = z.object({
  allergy: z.string().min(2, 'allergy_validation_message'),
  severity: z.enum(allergySeverities, {
    errorMap: (error, ctx) => ({
      message: 'allergy_severity_validation_message'
    })
  }),
  reaction: z.string().min(2, 'allergy_reaction_validation_message'),
  note: z
    .string()
    .optional()
    .nullable()
    .transform((s) => (s === null ? undefined : s))
});

export const allergySchema = z.array(allergyEntrySchema);

export type AllergyEntryUpdateModel = z.infer<typeof allergyEntrySchema>;
export type AllergyEntry = WithId<AllergyEntryUpdateModel> & {
  petId: ID;
};

export type AllergyEntryListModel = Omit<AllergyEntry, 'note'>;
export type VaccinationListModel = Omit<VaccinationEntry, 'note'>;

export const petSchema = z.object({
  name: z
    .string()
    .min(3, 'name_length_validation_message')
    .regex(/[\p{L}]+( [\p{L}]+)*$/u, {
      message: 'name_regex_validation_message'
    }),
  gender: z.enum(petGenders, {
    errorMap: (error, ctx) => ({ message: 'gender_validation_message' })
  }),
  type: z.enum(animals, {
    errorMap: (error, ctx) => ({ message: 'type_validation_message' })
  }),
  breed: z
    .string()
    .optional()
    .nullable()
    .transform((s) => (s === null ? undefined : s)),
  dateOfBirth: z.coerce.date(),
  insurance: z
    .object({
      provider: z
        .string()
        .optional()
        .nullable()
        .transform((s) => (s === null ? undefined : s)),
      policyNumber: z
        .string()
        .optional()
        .nullable()
        .transform((s) => (s === null ? undefined : s))
    })
    .optional(),
  veterinarian: z
    .string()
    .optional()
    .nullable()
    .transform((s) => (s === null ? undefined : s))
});

export type PetUpdateModel = z.infer<typeof petSchema>;
export type Pet = WithId<PetUpdateModel> & { ownerId: ID; ownerName: string };

export type PetListModel = Pick<
  Pet,
  'id' | 'name' | 'type' | 'breed' | 'dateOfBirth' | 'ownerName' | 'ownerId'
>;
