import { defineCliConfig } from "sanity/cli";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;
const host = process.env.HOST_NAME;
const productionHostName = process.env.SANITY_STUDIO_PRODUCTION_HOSTNAME;

export default defineCliConfig({
  api: {
    projectId: projectId,
    dataset: dataset,
  },
  studioHost:
    host && host !== "main"
      ? `${host}-${productionHostName}`
      : productionHostName,
  deployment: {
    /**
    * Get the appId for a previously deployed Studio under the "Studio" tab for your project in sanity.io/manage
    * Note: this is required for fine-grained version selection
    */
    appId: projectId,
    /**
     * Enable auto-updates.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity
     */
    autoUpdates: true,
  }
});
