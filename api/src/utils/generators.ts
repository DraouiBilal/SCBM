export const generateUUID = (): string => {
  // generate a random number between 0 and 15
  let rand = Math.floor(Math.random() * 16);

  // create an array of hexadecimal digits
  let hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

  // create a template for the UUID
  let template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

  // replace the placeholder characters with random hexadecimal digits
  return template.replace(/[xy]/g, function (c) {
    let r = (rand + Math.random() * 16) % 16 | 0;
    rand = Math.floor(rand / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

export const generateRandomString = (length: number): string => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789&(-_)}]{[';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++)
    result += characters.charAt(Math.floor(Math.random() * charactersLength));

  return result;
}
