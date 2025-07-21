import { useEffect, useState } from 'react';

type Question = {
  id?: number;
  question: string;
  answer?: string;
  category: string;
  difficulty?: string;
};

export function useRandomQuestions(
  reactQuestions: Question[],
  jsQuestions: Question[],
  nodejsQuestions: Question[],
  count = 5
) {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const shuffle = <T,>(array: T[]): T[] => {
      const copy = [...array];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    };

    const pickOne = <T,>(array: T[]): T => shuffle(array)[0];

    const buildSet = () => {
      const picked: Question[] = [];

      picked.push(pickOne(reactQuestions));
      picked.push(pickOne(jsQuestions));
      picked.push(pickOne(nodejsQuestions));

      const all = [...reactQuestions, ...jsQuestions, ...nodejsQuestions];
      const alreadyPicked = new Set(picked.map(q => q.question));

      const remaining = all.filter(q => !alreadyPicked.has(q.question));

      while (picked.length < count && remaining.length > 0) {
        picked.push(pickOne(remaining));
        remaining.splice(remaining.findIndex(q => q.question === picked[picked.length-1].question), 1);
      }

      setQuestions(shuffle(picked));
    };

    buildSet();
  }, [reactQuestions, jsQuestions, nodejsQuestions, count]);

  return questions;
}
