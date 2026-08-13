import type { CategoryFormValues } from "../../utils/categorySchema";

export function useCategoryFormSubmission() {
  return (values: CategoryFormValues) => ({
    name: values.name,
    type: values.type,
  });
}
