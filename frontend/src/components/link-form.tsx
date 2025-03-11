import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { Button } from "./button";

export const PlatformSchema = z.enum([
  "GitHub",
  "YouTube",
  "Twitter",
  "LinkedIn",
  "Instagram",
  "Facebook",
  "TikTok",
  "Website",
]);

export type Platform = z.infer<typeof PlatformSchema>;

export const LinkSchema = z.object({
  id: z.string(),
  platform: PlatformSchema,
  url: z.string().url(),
  order: z.number(),
});

export type Link = z.infer<typeof LinkSchema>;

export const LinkFormSchema = z.object({
  platform: PlatformSchema,
  url: z.string().url(),
});

export type LinkFormData = z.infer<typeof LinkFormSchema>;

// interface LinkFormProps {
//   onSave: (data: LinkFormData) => void;
// }

const platforms: Platform[] = [
  "GitHub",
  "YouTube",
  "Twitter",
  "LinkedIn",
  "Instagram",
  "Facebook",
  "TikTok",
  "Website",
];

const LinkForm = () => {
  const {
    register,
    formState: { errors, isValid },
  } = useFormContext<LinkFormData>();

  return (
    <form>
      <div className="">
        <label htmlFor="" className="">
          Platform
        </label>
        <select id="" className="" {...register("platform")}>
          {platforms.map((platform) => (
            <option key={platform} value={platform}>
              {platform}
            </option>
          ))}
        </select>

        {errors.platform ? <p></p> : null}
      </div>

      <div className="">
        <label htmlFor="" className="">
          Link
        </label>
        <input
          type="url"
          placeholder="e.g. https://github.com/username"
          className=""
          {...register("url")}
        />

        {errors.url ? <p></p> : null}
      </div>

      <Button type="submit" disabled={isValid}>
        Save
      </Button>
    </form>
  );
};

export default LinkForm;
