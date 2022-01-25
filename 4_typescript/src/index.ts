import { createElement } from "./helpers/createElement";
import { client } from "./client";
import { postsRoute } from "./apiRoutes";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

async function fetchAndDisplayPosts() {
  const postsContainer = document.querySelector(".posts-container");

  const posts = await client.get<Post[]>(postsRoute);

  posts.forEach((post) => addPostIntoPostsContainer(post, postsContainer));
}

function addPostIntoPostsContainer(post: Post, postsContainer: Element | null) {
  const h3 = createElement({
    tag: "h3",
    classList: "post-title",
    innerText: `${post.title}`,
  });

  const pBody = createElement({
    tag: "p",
    classList: "post-body",
    innerText: `${post.body}`,
  });

  const pUserInfo = createElement({
    tag: "p",
    classList: "post-user-info",
    innerText: `user id: ${post.userId}`,
  });

  postsContainer?.append(
    createElement({
      tag: "div",
      classList: "flex-column-container",
      id: `post-${post.id}`,
      children: [h3, pBody, pUserInfo],
    })
  );
}

fetchAndDisplayPosts();

const exampleArray = [
  { key1: "first-key" },
  { key2: "second-key" },
  { key3: "third-key" },
  { key3: "third1-key" },
  { key4: "fourth-key" },
  { key4: "fourth1-key" },
  { key4: "fourth2-key" },
  { key5: "fifth-key" },
  { key6: "sixth-key" },
];

type KeyType = keyof typeof exampleArray[number];

type ObjectInArrType = {
  [key in KeyType]?: string;
};

function updateObjectInArray<ObjectShape>(
  initialArray: ObjectShape[],
  keyToFind: keyof ObjectShape,
  keyValueToFind: ObjectShape[keyof ObjectShape],
  patch: Partial<ObjectShape>
) {
  const copiedArr = JSON.parse(JSON.stringify(initialArray)) as ObjectShape[];

  const item = copiedArr.find((el) => keyToFind in el && el[keyToFind] === keyValueToFind);
  if (!item) return;

  const indexOfItem = copiedArr.indexOf(item);

  //update
  // item[keyToFind] = patch[keyToFind]!;
  // or
  copiedArr[indexOfItem] = {
    ...item,
    ...patch,
  };

  console.log("initial arr", initialArray);
  console.log("copied arr", copiedArr);
}

updateObjectInArray<ObjectInArrType>(exampleArray, "key4", "fourth1-key", { key4: "updatedValue" });
