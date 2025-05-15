import Github from "/images/icon-github.svg";
import YouTube from "/images/icon-youtube.svg";
import Twitter from "/images/icon-twitter.svg";
import LinkedIn from "/images/icon-linkedin.svg";
import Facebook from "/images/icon-facebook.svg";

export const platforms = [
  { value: "github", label: "GitHub", icon: <img src={Github} alt="GitHub" /> },
  {
    value: "youtube",
    label: "YouTube",
    icon: <img src={YouTube} alt="YouTube" />,
  },
  {
    value: "twitter",
    label: "Twitter",
    icon: <img src={Twitter} alt="Twitter" />,
  },
  {
    value: "linkedin",
    label: "LinkedIn",
    icon: (
      <img src={LinkedIn} alt="LinkedIn" className="fill-white text-white" />
    ),
  },
  {
    value: "facebook",
    label: "Facebook",
    icon: <img src={Facebook} alt="Facebook" />,
  },
  { value: "website", label: "Website", icon: <span>🌐</span> },
];
