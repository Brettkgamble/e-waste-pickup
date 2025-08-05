import { author } from "./author";
import { blog } from "./blog";
import { blogIndex } from "./blog-index";
import { categoryType } from "./categories";
import { faq } from "./faq";
import { footer } from "./footer";
import { homePage } from "./home-page";
import { job } from "./job";
import { metals } from "./metals";
import { navbar } from "./navbar";
import { page } from "./page";
import { settings } from "./settings";

export const singletons = [homePage, blogIndex, settings, footer, navbar];

export const documents = [blog, categoryType, job, metals, page, faq, author, ...singletons];
