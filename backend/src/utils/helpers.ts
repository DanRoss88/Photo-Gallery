export const validateRequiredFields = (data: any, requiredFields: string[]): string | null => {
    for (const field of requiredFields) {
      if (!data[field]) {
        return `${field} is required`;
      }
    }
    return null;
  };
