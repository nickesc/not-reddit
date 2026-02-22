export type Post = {
    id: string; // uuid
    author: string; // current userID
    content: string; // text of the post
    likes: string[]; // list of userIDs that liked the post
    created: number; // timestamp of post creation
    edited: number | null; // timestamp of last edit
    parent: string | null; // the id of a parent message, if it exists
};

export type NewPostParams = {
    content: string;
    parentId: string | null;
};
