import { api } from "./axios";

import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types/category";

export async function getCategories(): Promise<Category[]> {
  const response = await api.get<Category[]>("/categories");
  return response.data;
}

export async function createCategory(
  request: CreateCategoryRequest,
): Promise<Category> {
  const response = await api.post<Category>("/categories", request);
  return response.data;
}

export async function updateCategory(
  categoryId: string,
  request: UpdateCategoryRequest,
): Promise<Category> {
  const response = await api.put<Category>(
    `/categories/${categoryId}`,
    request,
  );
  return response.data;
}

export async function deleteCategory(categoryId: string): Promise<void> {
  await api.delete(`/categories/${categoryId}`);
}
