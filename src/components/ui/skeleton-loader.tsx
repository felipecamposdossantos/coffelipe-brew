
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonLoaderProps {
  variant: 'recipe-card' | 'recipe-list' | 'dashboard' | 'timer' | 'user-profile';
  count?: number;
  className?: string;
}

export const SkeletonLoader = ({ variant, count = 1, className }: SkeletonLoaderProps) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'recipe-card':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-full mb-2" />
            <Skeleton className="h-3 w-5/6 mb-4" />
            <div className="flex gap-2 mb-3">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-24 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
        );

      case 'recipe-list':
        return (
          <div className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
            <Skeleton className="h-12 w-12 rounded-full mr-4" />
            <div className="flex-1">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        );

      case 'dashboard':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <Skeleton className="h-3 w-1/2 mb-2" />
                <Skeleton className="h-8 w-3/4" />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <Skeleton className="h-3 w-1/2 mb-2" />
                <Skeleton className="h-8 w-3/4" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <Skeleton className="h-4 w-1/3 mb-4" />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-3 flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'timer':
        return (
          <div className="text-center space-y-6">
            <Skeleton className="h-32 w-32 rounded-full mx-auto" />
            <Skeleton className="h-12 w-48 mx-auto" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
            </div>
            <div className="flex gap-2 justify-center">
              <Skeleton className="h-10 w-20 rounded" />
              <Skeleton className="h-10 w-20 rounded" />
            </div>
          </div>
        );

      case 'user-profile':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full rounded" />
              ))}
            </div>
          </div>
        );

      default:
        return <Skeleton className="h-4 w-full" />;
    }
  };

  return (
    <div className={cn("animate-pulse", className)}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={count > 1 ? "mb-4" : ""}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};
