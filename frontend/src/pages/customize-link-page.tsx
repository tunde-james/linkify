import { Button } from "../components/button";
import Navbar from "../components/navbar";
import illustrationEmpty from "/images/illustration-empty.svg";
import { Plus } from "lucide-react";
import LinkForm, { Link } from "../components/link-form";
import { useState } from "react";

const CustomizeLinkPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [links, setLinks] = useState<Link[]>([]);

  return (
    <>
      <Navbar />

      <div className="px-10">
        <h2 className="mt-10 text-2xl leading-9 font-bold text-black">
          Customize your links
        </h2>

        <p className="text-gray mt-2 leading-6">
          Add/edit/remove links below and then share all your profiles with the
          world!
        </p>

        <Button
          variant="outline"
          onClick={() => setIsFormOpen(true)}
          className="mt-10 mb-6 w-full leading-6 font-semibold"
        >
          <Plus /> Add new link
        </Button>

        <form>
          {links.length === 0 && !isFormOpen ? (
            <div className="mb-6 flex flex-col items-center justify-center gap-3 rounded-xl bg-gray-50 p-5">
              <div className="mt-[70px] w-[200px]">
                <img
                  src={illustrationEmpty}
                  alt="empty space"
                  className="w-full content-center self-center object-cover"
                />
              </div>

              <h3 className="text-2xl leading-9 font-bold text-black">
                Let’s get you started
              </h3>

              <p className="text-gray">
                Use the “Add new link” button to get started. Once you have more
                than one link, you can reorder and edit them. We’re here to help
                you share your profiles with everyone!
              </p>
            </div>
          ) : (
            <LinkForm />
          )}

          <div className="container">
            <hr className="text-gray-100" />
          </div>

          <div className="px-10 py-4">
            <Button disabled className="bg-primary/25 w-full">
              Save
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CustomizeLinkPage;
