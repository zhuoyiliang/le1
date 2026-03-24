// types.ts
type User = {
  name: string;
  age: number;
  isActive: boolean;
  tags: string[];
  address: {
    city: string;
    zip: number;
  };
};
export type { User };
