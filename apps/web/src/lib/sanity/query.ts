import { defineQuery } from "next-sanity";

// Base fragments for reusable query parts
const imageFragment = /* groq */ `
  image{
    ...,
    ...asset->{
      "alt": coalesce(altText, originalFilename, "no-alt"),
      "blurData": metadata.lqip,
      "dominantColor": metadata.palette.dominant.background
    },
  }
`;

const customLinkFragment = /* groq */ `
  ...customLink{
    openInNewTab,
    "href": select(
      type == "internal" => internal->slug.current,
      type == "external" => external,
      "#"
    ),
  }
`;

const markDefsFragment = /* groq */ `
  markDefs[]{
    ...,
    ${customLinkFragment}
  }
`;

const richTextFragment = /* groq */ `
  richText[]{
    ...,
    ${markDefsFragment}
  }
`;

const blogAuthorFragment = /* groq */ `
  authors[0]->{
    _id,
    name,
    position,
    ${imageFragment}
  }
`;

const blogCardFragment = /* groq */ `
  _type,
  _id,
  title,
  description,
  "slug":slug.current,
  richText,
  orderRank,
  ${imageFragment},
  publishedAt,
  ${blogAuthorFragment},
  "categories": categories[]->{
    _id,
    name,
    "slug": slug.current
  }
`;

const buttonsFragment = /* groq */ `
  buttons[]{
    text,
    variant,
    _key,
    _type,
    "openInNewTab": url.openInNewTab,
    "href": select(
      url.type == "internal" => url.internal->slug.current,
      url.type == "external" => url.external,
      url.href
    ),
  }
`;

// Page builder block fragments
const ctaBlock = /* groq */ `
  _type == "cta" => {
    ...,
    ${richTextFragment},
    ${buttonsFragment},
  }
`;
const imageLinkCardsBlock = /* groq */ `
  _type == "imageLinkCards" => {
    ...,
    ${richTextFragment},
    ${buttonsFragment},
    "cards": array::compact(cards[]{
      ...,
      "openInNewTab": url.openInNewTab,
      "href": select(
        url.type == "internal" => url.internal->slug.current,
        url.type == "external" => url.external,
        url.href
      ),
      ${imageFragment},
    })
  }
`;

const heroBlock = /* groq */ `
  _type == "hero" => {
    ...,
    ${imageFragment},
    ${buttonsFragment},
    ${richTextFragment}
  }
`;

const faqFragment = /* groq */ `
  "faqs": array::compact(faqs[]->{
    title,
    _id,
    _type,
    ${richTextFragment}
  })
`;

const faqAccordionBlock = /* groq */ `
  _type == "faqAccordion" => {
    ...,
    ${faqFragment},
    link{
      ...,
      "openInNewTab": url.openInNewTab,
      "href": select(
        url.type == "internal" => url.internal->slug.current,
        url.type == "external" => url.external,
        url.href
      )
    }
  }
`;

const subscribeNewsletterBlock = /* groq */ `
  _type == "subscribeNewsletter" => {
    ...,
    "subTitle": subTitle[]{
      ...,
      ${markDefsFragment}
    },
    "helperText": helperText[]{
      ...,
      ${markDefsFragment}
    }
  }
`;

const featureCardsIconBlock = /* groq */ `
  _type == "featureCardsIcon" => {
    ...,
    ${richTextFragment},
    "cards": array::compact(cards[]{
      ...,
      ${richTextFragment},
    })
  }
`;

const featuredBlogBlock = /* groq */ `
  _type == "featuredBlog" => {
    blog[0]->{
      ...,
      ${blogCardFragment}
    },
    title,
  }
`;

const pageBuilderFragment = /* groq */ `
  pageBuilder[]{
    ...,
    _type,
    ${ctaBlock},
    ${heroBlock},
    ${faqAccordionBlock},
    ${featuredBlogBlock},
    ${featureCardsIconBlock},
    ${subscribeNewsletterBlock},
    ${imageLinkCardsBlock}
  }
`;

/**
 * Query to extract a single image from a page document
 * This is used as a type reference only and not for actual data fetching
 * Helps with TypeScript inference for image objects
 */
export const queryImageType = defineQuery(`
  *[_type == "page" && defined(image)][0]{
    ${imageFragment}
  }.image
`);

export const queryHomePageData =
  defineQuery(`*[_type == "homePage" && _id == "homePage"][0]{
    ...,
    _id,
    _type,
    "slug": slug.current,
    title,
    description,
    ${pageBuilderFragment}
  }`);

export const querySlugPageData = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    ...,
    "slug": slug.current,
    ${pageBuilderFragment}
  }
  `);

export const querySlugPagePaths = defineQuery(`
  *[_type == "page" && defined(slug.current)].slug.current
