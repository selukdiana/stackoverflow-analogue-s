import { useState, type ChangeEvent } from 'react';

export const useForm = <T extends Record<string, string>>(initial: T) => {
  const [values, setValues] = useState<T>(initial);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }) as T);
  };

  const reset = (newValues: T) => setValues(newValues);

  return { values, handleChange, reset };
};
