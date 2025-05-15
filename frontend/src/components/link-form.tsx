import { useFormContext } from "react-hook-form";
import { Equal, Link as LinkIcon } from "lucide-react";

import type { LinksFormValues } from "../pages/customize-link-page";
import { platforms } from "../data/platforms";

export interface LinkFormItemProps {
  id: string;
  index: number;
  onRemove: (id: string) => void;
}

const LinkForm = ({ id, index, onRemove }: LinkFormItemProps) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<LinksFormValues>();

  const platformValue = watch(`links.${index}.platform`);
  const selectedPlatform = platforms.find((p) => p.value === platformValue);

  return (
    <section className="rounded-lg bg-gray-50 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-gray flex items-center">
          <Equal size={20} />
          <span className="ml-2 font-bold">Link #{index + 1}</span>
        </div>

        <button
          type="button"
          className="text-gray text-sm hover:text-gray-700"
          onClick={() => onRemove(id)}
        >
          Remove
        </button>
      </div>

      <div className="mb-3">
        <label
          htmlFor={`links.${index}.platform`}
          className="mb-1 block text-sm text-black"
        >
          Platform
        </label>

        <div className="relative">
          <select
            id={`links.${index}.platform`}
            defaultValue=""
            className="focus:border-primary focus:ring-primary w-full appearance-none rounded-lg border border-gray-200 bg-white p-3 pr-10 pl-10 outline-none focus:ring-1"
            {...register(`links.${index}.platform`, {
              required: true,
            })}
          >
            <option value="">Select Platform</option>
            {platforms.map((platform) => (
              <option key={platform.value} value={platform.value}>
                {platform.label}
              </option>
            ))}
          </select>

          <div className="absolute top-1/2 left-3 -translate-y-1/2">
            {selectedPlatform?.icon || (
              <LinkIcon size={20} className="text-gray-400" />
            )}
          </div>

          <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
            <svg
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L6 6L11 1"
                stroke="#633CFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        {errors.links?.[index]?.platform && (
          <p className="mt-1 text-sm text-red-500">
            {errors.links[index]?.platform?.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor={`links.${index}.url`}
          className="mb-1 block text-sm text-black"
        >
          Link
        </label>

        <div className="relative">
          <input
            type="url"
            id={`links.${index}.url`}
            placeholder="e.g. https://example.com/username"
            className="focus:border-primary focus:ring-primary w-full appearance-none rounded-lg border border-gray-200 bg-white p-3 pr-10 pl-10 outline-none placeholder:text-sm focus:ring-1"
            {...register(`links.${index}.url`)}
          />
          <div className="absolute top-1/2 left-3 -translate-y-1/2">
            <LinkIcon size={20} className="text-gray-400" />
          </div>
          {errors.links?.[index]?.url && (
            <p className="mt-1 text-sm text-red-500">
              {errors.links[index]?.url?.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default LinkForm;
