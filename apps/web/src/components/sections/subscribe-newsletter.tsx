// https://www.youtube.com/watch?v=R_Pj593TH_Q
// at 13:40 start of zod
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { ChevronRight, LoaderCircle } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { newsletterSubmission } from "../../action/newsletter-submission";
import { FormDataSchema } from "../../lib/schemas/schema";
import { RichText } from "../richtext";
import type { PagebuilderType } from "@/types";

type Inputs = z.infer<typeof FormDataSchema>;
type SubscribeNewsletterProps = PagebuilderType<"subscribeNewsletter">;

export function SubscribeNewsletter({
  title,
  subTitle,
  helperText,
}: SubscribeNewsletterProps) {
  const [data, setData] = useState<Inputs>();
  const [pending, setPending] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
  });

  // console.log(watch('name'));

  const processForm: SubmitHandler<Inputs> = async (data) => {
    setPending(true);
    setShowMessage(false);
    const result = await newsletterSubmission(data);

    if (!result) {
      console.log("Something went wrong");
      return;
    }

    if (result.error) {
      console.log(result.error);
      return;
    }

    reset();
    setPending(false);
    setShowMessage(true);
    setData(result.data);
  };

  return (
    <section id="subscribe" className="px-4 py-4 sm:py-6 md:py-8">
      {/* <div className="relative container mx-auto px-4 md:px-8 py-8 sm:py-16 md:py-24 lg:py-32 bg-gray-50 dark:bg-zinc-900 rounded-3xl overflow-hidden"></div> */}
      <div className="relative container mx-auto px-4 md:px-8 py-2 sm:py-4 md:py-6 lg:py-8 bg-green-100 dark:bg-zinc-900 rounded-3xl overflow-hidden">
        <div className="relative z-10 mx-auto text-center">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-neutral-300 sm:text-2xl md:text-4xl text-balance">
            {title}
          </h2>
          {subTitle && (
            <RichText
              richText={subTitle}
              className="mb-6 text-sm text-gray-600 sm:mb-8 text-balance sm:text-base dark:text-neutral-300"
            />
          )}
          <form
            onSubmit={handleSubmit(processForm)}
            // className="flex flex-1 flex-col gap-4 sm:w-1/2"
            className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-2"
          >
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex bg-white dark:bg-zinc-200 items-center border rounded-xl p-2 drop-shadow-lg w-full md:w-96 justify-between pl-4">
                <input
                  className="rounded-e-none border-e-0 focus-visible:ring-0 outline-none bg-transparent w-full dark:text-zinc-900 dark:placeholder:text-zinc-900"
                  placeholder="email"
                  {...register("email")}
                />
                {errors.email?.message && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="flex bg-white dark:bg-zinc-200 items-center border rounded-xl p-2 drop-shadow-lg w-full md:w-96 justify-between pl-4">
                <input
                  className="rounded-e-none border-e-0 focus-visible:ring-0 outline-none bg-transparent w-full dark:text-zinc-900 dark:placeholder:text-zinc-900"
                  placeholder="phone"
                  {...register("phone")}
                />
                {errors.phone?.message && (
                  <p className="text-red-500">{errors.phone.message}</p>
                )}
              </div>
            </div>
            <Button
              size="icon"
              type="submit"
              disabled={pending}
              className="size-8 aspect-square bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700"
              aria-label={
                pending ? "Subscribing..." : "Subscribe to newsletter"
              }
            >
              <span className="flex items-center justify-center gap-2">
                {pending ? (
                  <LoaderCircle
                    className="animate-spin text-black"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                ) : (
                  <ChevronRight
                    className="text-black dark:text-neutral-300"
                    size={16}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                )}
              </span>
            </Button>
          </form>
          {showMessage ? (
            <div className="mt-3 text-sm text-gray-800 opacity-80 sm:mt-4 dark:text-neutral-300">
              {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
              <h2 className="mb-4 text-lg font-semibold text-black dark:text-white sm:text-3xl md:text-3xl text-balance">
                Thank-you! we will be in touch soon
              </h2>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </section>
  );
}
