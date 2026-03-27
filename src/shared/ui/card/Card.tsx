import type { ComponentProps, ReactNode } from 'react';

import cn from '@/shared/lib/cn';

type CardProps = Omit<ComponentProps<'div'>, 'title' | 'description'> & {
  classNames?: {
    header?: string;
    title?: string;
    description?: string;
    content?: string;
  };
  title?: ReactNode;
  description?: ReactNode;
};
const Card = ({ className, classNames, title, description, children, ...restProps }: CardProps) => {
  return (
    <div
      className={cn('flex flex-col gap-4 rounded-2xl bg-white/10 p-6 backdrop-blur-sm', className)}
      {...restProps}
    >
      {(title || description) && (
        <div className={cn('flex flex-col gap-1', classNames?.header)}>
          {title && <span className={cn('text-lg font-medium', classNames?.title)}>{title}</span>}
          {description && (
            <span className={cn('text-sm text-white/70', classNames?.description)}>
              {description}
            </span>
          )}
        </div>
      )}
      <div className={classNames?.content}>{children}</div>
    </div>
  );
};

export default Card;
