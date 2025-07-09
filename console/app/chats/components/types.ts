export type ConfigField = {
  key: string;
  value: string;
  encrypted: boolean;
};

export type ChatConfig = {
  fields: ConfigField[];
};

export type ChatItem = {
  id: number;
  name: string;
  description: string;
  config?: ChatConfig;
};
