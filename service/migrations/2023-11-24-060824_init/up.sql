CREATE TABLE models
(
    id                 VARCHAR   NOT NULL PRIMARY KEY,
    name               VARCHAR   NOT NULL,
    thumbnail          VARCHAR            DEFAULT NULL,
    imported_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    part_count         INT       NOT NULL DEFAULT 0,
    image_count        INT       NOT NULL DEFAULT 0,
    project_count      INT       NOT NULL DEFAULT 0,
    support_file_count INT       NOT NULL DEFAULT 0
);

CREATE TABLE file_records
(
    id          VARCHAR   NOT NULL PRIMARY KEY,
    name        VARCHAR   NOT NULL,
    thumbnail   VARCHAR            DEFAULT NULL,
    category    VARCHAR   NOT NULL,
    imported_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    model_id    VARCHAR   NOT NULL,
    FOREIGN KEY (model_id) REFERENCES models (id)
);

CREATE TABLE labels
(
    id   VARCHAR NOT NULL PRIMARY KEY,
    name VARCHAR NOT NULL
);

CREATE TABLE model_labels
(
    model_id VARCHAR NOT NULL,
    label_id VARCHAR NOT NULL,
    PRIMARY KEY (model_id, label_id),
    FOREIGN KEY (model_id) REFERENCES models (id),
    FOREIGN KEY (label_id) REFERENCES labels (id)
);
