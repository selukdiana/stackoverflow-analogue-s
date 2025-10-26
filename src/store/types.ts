export type AuthStatus =
  | 'unauthorized'
  | 'registered'
  | 'authorized'
  | 'pending';

export type User = {
  username: string;
  id: string;
  role: 'user' | 'admin';
};

export type Mark = {
  id: string;
  type: 'like' | 'dislike';
  user: User;
};

export type Comment = {
  id: string;
  content: string;
  user: User;
};

export type Snippet = {
  id: string;
  code: string;
  language: 'JavaScript';
  marks: Mark[];
  user: User;
  comments: Comment[];
};

export type Meta = {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  sortBy: [['id' | 'code' | 'language', 'ASC' | 'DESC']];
};

export type Links = {
  first?: 'string';
  previous?: 'string';
  current?: 'string';
  next?: 'string';
  last?: 'string';
};

export type LoadingStatus = 'pending' | 'fullfilled' | 'rejected';

export type UserStatistic = {
  snippetsCount: number;
  rating: number;
  commentsCount: number;
  likesCount: number;
  dislikesCount: number;
  questionsCount: number;
  correctAnswersCount: number;
  regularAnswersCount: number;
};

export type Account = User & {
  statistic: UserStatistic;
};

export type Answer = {
  id: string;
  content: string;
  isCorrect: boolean;
};

export type Question = {
  id: string;
  title: string;
  description: string;
  attachedCode: string;
  user: User;
  answers: Answer[];
  isResolved: boolean;
};

export type Error = {
  field: string;
  recievedValue: string;
  failures: string[];
};
