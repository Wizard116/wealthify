import { ArrowPathIcon } from '@heroicons/react/24/outline';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <ArrowPathIcon className="animate-spin h-12 w-12 text-gray-900" />
    </div>
  );
};

export default LoadingSpinner;
