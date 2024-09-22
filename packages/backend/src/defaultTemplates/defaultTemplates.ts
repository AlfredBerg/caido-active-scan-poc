import reflected from "@/defaultTemplates/reflected.yaml";
import { Template } from "shared";

const convertToTemplate = (input: Record<string, any>): Template => {
  return {
    id: input.id,
    description: input.description,
    enabled: input.enabled,
    payloadScript: input.payloadScript,
    detectionScript: input.detectionScript,
  };
};

const defaultTemplates = [
  reflected
].map(convertToTemplate);

export default defaultTemplates;
