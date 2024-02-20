export const matchYoutubeUrl = url => {
  const toMatch =
    /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

  if (url.match(toMatch)) {
    return true;
  }

  return false;
};
