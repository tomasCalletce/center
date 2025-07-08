export enum ONBOARDING_STATUS {
  COMPLETED = "COMPLETED",
}

export enum ONBOARDING_PROGRESS {
  VALIDATING_CV = "validating cv document",
  CONVERTING_PDF_TO_IMAGES = "converting pdf to images",
  CONVERTING_IMAGES_TO_MARKDOWN = "converting images to markdown",
  CONSOLIDATING_MARKDOWN = "consolidating markdown",
  EXTRACTING_JSON_STRUCTURE_AND_SAVING_TO_DATABASE = "extracting json structure and saving to database",
}
