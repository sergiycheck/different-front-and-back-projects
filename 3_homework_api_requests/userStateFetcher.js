import { usersUpdateDeleteRoute } from "./api/apiRoutes.js";

// TODO: remove
const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

class GenericDataReceiver {
  _data;
  _page;
  _perPage;
  _total;
  _totalPages;
  _canFetch = true;

  constructor(path, client) {
    this.path = path;
    this.client = client;
  }

  async #makeRequest(callback) {
    if (!this._canFetch) return;
    this._canFetch = false;

    const result = await callback();

    this._canFetch = true;

    return result;
  }

  async fetchGetData() {
    const fetchedData = await this.#makeRequest(async () => {
      const response = await this.client.get(this.path);

      if (!response) {
        return [];
      }

      const { data, page, per_page, total, total_pages } = response;

      this._data = data;
      this._page = page;
      this._perPage = per_page;
      this._total = total;
      this._totalPages = total_pages;

      // TODO: remove
      await sleep(1000);

      return [...this._data];
    });

    return fetchedData;
  }

  async fetchAddNewData(data) {
    const newUser = await this.#makeRequest(async () => {
      const response = await this.client.post(this.path, data);

      if (!response) {
        return;
      }

      this._data = [...this._data, response];
      ++this._total;

      return response;
    });

    return newUser;
  }

  async fetchPutData({ data, route }) {
    const updatedUser = await this.#makeRequest(async () => {
      const updatedUser = await this.client.update(route, data);
      if (!updatedUser) return;

      const userToUpdate = this._data.find((u) => Number(u.id) === Number(updatedUser.id));
      const index = this._data.indexOf(userToUpdate);
      this._data[index] = { ...userToUpdate, ...updatedUser };
      return this._data[index];
    });
    return updatedUser;
  }
}

export class UserStateFetcher extends GenericDataReceiver {
  constructor(path, client) {
    super(path, client);
  }

  get users() {
    return this._data;
  }

  async fetchPutData({ id, data }) {
    const route = usersUpdateDeleteRoute.replace(":id", id);
    return await super.fetchPutData({ id, data, route });
  }
}
