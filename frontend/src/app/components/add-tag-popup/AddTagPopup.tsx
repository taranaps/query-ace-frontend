import React, { useEffect, useState } from 'react';
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
import fetchAllTagDetails from '@/app/api/tags/route.ts';

interface AddTagPopupProps {
    open: boolean;
    onClose: () => void;
    onAddTags: (newTags: { group: string; tag: string }) => void;
}

const AddTagPopup: React.FC<AddTagPopupProps> = ({ open, onClose, onAddTags }) => {
    const [tagGroups, setTagGroups] = useState<{ tagGroupName: string; tagNames: string[] }[]>([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [groupSearch, setGroupSearch] = useState('');
    const [tagSearch, setTagSearch] = useState('');
    const [newGroupName, setNewGroupName] = useState('');
    const [newTagName, setNewTagName] = useState('');

    useEffect(() => {
        const fetchTags = async () => {
            const tags = await fetchAllTagDetails();
            setTagGroups(tags);
        };
        fetchTags();
    }, []);

    const handleGroupChange = (event: SelectChangeEvent<string>) => {
        setSelectedGroup(event.target.value || '');
        setSelectedTag('');
    };

    const handleTagChange = (event: SelectChangeEvent<string>) => {
        setSelectedTag(event.target.value || '');
    };

    const handleAddTag = () => {
        if (selectedGroup && selectedTag) {
            onAddTags({ group: selectedGroup, tag: selectedTag });
            setSelectedGroup('');
            setSelectedTag('');
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
            setNewGroupName('');
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
            setNewTagName('');
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
            <DialogTitle>Add Tags</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="group-label">Tag Group</InputLabel>
                    <Select
                        labelId="group-label"
                        value={selectedGroup || ''}
                        onChange={handleGroupChange}
                        MenuProps={{ disableAutoFocusItem: true }}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem>
                            <TextField
                                label="Search Group"
                                value={groupSearch}
                                onChange={handleGroupSearch}
                                fullWidth
                                margin="dense"
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                            />
                        </MenuItem>
                        {filteredTagGroups.map((group) => (
                            <MenuItem key={group.tagGroupName} value={group.tagGroupName}>
                                {group.tagGroupName}
                            </MenuItem>
                        ))}
                        <MenuItem>
                            <TextField
                                label="New Tag Group"
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                                fullWidth
                                margin="dense"
                                onClick={(e) => e.stopPropagation()}
                            />
                            <Button onClick={handleAddTagGroup} disabled={!newGroupName}>
                                Add Tag Group
                            </Button>
                        </MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal" disabled={!tagsForSelectedGroup.length}>
                    <InputLabel id="tag-label">Tag Name</InputLabel>
                    <Select
                        labelId="tag-label"
                        value={selectedTag || ''}
                        onChange={handleTagChange}
                        MenuProps={{ disableAutoFocusItem: true }}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>

                        <MenuItem>
                            <TextField
                                label="Search Tag"
                                value={tagSearch}
                                onChange={handleTagSearch}
                                fullWidth
                                margin="dense"
                                disabled={!selectedGroup}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </MenuItem>
                        {filteredTags.map((tag) => (
                            <MenuItem key={tag} value={tag}>
                                {tag}
                            </MenuItem>
                        ))}
                        <MenuItem>
                            <TextField
                                label="New Tag Name"
                                value={newTagName}
                                onChange={(e) => setNewTagName(e.target.value)}
                                fullWidth
                                margin="dense"
                                disabled={!selectedGroup}
                                onClick={(e) => e.stopPropagation()}
                            />
                            <Button onClick={handleAddTagName} disabled={!selectedGroup || !newTagName}>
                                Add Tag Name
                            </Button>
                        </MenuItem>
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