import type { ComponentProps } from 'react';

import cn from '@/shared/lib/cn';

const IconButton = ({ className, children, ...restProps }: ComponentProps<'button'>) => {
  return (
    <button
      className={cn(
        'flex size-7 cursor-pointer items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/10 hover:text-white active:scale-90',
        className
      )}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default IconButton;
