import { LoadingSpinner } from "@/app/componentes/LoadingSpinner";

export default function Loading() {
    return (
        <div className="flex min-h-[50vh] w-full items-center justify-center">
            <LoadingSpinner />
        </div>
    );
}
