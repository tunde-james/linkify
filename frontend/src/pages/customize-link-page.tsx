// import { useState } from "react";
import { Plus } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "../components/button";
import Navbar from "../components/navbar";
import Container from "../components/container";
import EmptyState from "../components/empty-state";
import LinkForm from "../components/link-form";
import PhonePreview from "../components/phone-preview";

export const LinkSchema = z.object({
  id: z.string(),
  platform: z.string().min(1, "Please select a platform"),
  url: z.string().url("Please enter a valid URL"),
});

export type LinkType = z.infer<typeof LinkSchema>;

export const LinksFormSchema = z.object({
  links: z.array(LinkSchema),
});

export type LinksFormValues = z.infer<typeof LinksFormSchema>;

const CustomizeLinkPage = () => {
  const form = useForm<LinksFormValues>({
    resolver: zodResolver(LinksFormSchema),
    defaultValues: {
      links: [],
    },
  });

  const { handleSubmit, setValue, watch } = form;
  const watchedLinks = watch("links");

  const addNewLink = () => {
    const newLink = {
      id: `link-${Date.now()}`,
      platform: "linkedin",
      url: "",
    };

    const updatedLinks = [...(watchedLinks || []), newLink];
    setValue("links", updatedLinks);
  };

  const removeLink = (id: string) => {
    const filteredLinks = watchedLinks.filter((link) => link.id !== id);
    setValue("links", filteredLinks);
  };

  const onSubmit = (data: LinksFormValues) => {
    console.log("Form submitted:", data);
  };

  return (
    <>
      <Container>
        <Navbar />

        <div className="lg:flex lg:gap-1 lg:bg-gray-50 lg:pt-6">
          <div className="hidden lg:sticky lg:top-10 lg:block lg:w-1/3 lg:self-start lg:rounded-lg lg:bg-white lg:p-20">
            <PhonePreview links={watchedLinks} />
          </div>

          <div className="mx-auto md:max-w-[640px] lg:max-w-[808px] lg:bg-white">
            <div className="mb-6 px-5">
              <h2 className="mt-10 text-2xl leading-9 font-bold text-black">
                Customize your links
              </h2>

              <p className="text-gray mt-2 leading-6">
                Add/edit/remove links below and then share all your profiles
                with the world!
              </p>

              <Button
                variant="outline"
                onClick={addNewLink}
                className="mt-10 mb-6 w-full leading-6 font-semibold"
              >
                <Plus /> Add new link
              </Button>
            </div>

            <FormProvider {...form}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="px-5 lg:max-w-[728px]"
              >
                {watchedLinks.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="space-y-3 p-5">
                    {watchedLinks.map((link, index) => (
                      <LinkForm
                        key={link.id}
                        id={link.id}
                        index={index}
                        onRemove={removeLink}
                      />
                    ))}
                  </div>
                )}

                <hr className="my-4 text-gray-100" />

                <div className="flex md:justify-end md:pr-5">
                  <Button
                    disabled={watchedLinks.length === 0}
                    className={`w-full font-semibold text-white md:w-fit md:px-4 md:py-2 ${watchedLinks.length > 0 ? "bg-primary" : "bg-primary/25 cursor-not-allowed"}`}
                  >
                    Save
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </Container>
    </>
  );
};

export default CustomizeLinkPage;
