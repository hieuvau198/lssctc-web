import React, { useEffect, useMemo, useState } from 'react';
import { Drawer, Card, List, Checkbox, Button, Divider, Skeleton, Empty, message, Select, Space, Tag, Row, Col, Input } from 'antd';
import { getAllPartitions, assignPartitionToSection, unassignPartitionFromSection, getSectionPartitionsBySection } from '../../../../apis/Instructor/InstructorSectionApi';

const partitionTypeLabel = (typeId) => {
    switch (String(typeId)) {
        case '1': return { text: 'PDF', color: 'blue' };
        case '2': return { text: 'Video', color: 'purple' };
        case '3': return { text: 'Quiz', color: 'orange' };
        default: return { text: 'Other', color: 'default' };
    }
};

export default function AssignPartitions({ visible, onClose, sectionId }) {
    const [loading, setLoading] = useState(false);
    const [available, setAvailable] = useState([]);
    const [assignedList, setAssignedList] = useState([]);
    const [assignedMap, setAssignedMap] = useState({}); // partitionId -> true
    const [loadingAssign, setLoadingAssign] = useState(false);
    const [selectedType, setSelectedType] = useState('');
    const [selectedCandidates, setSelectedCandidates] = useState(new Set());
    const [assignedSearch, setAssignedSearch] = useState('');
    const [assignedTypeFilter, setAssignedTypeFilter] = useState('');
    const [availableSearch, setAvailableSearch] = useState('');

    useEffect(() => {
        if (!visible || !sectionId) return;
        let mounted = true;
        const load = async () => {
            setLoading(true);
            try {
                const [allRes, assignedRes] = await Promise.all([
                    getAllPartitions({ page: 1, pageSize: 1000 }),
                    getSectionPartitionsBySection(sectionId, { page: 1, pageSize: 1000 }),
                ]);
                if (!mounted) return;
                const all = allRes.items || [];
                const assigned = assignedRes.items || [];
                setAvailable(all);
                setAssignedList(assigned);
                const map = {};
                assigned.forEach((p) => { map[p.id] = true; });
                setAssignedMap(map);
                setSelectedCandidates(new Set());
            } catch (e) {
                console.error(e);
                message.error('Failed to load partitions');
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => { mounted = false; };
    }, [visible, sectionId]);

    const refreshAssigned = async () => {
        try {
            const res = await getSectionPartitionsBySection(sectionId, { page: 1, pageSize: 1000 });
            const assigned = res.items || [];
            setAssignedList(assigned);
            const map = {};
            assigned.forEach((p) => { map[p.id] = true; });
            setAssignedMap(map);
        } catch (e) {
            console.error(e);
        }
    };

    const toggle = async (partitionId, checked) => {
        setLoadingAssign(true);
        try {
            // optimistic
            setAssignedMap((m) => ({ ...m, [partitionId]: !!checked }));
            if (checked) {
                await assignPartitionToSection(sectionId, partitionId);
            } else {
                await unassignPartitionFromSection(sectionId, partitionId);
            }
            message.success(checked ? 'Assigned' : 'Unassigned');
            await refreshAssigned();
        } catch (e) {
            // rollback on error
            setAssignedMap((m) => ({ ...m, [partitionId]: !checked }));
            message.error('Failed to update assignment');
        } finally {
            setLoadingAssign(false);
        }
    };

    const filteredByType = useMemo(() => {
        return available.filter((p) => {
            if (selectedType && String(p.partitionTypeId) !== String(selectedType)) return false;
            if (assignedMap[p.id]) return false;
            if (availableSearch && !`${p.name} ${p.description || ''}`.toLowerCase().includes(availableSearch.toLowerCase())) return false;
            return true;
        });
    }, [available, selectedType, assignedMap, availableSearch]);

    const filteredAssigned = useMemo(() => {
        return assignedList.filter((p) => {
            if (assignedTypeFilter && String(p.partitionTypeId) !== String(assignedTypeFilter)) return false;
            if (assignedSearch && !`${p.name} ${p.description || ''}`.toLowerCase().includes(assignedSearch.toLowerCase())) return false;
            return true;
        });
    }, [assignedList, assignedSearch, assignedTypeFilter]);

    const toggleCandidate = (id, checked) => {
        setSelectedCandidates((s) => {
            const next = new Set(Array.from(s));
            if (checked) next.add(id); else next.delete(id);
            return next;
        });
    };

    const assignSelected = async () => {
        if (!sectionId || selectedCandidates.size === 0) return;
        setLoadingAssign(true);
        const ids = Array.from(selectedCandidates);
        // optimistic: mark as assigned
        setAssignedMap((m) => {
            const next = { ...m };
            ids.forEach((id) => { next[id] = true; });
            return next;
        });
        try {
            const results = await Promise.all(ids.map((id) => assignPartitionToSection(sectionId, id).then(() => ({ id, ok: true })).catch((e) => ({ id, ok: false }))));
            const failed = results.filter((r) => !r.ok).map((r) => r.id);
            if (failed.length > 0) {
                // rollback failed ones
                setAssignedMap((m) => {
                    const next = { ...m };
                    failed.forEach((id) => { delete next[id]; });
                    return next;
                });
                message.error(`Failed to assign ${failed.length} item(s)`);
            } else {
                message.success('Assigned');
            }
            // refresh assigned list
            await refreshAssigned();
            setSelectedCandidates(new Set());
        } catch (e) {
            console.error(e);
            message.error('Failed to assign partitions');
        } finally {
            setLoadingAssign(false);
        }
    };

    // basic section detail presentation (we only have id here)
    const sectionDetailNode = (
        <Card size="small" title={`Section #${sectionId}`} className="my-4">
            <div className="text-sm text-gray-700">ID: {sectionId}</div>
            <div className="text-sm text-gray-500">Details not available</div>
        </Card>
    );

    return (
        <Drawer title={`Assign partitions`} placement="right" width={780} onClose={onClose} open={visible}>
            {loading ? (
                <Card><Skeleton active /></Card>
            ) : (
                <div className="space-y-4">
                    <div>
                        {sectionDetailNode}
                    </div>

                    <div>
                        <Card size="small" title={`Assigned partitions (${assignedList.length})`}>
                            <div className="mb-3 flex items-center justify-between">
                                <Space>
                                    <Input.Search placeholder="Search assigned" allowClear value={assignedSearch} onChange={(e) => setAssignedSearch(e.target.value)} style={{ width: 240 }} />
                                    <Select placeholder="Filter type" allowClear value={assignedTypeFilter} onChange={(v) => setAssignedTypeFilter(v)} style={{ width: 160 }}>
                                        <Select.Option value="1">PDF</Select.Option>
                                        <Select.Option value="2">Video</Select.Option>
                                        <Select.Option value="3">Quiz</Select.Option>
                                    </Select>
                                </Space>
                            </div>
                            {filteredAssigned.length === 0 ? <Empty description="No partitions assigned" /> : (
                                <div className="min-h-[216px]" style={{ maxHeight: 216, overflowY: 'auto', paddingRight: 8 }}>
                                    <List
                                        dataSource={filteredAssigned}
                                        renderItem={(item) => {
                                            const t = partitionTypeLabel(item.partitionTypeId);
                                            return (
                                                <List.Item>
                                                    <Row style={{ width: '100%' }} align="middle">
                                                        <Col flex="1">
                                                            <div className="font-medium">{item.name}</div>
                                                            {item.description ? <div className="text-sm text-gray-500">{item.description}</div> : null}
                                                        </Col>
                                                        <Col>
                                                            <Space>
                                                                <Tag color={t.color}>{t.text}</Tag>
                                                                <Button size="small" onClick={() => toggle(item.id, false)} loading={loadingAssign}>Unassign</Button>
                                                            </Space>
                                                        </Col>
                                                    </Row>
                                                </List.Item>
                                            );
                                        }}
                                    />
                                </div>
                            )}
                        </Card>
                    </div>
                    <div>
                        <Card size="small" title="Assign from existing partitions">
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <div className="flex flex-1 items-center justify-between">
                                    <div className="flex flex-1 items-center gap-x-2">
                                        <Input.Search placeholder="Search available" allowClear value={availableSearch} onChange={(e) => setAvailableSearch(e.target.value)} style={{ width: 240 }} />
                                        <Select value={selectedType} onChange={(v) => setSelectedType(v)} style={{ width: 160 }} allowClear placeholder="Filter by type">
                                            <Select.Option value="1">PDF</Select.Option>
                                            <Select.Option value="2">Video</Select.Option>
                                            <Select.Option value="3">Quiz</Select.Option>
                                        </Select>
                                    </div>
                                    <div>
                                        <Button type="primary" onClick={assignSelected} disabled={selectedCandidates.size === 0} loading={loadingAssign}>Assign</Button>
                                    </div>
                                </div>

                                {filteredByType.length === 0 ? <Empty description="No partitions available for this type" /> : (
                                    <div className="min-h-[216px]" style={{ maxHeight: 216, overflowY: 'auto', paddingRight: 8 }}>
                                        <List
                                            dataSource={filteredByType}
                                            renderItem={(item) => (
                                                <List.Item>
                                                    <div className="w-full flex items-center justify-between">
                                                        <div>
                                                            <div className="font-medium">{item.name}</div>
                                                            {item.description ? <div className="text-sm text-gray-500">{item.description}</div> : null}
                                                        </div>
                                                        <div>
                                                            <Checkbox onChange={(e) => toggleCandidate(item.id, e.target.checked)} checked={selectedCandidates.has(item.id)} />
                                                        </div>
                                                    </div>
                                                </List.Item>
                                            )}
                                        />
                                    </div>
                                )}
                            </Space>
                        </Card> 
                    </div>

                    <Divider />
                    <div className="flex justify-end">
                        <Button onClick={onClose}>Close</Button>
                    </div>
                </div>
            )}
        </Drawer>
    );
}
