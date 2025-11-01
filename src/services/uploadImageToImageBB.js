export const uploadImageToImgBB = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const apiKey = "d183504d942d2c443013abb243f6852a"; //update with your imgbb api key
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return data.data.image.url;
};
