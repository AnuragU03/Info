import { Skeleton } from '@/components/ui/skeleton';

export default function VillageLoading() {
  return (
    <div className="container py-8">
      <Skeleton className="h-8 w-64 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Skeleton className="h-[400px] w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
