CREATE
    OR REPLACE FUNCTION get_list_places(list_id_input integer)
    returns jsonb
    LANGUAGE plpgsql
    STABLE PARALLEL SAFE
AS
$$
BEGIN
    RETURN (SELECT jsonb_agg(jsonb_build_object(
            'listEntryId', list_entry_id,
            'apiPlaceId', api_place_id,
            'listEntryType', entry_type,
            'listEntryDesc', list_entry_description
                             ))
            FROM public.list_entry
            where list_id = list_id_input);
END;

$$;