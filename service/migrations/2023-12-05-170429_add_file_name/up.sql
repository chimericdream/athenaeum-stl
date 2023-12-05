CREATE TABLE file_records_tmp
(
    id          VARCHAR   NOT NULL PRIMARY KEY,
    name        VARCHAR   NOT NULL,
    file_name   VARCHAR   NOT NULL,
    thumbnail   VARCHAR            DEFAULT NULL,
    category    VARCHAR   NOT NULL,
    imported_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    model_id    VARCHAR   NOT NULL,
    FOREIGN KEY (model_id) REFERENCES models (id)
);

INSERT INTO file_records_tmp (
    id,
    name,
    file_name,
    thumbnail,
    category,
    imported_at,
    model_id
)
SELECT id,
       name,
       name,
       thumbnail,
       category,
       imported_at,
       model_id
FROM file_records;

DROP TABLE file_records;

ALTER TABLE file_records_tmp RENAME to file_records;