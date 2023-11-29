// @generated automatically by Diesel CLI.

diesel::table! {
    file_records (id) {
        id -> Text,
        name -> Text,
        thumbnail -> Nullable<Text>,
        category -> Text,
        imported_at -> Timestamp,
        model_id -> Text,
    }
}

diesel::table! {
    labels (id) {
        id -> Text,
        name -> Text,
    }
}

diesel::table! {
    model_labels (model_id, label_id) {
        model_id -> Text,
        label_id -> Text,
    }
}

diesel::table! {
    models (id) {
        id -> Text,
        name -> Text,
        thumbnail -> Nullable<Text>,
        imported_at -> Timestamp,
        part_count -> Integer,
        image_count -> Integer,
        project_count -> Integer,
        support_file_count -> Integer,
    }
}

diesel::joinable!(file_records -> models (model_id));
diesel::joinable!(model_labels -> labels (label_id));
diesel::joinable!(model_labels -> models (model_id));

diesel::allow_tables_to_appear_in_same_query!(file_records, labels, model_labels, models,);
