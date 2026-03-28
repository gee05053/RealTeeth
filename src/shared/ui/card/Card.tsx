import type { ComponentProps, ReactNode } from 'react';

import cn from '@/shared/lib/cn';

type CardProps = Omit<ComponentProps<'div'>, 'title' | 'description'> & {
  classNames?: {
    header?: string;
    title?: string;
    description?: string;
    content?: string;
    footer?: string;
  };
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
};
const Card = ({
  className,
  classNames,
  title,
  description,
  children,
  footer,
  ...restProps
}: CardProps) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur-sm sm:gap-4 sm:p-6',
        className
      )}
      {...restProps}
    >
      {(title || description) && (
        <div className={cn('flex flex-col gap-1', classNames?.header)}>
          {title && (
            <span className={cn('text-base font-medium sm:text-lg', classNames?.title)}>
              {title}
            </span>
          )}
          {description && (
            <span className={cn('text-sm text-white/70', classNames?.description)}>
              {description}
            </span>
          )}
        </div>
      )}
      <div className={classNames?.content}>{children}</div>
      {footer && <div className={classNames?.footer}>{footer}</div>}
    </div>
  );
};

export default Card;
