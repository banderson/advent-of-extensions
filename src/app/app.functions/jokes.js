exports.main = async function (__context, sendResponse) {
  const response = await fetch("https://christmascountdown.live/api/joke");
  const joke = await response.json();

  sendResponse(joke);
};
