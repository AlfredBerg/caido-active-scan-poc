export type Template = {
  id: string;
  previousID?: string;
  description?: string;
  enabled: boolean;
  payloadScript: string;
  detectionScript: string;
  isNew?: boolean;
};