CREATE VIEW
    view_reclamaciones AS
SELECT
    re.id as id,
    re.nombre_completo as nombre_completo,
    re.correo_electronico as correo_electronico,
    re.telefono as telefono,
    br.id AS branch__id,
    br.name AS branch__name,
    br.correlative AS branch__correlative,
    ej.id as ejecutive__id,
    ej.name as ejecutive__name,
    ej.lastname as ejecutive__lastname,
    ej.relative_id as ejecutive__relative_id,
    re.tipo_reclamo as tipo_reclamo,
    re.asunto as asunto,
    re.descripcion as descripcion,
    re.estado as estado,
    re.respuesta as respuesta,
    re.fecha_creacion as fecha_creacion,
    re.fecha_respuesta as fecha_respuesta
FROM
    reclamaciones re
    JOIN branches br ON re.sucursal_id = br.id
    JOIN people ej ON re.ejecutivo_id = ej.id