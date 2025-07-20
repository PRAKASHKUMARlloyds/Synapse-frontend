export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|lloydsbanking\.com)$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  return password.length > 4;
};

export const getEmailValidationMessage = (email: string): string => {
  return isValidEmail(email)
    ? ''
    : 'Email is not in proper formate.';
};

export const getPasswordValidationMessage = (password: string): string => {
  return isValidPassword(password)
    ? ''
    : 'Password must be at least 5 characters long.';
};