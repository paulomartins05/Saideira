import Header from "./pages/header";

export default function Loading() {
  return (
    <div className="bg-paper min-h-screen flex flex-col font-inter">
      <Header />

      <div className="pt-24 pb-16 flex flex-col items-center justify-center text-center px-4 bg-gradient-to-b from-paper to-white">
        <div className="w-full max-w-3xl h-16 md:h-20 bg-line rounded-2xl animate-pulse mb-6"></div>
        <div className="w-3/4 max-w-xl h-6 bg-line rounded-md animate-pulse mb-8"></div>
        <div className="flex gap-4">
          <div className="w-36 h-14 bg-line rounded-xl animate-pulse"></div>
          <div className="w-36 h-14 bg-line rounded-xl animate-pulse"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="w-48 h-8 bg-line rounded-lg animate-pulse mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-card border border-line rounded-[2rem] overflow-hidden flex flex-col">
              <div className="w-full h-56 bg-line animate-pulse"></div>
              <div className="p-6 flex flex-col gap-3">
                <div className="w-3/4 h-6 bg-line rounded animate-pulse"></div>
                <div className="w-1/2 h-4 bg-line rounded animate-pulse"></div>
                <div className="mt-4 flex justify-between items-end">
                  <div className="w-20 h-8 bg-line rounded animate-pulse"></div>
                  <div className="w-10 h-10 bg-line rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
