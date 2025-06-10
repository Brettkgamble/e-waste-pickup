/* eslint-disable prettier/prettier */
import { PageBuilder } from "@/components/pagebuilder";
import { sanityFetch } from "@/lib/sanity/live";
import { queryHomePageData } from "@/lib/sanity/query";
import { getMetaData } from "@/lib/seo";

async function fetchHomePageData(stega = true) {
  return await sanityFetch({
    query: queryHomePageData,
    stega,
  });
}

export async function generateMetadata() {
  const homePageData = await fetchHomePageData(false);
  return await getMetaData(homePageData?.data ?? {});
}

export default async function Page() {
  const { data: homePageData } = await fetchHomePageData();

  if (!homePageData) {
    return <div>No home page data</div>;
  }

  const { _id, _type, pageBuilder } = homePageData ?? {};

  return <PageBuilder pageBuilder={pageBuilder ?? []} id={_id} type={_type} />;
}