`);

export const queryBlogIndexPageData = defineQuery(`
  *[_type == "blogIndex"][0]{
    ...,
    _id,
    _type,
    title,
    description,
    "displayFeaturedBlogs" : displayFeaturedBlogs == "yes",
    "featuredBlogsCount" : featuredBlogsCount,
    ${pageBuilderFragment},
    "slug": slug.current,
    "blogs": *[_type == "blog" && (seoHideFromLists != true)] | order(orderRank asc){
      ${blogCardFragment}
    }
  }
`);

export const queryBlogSlugPageData = defineQuery(`
  *[_type == "blog" && slug.current == $slug][0]{
    ...,
    "slug": slug.current,
    ${blogAuthorFragment},
    ${imageFragment},
    ${richTextFragment},
    ${pageBuilderFragment}
  }
`);

export const queryBlogPaths = defineQuery(`
  *[_type == "blog" && defined(slug.current)].slug.current
`);

const ogFieldsFragment = /* groq */ `
  _id,
  _type,
  "title": select(
    defined(ogTitle) => ogTitle,
    defined(seoTitle) => seoTitle,
    title
  ),
  "description": select(
    defined(ogDescription) => ogDescription,
    defined(seoDescription) => seoDescription,
    description
  ),
  "image": image.asset->url + "?w=566&h=566&dpr=2&fit=max",
  "dominantColor": image.asset->metadata.palette.dominant.background,
  "seoImage": seoImage.asset->url + "?w=1200&h=630&dpr=2&fit=max", 
  "logo": *[_type == "settings"][0].logo.asset->url + "?w=80&h=40&dpr=3&fit=max&q=100",
  "date": coalesce(date, _createdAt)
`;

export const queryHomePageOGData = defineQuery(`
  *[_type == "homePage" && _id == $id][0]{
    ${ogFieldsFragment}
  }
  `);

export const querySlugPageOGData = defineQuery(`
  *[_type == "page" && _id == $id][0]{
    ${ogFieldsFragment}
  }
`);

export const queryBlogPageOGData = defineQuery(`
  *[_type == "blog" && _id == $id][0]{
    ${ogFieldsFragment}
  }
`);

export const queryGenericPageOGData = defineQuery(`
  *[ defined(slug.current) && _id == $id][0]{
    ${ogFieldsFragment}
  }
`);

export const queryFooterData = defineQuery(`
  *[_type == "footer" && _id == "footer"][0]{
    _id,
    subtitle,
    columns[]{
      _key,
      title,
      links[]{
        _key,
        name,
        "openInNewTab": url.openInNewTab,
        "href": select(
          url.type == "internal" => url.internal->slug.current,
          url.type == "external" => url.external,
          url.href
        ),
      }
    }
  }
`);

export const queryNavbarData = defineQuery(`
  *[_type == "navbar" && _id == "navbar"][0]{
    _id,
    columns[]{
      _key,
      _type == "navbarColumn" => {
        "type": "column",
        title,
        links[]{
          _key,
          name,
          icon,
          description,
          "openInNewTab": url.openInNewTab,
          "href": select(
            url.type == "internal" => url.internal->slug.current,
            url.type == "external" => url.external,
            url.href
          )
        }
      },
      _type == "navbarLink" => {
        "type": "link",
        name,
        description,
        "openInNewTab": url.openInNewTab,
        "href": select(
          url.type == "internal" => url.internal->slug.current,
          url.type == "external" => url.external,
          url.href
        )
      }
    },
    ${buttonsFragment},
  }
`);

export const querySitemapData = defineQuery(`{
  "slugPages": *[_type == "page" && defined(slug.current)]{
    "slug": slug.current,
    "lastModified": _updatedAt
  },
  "blogPages": *[_type == "blog" && defined(slug.current)]{
    "slug": slug.current,
    "lastModified": _updatedAt
  }
}`);
export const queryGlobalSeoSettings = defineQuery(`
  *[_type == "settings"][0]{
    _id,
    _type,
    siteTitle,
    logo{
      ...,
      ...asset->{
        "alt": coalesce(altText, originalFilename, "no-alt"),
        "blurData": metadata.lqip,
        "dominantColor": metadata.palette.dominant.background
      }
    },
    siteDescription,
    socialLinks{
      linkedin,
      facebook,
      twitter,
      instagram,
      youtube,
      medium
    }
  }
`);

export const querySettingsData = defineQuery(`
  *[_type == "settings"][0]{
    _id,
    _type,
    siteTitle,
    siteDescription,
    "logo": logo.asset->url + "?w=80&h=40&dpr=3&fit=max",
    "socialLinks": socialLinks,
    "contactEmail": contactEmail,
  }
