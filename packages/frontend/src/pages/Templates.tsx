import { useCallback } from "react";
import { baseTemplate } from "@/constants";
import TemplateEditor from "@/components/templates/TemplateEditor";
import TemplateList from "@/components/templates/TemplateList";
import { useTemplatesRepostiory } from "@/repositories/templates";
import StyledBox from "@/components/styled/StyledBox";
import StyledSplitter from "@/components/styled/StyledSplitter";
import { Button } from "@mui/material";
import { CloudUpload, Add } from "@mui/icons-material";
import { useSDKStore } from "@/stores/sdkStore";
import { useTemplatesStore } from "@/stores/templatesStore";
import { SplitDirection } from "@devbookhq/splitter";

export default function TemplatesPage() {
  const sdk = useSDKStore.getState().getSDK();

  const setTemplates = useTemplatesStore((state) => state.setTemplates);
  const setSelectedTemplateID = useTemplatesStore(
    (state) => state.setSelectedTemplateID
  );

  const { importTemplate } = useTemplatesRepostiory(sdk);

  const onNewClick = useCallback(() => {
    const newTemplate = {
      ...baseTemplate,
      id: `new-template-${Date.now()}`,
    };

    setTemplates((prevTemplates) => [...prevTemplates, newTemplate]);
    setSelectedTemplateID(newTemplate.id);
  }, []);

  const onImportClick = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".yaml";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const raw = await file.text();
      await importTemplate(raw);

      sdk.window.showToast("Template imported", { variant: "success" });
    };
    input.click();
  }, [sdk]);

  return (
    <StyledSplitter direction={SplitDirection.Horizontal}>
      {/* Templates */}
      <StyledBox>
        <div className="flex justify-between items-center p-5">
          <h1 className="font-bold text-2xl m-0">Templates</h1>
          <div className="flex gap-3">
            <Button
              variant="outlined"
              onClick={onImportClick}
              startIcon={<CloudUpload />}
            >
              Import
            </Button>
            <Button
              variant="contained"
              onClick={onNewClick}
              className="flex items-center justify-center"
              startIcon={<Add />}
            >
              New
            </Button>
          </div>
        </div>
        <TemplateList />
      </StyledBox>

      {/* Template Editor */}
      <TemplateEditor />
    </StyledSplitter>
  );
}
