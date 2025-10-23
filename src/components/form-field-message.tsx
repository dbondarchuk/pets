import { useTranslation } from '@/i18n/client';
import React from 'react';
import { useFormField } from './ui/form';
import { cn } from '@/lib/utils';

export const FormFieldMessage = React.forwardRef<
  HTMLParagraphElement,
  Exclude<React.HTMLAttributes<HTMLParagraphElement>, 'children'>
>(({ className, ...props }, ref) => {
  const { t } = useTranslation();
  const { error, formMessageId } = useFormField();
  const body = error?.message;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn('text-sm font-medium text-destructive', className)}
      {...props}
    >
      {t(body)}
    </p>
  );
});

FormFieldMessage.displayName = 'FormFieldMessage';
