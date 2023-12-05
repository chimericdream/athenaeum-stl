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
    thumbnail: string | null;
    category: string;
    imported_at: string;
    model_id: string;
}

export interface NewFileRecord {
    id: string;
    name: string;
    category: string;
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

export async function loadModels(): Promise<Array<Model>> {
    const res = await fetch('http://localhost:8000/models');
    return res.json();
}

export async function loadModel(id: string): Promise<ModelRecord> {
    const res = await fetch(`http://localhost:8000/models/${id}`);
    return res.json();
}
