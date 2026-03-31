// components/LoadingSpinner.tsx
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      <span className="ml-2 text-gray-600">Carregando...</span>
    </div>
  );
}