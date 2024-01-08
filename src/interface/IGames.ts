export interface IGames {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
}

export interface IGamesTag {
  userId?: number;
  id?: number;
  title?: string;
  completed?: boolean;
}
