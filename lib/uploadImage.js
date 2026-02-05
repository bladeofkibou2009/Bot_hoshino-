import axios from 'axios';
import FormData from 'form-data';
import fileType from 'file-type'; 

export default async buffer => {

  const { ext } = await fileType.fromBuffer(buffer); 
  let form = new FormData();
  form.append('file', buffer, 'tmp.' + ext);
  let res = await axios.post('https://telegra.ph/upload', form, {
    headers: form.getHeaders()
  });
  let img = res.data;
  if (img.error) throw img.error;
  return 'https://telegra.ph' + img[0].src;
}