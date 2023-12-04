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

export interface NewModel {
    id: string;
    name: string;
}

export interface FileRecord {
    id: string;
    name: string;
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
