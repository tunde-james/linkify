import { useState } from "react";

import uploadImage from "/images/icon-upload-image.svg";
import { Trash2, Upload } from "lucide-react";

interface ProfileImageProps {
  currentImageUrl: string | null;
  onSelectImage: (file: File) => void;
  onDeleteImage: () => void;
  isDeleting: boolean;
}

const ProfileImageUpload = ({
  currentImageUrl,
  onSelectImage,
  onDeleteImage,
  isDeleting,
}: ProfileImageProps) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      onSelectImage(file);
    }
  };

  return (
    <div className="relative h-[193px] w-[193px]">
      {!currentImageUrl ? (
        <label
          htmlFor="imageUpload"
          className="bg-primary-50 flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-xl px-10 py-[60px]"
        >
          <img
            src={uploadImage}
            alt="Upload image icon"
            className="object-cover"
          />
          <p className="text-primary mt-2 text-sm leading-[150%] font-semibold">
            + Upload Image
          </p>
          <input
            type="file"
            id="imageUpload"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      ) : (
        <div
          className="relative h-full w-full"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <img
            src={currentImageUrl}
            alt="Profile Image"
            className="absolute inset-0 h-full w-full rounded-xl object-cover"
          />

          {/* Overlay that appears on hover */}
          {isHovering && (
            <div className="absolute inset-0 flex items-center justify-center gap-4 rounded-xl bg-black/50">
              <label
                htmlFor="imageUpload"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/30"
                title="Change image"
              >
                <Upload size={20} className="text-white" />
              </label>
              <input
                type="file"
                id="imageUpload"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleImageChange}
                className="hidden"
              />

              <button
                onClick={onDeleteImage}
                disabled={isDeleting}
                title="Delete Image"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-red-500/70"
              >
                <Trash2 size={20} className="text-white" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileImageUpload;
