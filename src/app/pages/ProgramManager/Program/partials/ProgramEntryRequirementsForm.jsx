import React from "react";
import { Input, Button } from "antd";

const ProgramEntryRequirementsForm = ({
  entryRequirements,
  handleEntryRequirementChange,
  handleRemoveEntryRequirement,
  handleAddEntryRequirement,
}) => (
  <div className="mb-6">
    <h2 className="font-semibold mb-2">Entry Requirements</h2>
    {entryRequirements.map((pre, idx) => (
      <div key={idx} className="flex gap-2 mb-2">
        <Input
          placeholder="Name"
          value={pre.name}
          onChange={(e) =>
            handleEntryRequirementChange(idx, "name", e.target.value)
          }
          style={{ width: 120 }}
        />
        <Input
          placeholder="Description"
          value={pre.description}
          onChange={(e) =>
            handleEntryRequirementChange(idx, "description", e.target.value)
          }
          style={{ flex: 1 }}
        />
        <Input
          placeholder="Document URL"
          value={pre.documentUrl}
          onChange={(e) =>
            handleEntryRequirementChange(idx, "documentUrl", e.target.value)
          }
          style={{ width: 180 }}
        />
        <Button
          danger
          size="small"
          onClick={() => handleRemoveEntryRequirement(idx)}
        >
          Remove
        </Button>
      </div>
    ))}
    <Button size="small" onClick={handleAddEntryRequirement}>
      + Add Entry Requirement
    </Button>
  </div>
);

export default ProgramEntryRequirementsForm;
