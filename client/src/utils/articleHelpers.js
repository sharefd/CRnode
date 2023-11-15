export const getEmptyPurposes = (localArticles, userPurposeObjects) => {
  const articlePurposes = localArticles.map(a => a.purpose.name);
  const userPurposeNames = userPurposeObjects.map(p => p.name);
  const emptyPurposes = userPurposeNames.filter(p => !articlePurposes.includes(p));
  return emptyPurposes;
};

export const getPurposesAfterUpdate = (articles, purposes, updatedArticle, updatedArticles, selectedPurposes) => {
  const oldPurposeName = articles.find(a => a._id === updatedArticle._id).purpose.name;
  const newPurposeName = purposes.find(p => updatedArticle.purpose._id === p._id).name;
  const oldPurposeStillInUse = updatedArticles.some(article => article.purpose.name === oldPurposeName);
  let newSelectedPurposes = selectedPurposes.slice();

  if (!oldPurposeStillInUse && newSelectedPurposes.includes(oldPurposeName)) {
    newSelectedPurposes = newSelectedPurposes.filter(purpose => purpose !== oldPurposeName);
  }

  if (!newSelectedPurposes.includes(newPurposeName)) {
    newSelectedPurposes.push(newPurposeName);
  }

  return newSelectedPurposes;
};

export const getPurposesAfterCreate = (purposes, newArticle, selectedPurposes) => {
  let newSelectedPurposes = selectedPurposes.slice();
  const newPurposeName = purposes.find(p => newArticle.purpose._id === p._id).name;
  if (!newSelectedPurposes.includes(newPurposeName)) {
    newSelectedPurposes.push(newPurposeName);
  }

  return newSelectedPurposes;
};

export const getPurposesAfterDelete = (articles, deletedArticle, selectedPurposes) => {
  const deletedArticlePurpose = deletedArticle.purpose;

  const isPurposeStillUsed = articles.some(
    article => article.purpose._id === deletedArticlePurpose._id && article._id !== deletedArticle._id
  );

  if (!isPurposeStillUsed) {
    return selectedPurposes.filter(purpose => purpose !== deletedArticlePurpose.name);
  }

  return selectedPurposes;
};
