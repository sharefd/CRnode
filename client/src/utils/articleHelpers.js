export const getPurposesWithoutArticles = (localArticles, userPurposeObjects) => {
  const articlePurposes = localArticles.map(a => a.purpose.name);
  const userPurposeNames = userPurposeObjects.map(p => p.name);
  const emptyPurposes = userPurposeNames.filter(p => !articlePurposes.includes(p));
  return emptyPurposes;
};
