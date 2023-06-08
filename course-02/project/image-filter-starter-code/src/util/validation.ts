// Read how to validate urls in javascript here: https://dev.to/davidemaye/how-to-validate-urls-in-javascript-adm
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export { isValidUrl };
