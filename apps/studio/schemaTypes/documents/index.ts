import { author } from "./author";
import { blog } from "./blog";
import { blogIndex } from "./blog-index";
import { categoryType } from "./categories";
import { customer } from "./customer";
import { faq } from "./faq";
import { footer } from "./footer";
import { homePage } from "./home-page";
import { job } from "./job";
import { materialUsage } from "./materialUsage";
import { materials } from "./materials";
import { metals } from "./metals";
import { navbar } from "./navbar";
import { page } from "./page";
import { process } from "./process";
import { refiningStep } from "./refiningStep";
import { settings } from "./settings";

export const singletons = [homePage, blogIndex, settings, footer, navbar];

export const documents = [blog, categoryType, customer, job, materialUsage, materials, metals, page, process, refiningStep, faq, author, ...singletons];