`);

export const CATEGORIES_QUERY = defineQuery(`*[
  _type == "category"
]{
  _id,
  name,
  slug,
  description,
  "postCount": count(*[_type == "blog" && references(^._id)])
}`);

export const BLOGS_BY_CATEGORY_QUERY = defineQuery(`*[
  _type == "blog" &&
  references($categoryId)
] | order(publishedAt desc){
  _type,
  _id,
  title,
  description,
  "slug": slug.current,
  richText,
  orderRank,
  image{
    ...,
    ...asset->{
      "alt": coalesce(altText, originalFilename, "no-alt"),
      "blurData": metadata.lqip,
      "dominantColor": metadata.palette.dominant.background
    }
  },
  publishedAt,
  authors[]->{
    _id,
    name,
    position,
    image {
      asset {
        _ref,
        _type,
        _weak
      },
      media,
      hotspot,
      crop,
      _type
    }
  },
  categories[]->{
    _id,
    name,
    slug
  }
}
`);

// Job Dashboard Queries
export const JOBS_DASHBOARD_SUMMARY_QUERY = defineQuery(`{
  "totalJobs": count(*[_type == "job"]),
  "completedJobs": count(*[_type == "job" && status == "completed"]),
  "inProgressJobs": count(*[_type == "job" && status == "in-progress"]),
  "cancelledJobs": count(*[_type == "job" && status == "cancelled"]),
  "allJobs": *[_type == "job"]{
    totalWeight,
    totalPurchasePrice
  },
  "recentJobs": *[_type == "job"] | order(_createdAt desc)[0...5]{
    _id,
    name,
    jobId,
    status,
    totalWeight,
    totalPurchasePrice,
    dateCreated,
    "customerCount": count(customer)
  }
}`);

export const JOBS_LIST_QUERY = defineQuery(`*[_type == "job"] | order(_createdAt desc){
  _id,
  name,
  jobId,
  description,
  status,
  totalWeight,
  totalPurchasePrice,
  dateCreated,
  dateCompleted,
  "customers": customer[]->{
    _id,
    name,
    companyName,
    email,
    phone
  },
  "metalCount": count(metals),
  "processCount": count(processes),
  "imageCount": count(images)
}`);

export const JOB_DETAIL_QUERY = defineQuery(`*[_type == "job" && _id == $jobId][0]{
  _id,
  name,
  jobId,
  description,
  status,
  totalWeight,
  totalPurchasePrice,
  dateCreated,
  dateCompleted,
  "images": images[]{
    _id,
    _type,
    asset->{
      _id,
      _type,
      url,
      "alt": coalesce(altText, originalFilename, "no-alt"),
      "blurData": metadata.lqip,
      "dominantColor": metadata.palette.dominant.background
    }
  },
  "customers": customer[]->{
    _id,
    name,
    companyName,
    email,
    phone,
    address,
    notes
  },
  "metals": metals[]{
    _key,
    weight,
    purchasePrice,
    notes,
    "metal": metal->{
      _id,
      name,
      type,
      currentPricePerPound,
      unit
    },
    "images": images[]{
      _id,
      _type,
      asset->{
        _id,
        _type,
        url,
        "alt": coalesce(altText, originalFilename, "no-alt"),
        "blurData": metadata.lqip,
        "dominantColor": metadata.palette.dominant.background
      }
    }
  },
  "processes": processes[]->{
    _id,
    name,
    description
  },
  "relatedBlogPosts": relatedBlogPosts[]->{
    _id,
    title,
    "slug": slug.current
  }
}`);

export const METAL_ANALYTICS_QUERY = defineQuery(`{
  "metalTypes": *[_type == "metals"]{
    _id,
    name,
    type,
    currentPricePerPound,
    unit,
    isActive
  },
  "metalUsage": *[_type == "job" && defined(metals)]{
    "metals": metals[]{
      "metal": metal->{
        _id,
        name,
        type
      },
      weight,
      purchasePrice
    }
  }
}`);

export const CUSTOMER_ANALYTICS_QUERY = defineQuery(`{
  "totalCustomers": count(*[_type == "customer"]),
  "customersWithJobs": count(*[_type == "customer" && count(*[_type == "job" && references(^._id)]) > 0]),
  "topCustomers": *[_type == "customer"]{
    _id,
    name,
    companyName,
    email,
    "jobCount": count(*[_type == "job" && references(^._id)]),
    "jobs": *[_type == "job" && references(^._id)] | order(dateCreated desc){
      totalPurchasePrice,
      dateCreated
    }
  } | order(jobCount desc)[0...10]
}`);
