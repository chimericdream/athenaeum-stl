const BASE_URL = 'http://localhost:8000';

export enum FileCategory {
    PART = 'part',
    IMAGE = 'image',
    PROJECT = 'project',
    SUPPORT = 'support',
}

export interface Model {
    id: string;
    name: string;
    thumbnail: string | null;
    imported_at: string;
    part_count: number;
    image_count: number;
    project_count: number;
    support_file_count: number;
}

export interface ModelUpdate {
    name?: string;
}

export interface ModelMetadata {
    model_id: string;
    description: null | string;
    source_url: null | string;
    commercial_use: null | boolean;
    nsfw: null | boolean;
}

export interface ModelWithMetadata extends Model {
    metadata: ModelMetadata;
}

export interface ModelRecord {
    id: string;
    name: string;
    thumbnail: string | null;
    imported_at: string;
    parts: FileRecord[];
    images: FileRecord[];
    projects: FileRecord[];
    support_files: FileRecord[];
    labels: ModelLabel[];
    metadata: ModelMetadata;
}

export interface NewModel {
    id: string;
    name: string;
}

export interface FileRecord {
    id: string;
    name: string;
    file_name: string;
    file_size: number;
    thumbnail: string | null;
    category: FileCategory;
    imported_at: string;
    model_id: string;
}

export interface FileUpdate {
    name?: string;
}

export interface NewFileRecord {
    id: string;
    name: string;
    category: FileCategory;
    model_id: string;
}

export interface Label {
    id: string;
    name: string;
}

export interface LabelUpdate {
    name?: string;
}

export interface LabelEntry {
    id: string;
    name: string;
    model_count: number;
}

export interface LabelRecord {
    id: string;
    name: string;
    models: string[];
}

export type NewLabel = Omit<Label, 'id'>;

export interface ModelLabel {
    model_id: string;
    label_id: string;
}

export function getDownloadUrl(file: FileRecord): string {
    return `${BASE_URL}/download/${file.model_id}/${file.category}/${file.file_name}`;
}

export function getStaticUrl(file: FileRecord): string {
    return `${BASE_URL}/static/${file.model_id}/${file.category}/${file.file_name}`;
}

export async function loadModels(): Promise<Array<ModelWithMetadata>> {
    const res = await fetch(`${BASE_URL}/models`);
    return res.json();
}

export async function loadModel(id: string): Promise<ModelRecord> {
    const res = await fetch(`${BASE_URL}/models/${id}`);
    return res.json();
}

export async function deleteModel(id: string): Promise<boolean> {
    try {
        await fetch(`${BASE_URL}/models/${id}`, { method: 'DELETE' });
    } catch (e) {
        return false;
    }

    return true;
}

export function openModelLocation(id: string): void {
    void fetch(`${BASE_URL}/models/${id}/open`);
}

export async function addLabelToModel({
    id,
    label,
}: {
    id: string;
    label: Label | NewLabel;
}): Promise<ModelRecord> {
    const res = await fetch(`${BASE_URL}/models/${id}/labels`, {
        /* @ts-expect-error -- if the ID exists, it's an existing label; otherwise it's new */
        method: Boolean(label.id) ? 'PUT' : 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(label),
    });
    return await res.json();
}

export async function createLabel(label: string): Promise<Label> {
    const res = await fetch(`${BASE_URL}/labels`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: label }),
    });
    return res.json();
}

export async function loadLabels(): Promise<Array<LabelEntry>> {
    const res = await fetch(`${BASE_URL}/labels`);

    return await res.json();
}

export async function loadLabel(id: string): Promise<LabelRecord> {
    const res = await fetch(`${BASE_URL}/labels/${id}`);
    return await res.json();
}

export async function updateModelMetadata({
    id,
    metadata,
}: {
    id: string;
    metadata: ModelMetadata;
}): Promise<ModelRecord> {
    const response = await fetch(`${BASE_URL}/models/${id}/metadata`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(metadata),
    });

    if (!response.ok) {
        throw new Error('Something went wrong');
    }

    return await response.json();
}

export async function updateModel({
    id,
    model,
}: {
    id: string;
    model: ModelUpdate;
}): Promise<{ id: string; model: ModelRecord }> {
    const response = await fetch(`${BASE_URL}/models/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(model),
    });

    if (!response.ok) {
        throw new Error('Something went wrong');
    }

    const json = await response.json();

    return { id, model: json };
}

export const getModelUpdater =
    (id: string) =>
    async (model: ModelUpdate): Promise<ModelRecord> => {
        const result = await updateModel({ id, model });

        return result.model;
    };

export async function updateFileRecord({
    id,
    file,
}: {
    id: string;
    file: FileUpdate;
}): Promise<{ id: string; file: FileRecord }> {
    const response = await fetch(`${BASE_URL}/files/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(file),
    });

    if (!response.ok) {
        throw new Error('Something went wrong');
    }

    const json = await response.json();

    return { id, file: json };
}

export const getFileRecordUpdater =
    (id: string) =>
    async (file: FileUpdate): Promise<FileRecord> => {
        const result = await updateFileRecord({ id, file });

        return result.file;
    };

export const moveFileToModel = async ({
    id,
    modelId,
}: {
    id: string;
    modelId: string;
}): Promise<FileRecord> => {
    const response = await fetch(`${BASE_URL}/files/${id}/models/${modelId}`, {
        method: 'PUT',
    });

    if (!response.ok) {
        throw new Error('Something went wrong');
    }

    return await response.json();
};

export async function updateLabel({
    id,
    label,
}: {
    id: string;
    label: LabelUpdate;
}): Promise<{ id: string; label: LabelEntry }> {
    const response = await fetch(`${BASE_URL}/labels/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(label),
    });

    if (!response.ok) {
        throw new Error('Something went wrong');
    }

    const json = await response.json();

    return { id, label: json };
}

export async function uploadFileToModel({
    id,
    file,
}: {
    id: string;
    file: File;
}): Promise<ModelRecord> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('file_name', file.name);

    const response = await fetch(`${BASE_URL}/models/${id}/files`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Something went wrong');
    }

    return await response.json();
}
