import React, { useEffect, useState } from "react";
import styles from "./AddTagPopup.module.css";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, TextField,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import { fetchAllTagDetails } from "@/app/util/tags/tagFunctionalities";

interface AddTagPopupProps {
    open: boolean;
    onClose: () => void;
    onAddTags: (newTags: { group: string; tag: string }) => void;
}

const AddTagPopup: React.FC<AddTagPopupProps> = ({ open, onClose, onAddTags }) => {
  const [tagGroups, setTagGroups] = useState<{ tagGroupName: string; tagNames: string[] }[]>([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [groupSearch, setGroupSearch] = useState("");
  const [tagSearch, setTagSearch] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [newTagName, setNewTagName] = useState("");

  useEffect(() => {
    const fetchTags = async() => {
      const tags = await fetchAllTagDetails();
      setTagGroups(tags);
    };
    fetchTags();
  }, []);

  const handleGroupChange = (event: SelectChangeEvent<string>) => {
    setSelectedGroup(event.target.value || "");
    setSelectedTag("");
  };

  const handleTagChange = (event: SelectChangeEvent<string>) => {
    setSelectedTag(event.target.value || "");
  };

  const handleAddTag = () => {
    if (selectedGroup && selectedTag) {
      onAddTags({ group: selectedGroup, tag: selectedTag });
      setSelectedGroup("");
      setSelectedTag("");
    }
  };

  const handleGroupSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGroupSearch(event.target.value);
  };

  const handleTagSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTagSearch(event.target.value);
  };

  const handleAddTagGroup = () => {
    if (newGroupName) {
      setTagGroups([...tagGroups, { tagGroupName: newGroupName, tagNames: [] }]);
      setNewGroupName("");
    }
  };

  const handleAddTagName = () => {
    if (selectedGroup && newTagName) {
      const updatedTagGroups = tagGroups.map(group => {
        if (group.tagGroupName === selectedGroup) {
          return { ...group, tagNames: [...group.tagNames, newTagName] };
        }
        return group;
      });
      setTagGroups(updatedTagGroups);
      setNewTagName("");
    }
  };

  const filteredTagGroups = tagGroups.filter(group =>
    group.tagGroupName.toLowerCase().includes(groupSearch.toLowerCase())
  );

  const tagsForSelectedGroup =
        tagGroups.find((group) => group.tagGroupName === selectedGroup)?.tagNames || [];

  const filteredTags = tagsForSelectedGroup.filter(tag =>
    tag.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <div className={styles.dialogContainer}>
        <DialogTitle className={styles.dialogTitle}>Add Tags</DialogTitle>
        <DialogContent className={styles.dialogContent}>
          <FormControl className={styles.formControl} fullWidth>
            <InputLabel id="group-label">Tag Group</InputLabel>
            <Select
              labelId="group-label"
              value={selectedGroup || ""}
              onChange={handleGroupChange}
              MenuProps={{
                keepMounted: true
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem>
                <TextField
                  slotProps={{
                    input: {
                      onMouseDown: (e) => e.stopPropagation(),
                      onClick: (e) => e.stopPropagation(),
                      onKeyDown: (e) => e.stopPropagation(),
                    },
                  }}
                  onKeyDown={(e) => e.stopPropagation()}
                  className={styles.groupSearchField}
                  label="Search Group"
                  value={groupSearch}
                  onChange={handleGroupSearch}
                  fullWidth
                  margin="dense"
                />
              </MenuItem>
              {filteredTagGroups.map((group) => (
                <MenuItem key={group.tagGroupName} value={group.tagGroupName}>
                  {group.tagGroupName}
                </MenuItem>
              ))}
              <MenuItem>
                <div className={styles.newGroupContainer}>
                  <TextField
                    slotProps={{
                      input: {
                        onMouseDown: (e) => e.stopPropagation(),
                        onClick: (e) => e.stopPropagation(),
                        onKeyDown: (e) => e.stopPropagation(),
                      },
                    }}
                    onKeyDown={(e) => e.stopPropagation()}
                    label="New Tag Group"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    fullWidth
                    margin="dense"
                  />
                  <button
                    className={styles.newGroupButton}
                    onClick={handleAddTagGroup}
                    disabled={!newGroupName}
                  >
                    Add Tag Group
                  </button>
                </div>
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl
            className={styles.formControl}
            fullWidth
            disabled={!tagsForSelectedGroup.length}
          >
            <InputLabel id="tag-label">Tag Name</InputLabel>
            <Select
              labelId="tag-label"
              value={selectedTag || ""}
              onChange={handleTagChange}
              MenuProps={{
                keepMounted: true
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem>
                <TextField
                  slotProps={{
                    input: {
                      onMouseDown: (e) => e.stopPropagation(),
                      onClick: (e) => e.stopPropagation(),
                      onKeyDown: (e) => e.stopPropagation(),
                    },
                  }}
                  onKeyDown={(e) => e.stopPropagation()}
                  className={styles.tagSearchField}
                  label="Search Tag"
                  value={tagSearch}
                  onChange={handleTagSearch}
                  fullWidth
                  margin="dense"
                />
              </MenuItem>
              {filteredTags.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  {tag}
                </MenuItem>
              ))}
              <MenuItem>
                <div className={styles.newTagContainer}>
                  <TextField
                    slotProps={{
                      input: {
                        onMouseDown: (e) => e.stopPropagation(),
                        onClick: (e) => e.stopPropagation(),
                        onKeyDown: (e) => e.stopPropagation(),
                      },
                    }}
                    onKeyDown={(e) => e.stopPropagation()}
                    label="New Tag Name"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    fullWidth
                    margin="dense"
                  />
                  <button
                    className={styles.newTagButton}
                    onClick={handleAddTagName}
                    disabled={!selectedGroup || !newTagName}
                  >
                    Add Tag Name
                  </button>
                </div>
              </MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions className={styles.dialogActions}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.addButton}
            onClick={handleAddTag}
            disabled={!selectedGroup || !selectedTag}
          >
            Add Tag
          </button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default AddTagPopup;
