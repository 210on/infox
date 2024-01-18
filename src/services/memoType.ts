export type Memo = {
  id?: string;
  title: string;
  content: string;
  //tag: string;
  tags: Tag[];
  updatedAt: Date;
  createdAt: Date;
  order: number;
};

export type Tag = {
  id: string;
  text: string;
};