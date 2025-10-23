export type ID = string;

export type WithId<T> = T & {
  id: ID;
};
