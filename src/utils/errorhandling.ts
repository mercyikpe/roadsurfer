export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error('An error occurred while fetching data')
  }
  return response.json()
}
