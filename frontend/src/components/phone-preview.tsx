import { LinkType } from "../pages/customize-link-page";
import { platforms } from "../data/platforms";
// import PhoneIllustration from "/images/illustration-phone-mockup.svg";

interface PhonePreviewProps {
  links: LinkType[];
}

const PhonePreview = ({ links }: PhonePreviewProps) => {
  return (
    <div className="relative mx-auto w-[308px] md:mx-0">
      <div className="relative overflow-hidden rounded-[40px] border-[10px] border-gray-800 bg-white">
        <div className="h-[632px] w-full overflow-y-auto pt-10">
          {/* Profile Area */}
          <div className="mb-6 flex flex-col items-center">
            {/* <img src={PhoneIllustration} /> */}
            <div className="h-24 w-24 rounded-full bg-gray-200"></div>
            <div className="mt-4 h-5 w-32 rounded bg-gray-200"></div>
            <div className="mt-2 h-3 w-24 rounded bg-gray-200"></div>
          </div>

          {/* Link Area */}
          <div className="space-y-4 px-5">
            {links.length > 0
              ? links.map((link) => {
                  const platform = platforms.find(
                    (p) => p.value === link.platform,
                  );

                  return (
                    <div
                      key={link.id}
                      className={`flex items-center justify-between rounded-lg p-4 ${getPlatformColor(link.platform)} transition-transform hover:scale-10 hover:shadow-md`}
                    >
                      <div className="flex items-center gap-2 text-white">
                        {platform?.icon}
                        <span className="font-medium">{platform?.label}</span>
                      </div>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.66699 8.00004H13.3337M13.3337 8.00004L8.00033 2.66671M13.3337 8.00004L8.00033 13.3334"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  );
                })
              : // Empty placeholder links
                Array.from({ length: links.length }).map((_, index) => (
                  <div
                    key={index}
                    className="h-12 w-full rounded-lg bg-gray-200"
                  ></div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get platform-specific colors
const getPlatformColor = (platform: string): string => {
  switch (platform) {
    case "github":
      return "bg-gray-900";
    case "youtube":
      return "bg-red-500";
    case "twitter":
      return "bg-blue-400";
    case "linkedin":
      return "bg-blue-600";
    case "facebook":
      return "bg-blue-800";
    default:
      return "bg-purple-500";
  }
};

export default PhonePreview;
