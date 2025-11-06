import React from 'react';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  width?: string;
  height?: string;
};

export const Skeleton: React.FC<Props> = ({ width = '100%', height = '1rem', className = '', ...rest }) => {
  return (
    <div
      className={`bg-muted-foreground/10 rounded-md animate-pulse ${className}`}
      style={{ width, height }}
      aria-hidden
      {...rest}
    />
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="aspect-square bg-muted relative overflow-hidden">
        <div className="w-full h-full bg-muted-foreground/10 animate-pulse" />
      </div>
      <div className="p-3 space-y-2">
        <div className="h-3 bg-muted-foreground/10 rounded w-3/4 animate-pulse" />
        <div className="h-3 bg-muted-foreground/10 rounded w-1/2 animate-pulse" />
        <div className="h-4 bg-muted-foreground/10 rounded w-1/3 animate-pulse" />
      </div>
    </div>
  );
};

export default Skeleton;
