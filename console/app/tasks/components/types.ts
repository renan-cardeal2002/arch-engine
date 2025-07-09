export type ConfigField = {
  key: string;
  value: string;
  encrypted: boolean;
};

export type TaskConfig = {
  fields: ConfigField[];
};

export type TaskItem = {
  id: number;
  name: string;
  description: string;
  config?: TaskConfig;
};
