import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';

import styles from './Select.module.scss';

interface SelectProps {
  options: string[];
  selected: string;
  handleChange: (option: string) => void;
  placeholder: string;
}
export const Select = ({
  options,
  selected,
  handleChange,
  placeholder,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selectDropdownClasses = classNames(
    styles.selectDropdown,
    !isOpen && styles.hidden,
  );

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className={styles.customSelect} ref={rootRef}>
      <button className={styles.selectButton} onClick={toggleOpen}>
        <span className={styles.selectedValue}>{selected || placeholder}</span>
        <span className={styles.arrow}></span>
      </button>
      <ul className={selectDropdownClasses}>
        {options.map((option) => (
          <li
            key={option}
            className={selected === option ? styles.selected : undefined}
            onClick={() => {
              handleChange(option);
              setIsOpen(false);
            }}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
};
