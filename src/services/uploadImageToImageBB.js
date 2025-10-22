export const uploadImageToImgBB = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const apiKey = "ce3368e00624d7285fc438f8623123de"; //update with your imgbb api key
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return data.data.image.url;
};
