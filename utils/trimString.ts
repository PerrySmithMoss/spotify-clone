export const trimString = (string: string, characterCap: number) => {
    //trim the string to the maximum length
    let trimmedString = string.substring(0, characterCap);
  
    //re-trim if we are in the middle of a word
    trimmedString = trimmedString.substring(
      0,
      Math.min(trimmedString.length, trimmedString.lastIndexOf(' '))
    );
  
    return string.length > characterCap ? trimmedString + '...' : string;
  };
  