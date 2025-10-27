import { useCallback, useState, type ChangeEvent } from 'react';

export const useForm = <T extends Record<string, string>>(initial: T) => {
  const [values, setValues] = useState<T>(initial);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }) as T);
    },
    [],
  );

  const reset = useCallback(
    (newValues: T = initial) => setValues(newValues),
    [initial],
  );

  return { values, handleChange, reset };
};
