const token = "aff_55f06249d17ae77a88a2b2951e59cbd16a08d085";
const workspaceId = "xiLiNXLZ";

async function getResumeDetails(fileURL) {
  const form = new FormData();
  form.append("url", fileURL);
  form.append("workspace", workspaceId);
  form.append("wait", true);

  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  };

  const response = await (
    await fetch("https://api.affinda.com/v3/documents", requestOptions)
  ).json();
  return response?.data;
}

module.exports = getResumeDetails;
