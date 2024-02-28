
CREATE
    OR REPLACE FUNCTION list_info(list_id_input integer)
    returns jsonb
    LANGUAGE plpgsql
    STABLE PARALLEL SAFE
AS
$$


BEGIN
    RETURN (SELECT jsonb_build_object(
                           'listId', list.list_id,
                           'listName', list.list_name,
                           'listDescription', list.list_description,
                           'lastUpdated', CONCAT(EXTRACT(YEAR FROM list.updated_at), '-', EXTRACT(MONTH FROM list.updated_at), '-', EXTRACT(DAY FROM list.updated_at)),
                           'places', coalesce(get_list_places(list_id_input), jsonb_build_array())
                   )
            FROM public.list
            WHERE list.list_id = list_id_input
            GROUP BY list.list_id);
END;

$$;

drop function list_info(list_id_input uuid);


select *
from list_info('7533f868-c8cc-4d56-8f36-b4044ebc0c43'::uuid);