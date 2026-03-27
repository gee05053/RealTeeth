import type { ComponentProps } from 'react';

import cn from '@/shared/lib/cn';

const InlineStatusMessage = ({ className, children, ...restProps }: ComponentProps<'p'>) => {
  return (
    <p className={cn('text-white/70', className)} {...restProps}>
      {children}
    </p>
  );
};

export default InlineStatusMessage;
