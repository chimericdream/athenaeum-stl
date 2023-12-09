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

export async function loadModels(): Promise<Array<Model>> {
    const res = await fetch(`${BASE_URL}/models`);
    return res.json();
}

export async function loadModel(id: string): Promise<ModelRecord> {
    const res = await fetch(`${BASE_URL}/models/${id}`);
    return res.json();
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
    return res.json();
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

export async function loadLabels(): Promise<Array<Label>> {
    const res = await fetch(`${BASE_URL}/labels`);
    return res.json();
}

export const getModelUpdater =
    (id: string) =>
    async (model: ModelUpdate): Promise<ModelRecord> => {
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

        return response.json();
    };
