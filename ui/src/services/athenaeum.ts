const BASE_URL = 'http://localhost:8000';

export enum FileCategory {
    PART = 'part',
    IMAGE = 'image',
    PROJECT = 'project',
    SUPPORT_FILE = 'support',
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

export interface ModelRecord {
    id: string;
    name: string;
    thumbnail: string | null;
    imported_at: string;
    parts: FileRecord[];
    images: FileRecord[];
    projects: FileRecord[];
    support_files: FileRecord[];
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
