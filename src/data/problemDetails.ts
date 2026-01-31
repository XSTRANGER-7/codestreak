import problemsData from './problems.json';

export interface TestCase {
  input: string;
  output: string;
  explanation?: string;
}

export interface ProblemDetail {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  constraints: string[];
  examples: TestCase[];
  starterCode: {
    cpp: string;
    java: string;
    python: string;
  };
}

export const problemDetails: Record<string, ProblemDetail> = problemsData as Record<string, ProblemDetail>;
