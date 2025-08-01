import { author } from "./author";
import { blog } from "./blog";
import { blogIndex } from "./blog-index";
import { categoryType } from "./categories";
import { faq } from "./faq";
import { footer } from "./footer";
import { homePage } from "./home-page";
import { navbar } from "./navbar";
import { page } from "./page";
import { settings } from "./settings";

export const singletons = [homePage, blogIndex, settings, footer, navbar];

export const documents = [blog, categoryType, page, faq, author, ...singletons];
