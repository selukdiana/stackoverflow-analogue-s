import { useState, type ChangeEvent } from 'react';

export const useForm = <T extends Record<string, string>>(initial: T) => {
  const [values, setValues] = useState<T>(initial);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }) as T);
  };

  const reset = () => setValues(initial);

  return { values, handleChange, reset };
};
