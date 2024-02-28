CREATE OR REPLACE FUNCTION get_list_for_share(input_list_uuid uuid)
    RETURNS jsonb
    LANGUAGE plpgsql
    STABLE PARALLEL SAFE
AS
$$

DECLARE
    input_list_id Integer;
    input_profile_id INTEGER;
BEGIN
    --Get integer list id and profile id and insert them into variables
    SELECT list_id, profile_id 
    INTO input_list_id, input_profile_id
    FROM public.list 
    WHERE list_uuid = input_list_uuid;

    RETURN (
        SELECT jsonb_build_object(
            'listId', input_list_id,
            'listName', list.list_name,
            'listDescription', list.list_description,
            'places', COALESCE(get_list_places(input_list_id), jsonb_build_array()),
            'profile', get_profile_preview(input_profile_id) -- Adding profile field
        )
        FROM public.list
        WHERE list_uuid = input_list_uuid
        GROUP BY input_list_id, list.list_name, list.list_description
    );
END;

$$;