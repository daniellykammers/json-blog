export default class CommentsService {
  endpoint = `https://jsonplaceholder.typicode.com/comments`;

  constructor() {}

  fetchPostComments = (postId) =>
    new Promise(async (resolve, reject) => {
      const results = await fetch(`${this.endpoint}?postId=${postId}`)
        .then((res) => res.json())
        .catch(() => reject('Houve um erro ao carregar os cometários'));

      return resolve(results);
    });
}
