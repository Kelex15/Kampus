import DiscoverSkeleton from "@/components/shared/DiscoverSkeleton";
import PageShell from "@/components/shared/PageShell";

export default function Loading() {
    return (
        <PageShell>
            <DiscoverSkeleton />
        </PageShell>
    );
}