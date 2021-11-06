const wa = require('@open-wa/wa-automate');
const jimp = require('jimp');
const phrases = require('./phrases.js');

const getImageURL = async () => {
  const imageURL = `https://picsum.photos/400/400?random=${Math.random()}`;
  return imageURL;
}
const getRandomText = () => phrases[parseInt(Math.random() * phrases.length)];

const getImageWithText = async () => {
  const font = await jimp.loadFont(jimp.FONT_SANS_64_WHITE);
  const text =  {
      text: getRandomText(),
      alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: jimp.VERTICAL_ALIGN_MIDDLE
    };
  const imageURL = await getImageURL();
  const imageRead = await jimp.read(imageURL);
  const imageWithText = imageRead.print(
    font,
    0,
    0,
    text,
    400,
    350,
    (err, image, { x, y }) => {
      image.print(font, x, y, '', 400, 350)
    }
  )

  return imageWithText;
}

const getImageBase64 = async () => {
  const image = await getImageWithText()
  
  const base64 = image.getBase64Async(jimp.MIME_JPEG);

  return base64;
}

const sendMessage = async () => {
  const client = await wa.create();

  const image = await getImageBase64();

  const contact = (await client.getAllContacts()).find(c => c.name === 'Zaga');

  client.sendImageAsSticker(contact.id, image);
}

sendMessage();