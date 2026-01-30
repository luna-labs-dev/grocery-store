interface History {
  navigate: (path: string) => void;
}

export const history: History = {
  navigate: () => {},
};
