import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material';

interface AddTagPopupProps {
    open: boolean;
    onClose: () => void;
    tagGroups: { tagGroupName: string; tagNames: string[] }[];
    onAddTags: (newTags: { group: string; tag: string }) => void;
}

const AddTagPopup: React.FC<AddTagPopupProps> = ({ open, onClose, tagGroups, onAddTags }) => {
    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [groupSearch, setGroupSearch] = useState('');
    const [tagSearch, setTagSearch] = useState('');

    const handleGroupChange = (event: SelectChangeEvent<string>) => {
        setSelectedGroup(event.target.value);
        setSelectedTag('');
    };

    const handleTagChange = (event: SelectChangeEvent<string>) => {
        setSelectedTag(event.target.value);
    };

    const handleAddTag = () => {
        if (selectedGroup && selectedTag) {
            onAddTags({ group: selectedGroup, tag: selectedTag });
            setSelectedGroup('');
            setSelectedTag('');
        }
    };

    const tagsForSelectedGroup =
        tagGroups.find((group) => group.tagGroupName === selectedGroup)?.tagNames || [];

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Add Tags</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="group-label">Tag Group</InputLabel>
                    <Select
                        labelId="group-label"
                        value={selectedGroup}
                        onChange={handleGroupChange}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem>
                            <TextField
                                label="Search Group"
                                value={groupSearch}
                                onChange={(e) => setGroupSearch(e.target.value)}
                                fullWidth
                                margin="dense"
                            />
                        </MenuItem>
                        {tagGroups
                            .filter((group) =>
                                group.tagGroupName.toLowerCase().includes(groupSearch.toLowerCase())
                            )
                            .map((group) => (
                                <MenuItem key={group.tagGroupName} value={group.tagGroupName}>
                                    {group.tagGroupName}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal" disabled={!tagsForSelectedGroup.length}>
                    <InputLabel id="tag-label">Tag Name</InputLabel>
                    <Select
                        labelId="tag-label"
                        value={selectedTag}
                        onChange={handleTagChange}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem>
                            <TextField
                                label="Search Tag"
                                value={tagSearch}
                                onChange={(e) => setTagSearch(e.target.value)}
                                fullWidth
                                margin="dense"
                            />
                        </MenuItem>
                        {tagsForSelectedGroup
                            .filter((tag) => tag.toLowerCase().includes(tagSearch.toLowerCase()))
                            .map((tag) => (
                                <MenuItem key={tag} value={tag}>
                                    {tag}
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleAddTag} disabled={!selectedGroup || !selectedTag}>
                    Add Tag
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddTagPopup;
