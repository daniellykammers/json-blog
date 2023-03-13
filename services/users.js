export default class UsersService {
  endpoint = `https://jsonplaceholder.typicode.com/users`;

  constructor() {}

  fetchPostComments = (userId) =>
    new Promise(async (resolve, reject) => {
      const results = await fetch(`${this.endpoint}/${userId}`)
        .then((res) => res.json())
        .catch(() => reject('Houve um erro ao carregar os usuários'));

      return resolve(results);
    });
}
