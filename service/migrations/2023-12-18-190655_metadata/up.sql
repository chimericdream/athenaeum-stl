CREATE TABLE model_metadata
(
    model_id       VARCHAR NOT NULL,
    description    VARCHAR DEFAULT NULL,
    source_url     VARCHAR DEFAULT NULL,
    commercial_use BOOLEAN DEFAULT false,
    PRIMARY KEY (model_id),
    FOREIGN KEY (model_id) REFERENCES models (id)
);

CREATE TABLE file_metadata
(
    file_record_id VARCHAR NOT NULL,
    description    VARCHAR DEFAULT NULL,
    PRIMARY KEY (file_record_id),
    FOREIGN KEY (file_record_id) REFERENCES file_records (id)
);
