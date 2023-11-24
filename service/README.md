# Athenaeum - Import Service

Import
* Individual files
  * Treated as discrete models
* Folders
  * Treated as related to a single model

Data storage
* All files on file system (see below)
* Metadata in SQLite database

Possible file structure
```
root/
 ├─ .library/
 │  ├─ 00/
 │  │  ├─ 00/
 │  │  │  ├─ 00000000-0000-0000-0000-000000000000/
 │  │  │  │  ├─ images/
 │  │  │  │  │  ├─ screenshot1.png
 │  │  │  │  │  ├─ screenshot2.jpg
 │  │  │  │  │  ├─ screenshot3.gif
 │  │  │  │  │  ├─ screenshot4.bmp
 │  │  │  │  │  ├─ screenshot5.webp
 │  │  │  │  │  └─ ...
 │  │  │  │  ├─ projects/
 │  │  │  │  │  ├─ something.3mf
 │  │  │  │  │  ├─ something-else.3mf
 │  │  │  │  │  └─ ...
 │  │  │  │  ├─ ref/
 │  │  │  │  │  ├─ readme.txt
 │  │  │  │  │  ├─ instructions.pdf
 │  │  │  │  │  └─ ...
 │  │  │  │  ├─ thumbnail.png
 │  │  │  │  ├─ part1.stl
 │  │  │  │  ├─ part2.stl
 │  │  │  │  ├─ part3.obj
 │  │  │  │  └─ ...
 │  │  │  ├─ 00000000-0000-0000-0000-000000000001/
 │  │  │  │  └─ ...
 │  │  │  ├─ 00000000-0000-0000-0000-000000000002/
 │  │  │  │  └─ ...
 │  │  │  └─ ... 
 │  │  ├─ 01/
 │  │  │  ├─ 00010000-0000-0000-0000-000000000000/
 │  │  │  │  └─ ...
 │  │  │  ├─ 00010000-0000-0000-0000-000000000001/
 │  │  │  │  └─ ...
 │  │  │  └─ ... 
 │  │  ├─ 02/
 │  │  │  ├─ 00020000-0000-0000-0000-000000000000/
 │  │  │  │  └─ ...
 │  │  │  └─ ... 
 │  │  └─ ... 
 │  ├─ 01/
 │  │  ├─ 00/
 │  │  │  ├─ 01000000-0000-0000-0000-000000000000/
 │  │  │  │  └─ ...
 │  │  │  ├─ 01000000-0000-0000-0000-000000000001/
 │  │  │  │  └─ ...
 │  │  │  └─ ... 
 │  │  ├─ 01/
 │  │  │  ├─ 01010000-0000-0000-0000-000000000000/
 │  │  │  │  └─ ...
 │  │  │  └─ ... 
 │  │  └─ ... 
 │  ├─ 02/
 │  │  └─ ... 
 │  └─ ...
 ├─ .data/
 ├─ config.json
 ├─ athenaeum-service.exe
 └─ ...
```

Possible database structure
```
#[derive(Identifiable, Queryable, Selectable)]
#[diesel(table_name = crate::schema::models)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Model {
    pub id: String,
    pub name: String,
    pub thumbnail: Option<String>,
    
    #[column_name = "imported_at"]
    pub importedAt: chrono::DateTime<chrono::Utc>,

    #[column_name = "part_count"]
    pub partCount: u16,
    
    #[column_name = "image_count"]
    pub imageCount: u16,
    
    #[column_name = "project_count"]
    pub projectCount: u16,
}

#[derive(Identifiable, Queryable, Selectable)]
#[diesel(table_name = crate::schema::file_records)]
#[diesel(belongs_to(Model))]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct FileRecord {
    pub id: String,
    pub name: String,
    pub thumbnail: Option<String>,
    pub category: String,
    
    #[column_name = "imported_at"]
    pub importedAt: chrono::DateTime<chrono::Utc>,
    
    #[column_name = "model_id"]
    pub modelId: String,
}

#[derive(Identifiable, Queryable, Selectable)]
#[diesel(table_name = crate::schema::labels)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Label {
    pub id: String,
    pub name: String,
}

#[derive(Identifiable, Queryable, Selectable)]
#[diesel(table_name = crate::schema::model_labels)]
#[diesel(belongs_to(Label))]
#[diesel(belongs_to(Model))]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct ModelLabel {
    #[column_name = "model_id"]
    pub modelId: String,
    #[column_name = "label_id"]
    pub labelId: String,
}
```
