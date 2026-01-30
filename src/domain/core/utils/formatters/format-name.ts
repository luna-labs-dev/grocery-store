interface GetInitialsParams {
  fullName: string;
  initialsLength: number;
  upperCase?: boolean;
}

export const getInitials = ({
  fullName,
  initialsLength,
  upperCase,
}: GetInitialsParams) => {
  const splittedName = fullName.split(/\s+/);

  const remainingLetters =
    splittedName.length < initialsLength
      ? initialsLength - splittedName.length
      : undefined;

  const initials = splittedName.map((name, index) => {
    if (index === 0) {
      let letters = '';

      if (remainingLetters) {
        for (let i = 0; i <= remainingLetters; i++) {
          letters += name[i];
        }
        return letters;
      }
    }

    return name[0];
  });

  const finalInitials = initials.slice(0, initialsLength).join('');

  if (upperCase) {
    return finalInitials.toUpperCase();
  }

  return finalInitials;
};
