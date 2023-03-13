import UsersService from './users.js';

const usersService = new UsersService();

export default class PostsService {
  hasNextPage = true;
  currentPage = 1;
  limitResponse = 20;
  endpoint = `https://jsonplaceholder.typicode.com/posts`;

  constructor() {}

  fetchPosts = () =>
    fetch(
      `${this.endpoint}?_page=${this.currentPage}&_limit=${this.limitResponse}`
    ).then((res) => res.json());

  fetchPaginatedPosts() {
    return new Promise(async (resolve, reject) => {
      if (this.hasNextPage) {
        let results = await this.fetchPosts().catch(() =>
          reject({
            isError: true,
            message: 'Houve um erro ao carregar os posts',
          })
        );

        results = await this.addUsersToPosts(results);

        this.checkIfHasNextPage(results);

        return resolve(results);
      } else {
        return reject({ isError: false, message: 'Fim dos resultados' });
      }
    });
  }

  checkIfHasNextPage(posts) {
    if (posts.length === this.limitResponse) {
      this.currentPage = this.currentPage + 1;
    } else {
      this.hasNextPage = false;
    }
  }

  async fetchPostsUsers(posts) {
    const usersFetchs = [...new Set(posts.map((post) => post.userId))].map(
      async (userId) => await usersService.fetchPostComments(userId)
    );

    const usersFromPosts = Promise.all(usersFetchs);

    return usersFromPosts;
  }

  async addUsersToPosts(posts) {
    const users = await this.fetchPostsUsers(posts);

    return posts.map((post) => {
      const creator = users.filter((user) => user.id === post.userId)[0];

      return { ...post, creator };
    });
  }
}
