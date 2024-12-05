export interface Comment {
    id: string;
    text: string;
    createdAt: string;
    author: string;
  }
  
  export interface Document {
    id: string;
    filename: string;
    filesize: number;
    filetype: string;
    url: string;
    access_key: string;
    created_at: string;
    comments: Comment[];
  }