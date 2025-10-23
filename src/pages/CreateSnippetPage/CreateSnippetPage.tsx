import { useEffect, useState, type ChangeEvent, type MouseEvent } from 'react';
import { useNavigate } from 'react-router';
import CodeEditor from '@uiw/react-textarea-code-editor';

import styles from './CreateSnippetPage.module.scss';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  createSnippet,
  getLanguages,
} from '../../store/slices/newSnippetSlice';
import { Select } from '../../components/Select';
import { Button } from '../../components/Button';

export const CreateSnippetPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const languages = useAppSelector((state) => state.newSnippet.languages);
  const [selectedLanguage, setSelectedLanguage] = useState(
    languages[0] || 'JavaScript',
  );
  const [codeSnippetValue, setCodeSnippetValue] = useState('');

  const handleSelectLanguage = (option: string) => {
    setSelectedLanguage(option);
  };

  const handleCodeSnippetValueChange = (
    e: ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setCodeSnippetValue(e.target.value);
  };

  const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!codeSnippetValue) return;
    dispatch(
      createSnippet({ language: selectedLanguage, code: codeSnippetValue }),
    ).then(() => {
      navigate('/');
    });
  };

  useEffect(() => {
    dispatch(getLanguages());
  }, [dispatch]);

  return (
    <>
      <Select
        options={languages}
        selected={selectedLanguage}
        handleChange={handleSelectLanguage}
        placeholder="Please select language"
      />
      <div className={styles.codeEditor}>
        <CodeEditor
          value={codeSnippetValue}
          language={selectedLanguage}
          placeholder={`Please enter ${selectedLanguage} code.`}
          onChange={handleCodeSnippetValueChange}
          padding={15}
          style={{
            backgroundColor: 'white',
            fontFamily:
              'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
          }}
        />
      </div>
      <Button handleClick={handleButtonClick}>Post</Button>
    </>
  );
};
