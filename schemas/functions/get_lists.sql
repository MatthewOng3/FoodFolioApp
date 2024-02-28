CREATE
    OR REPLACE FUNCTION get_lists(input_profile_id integer)
    returns jsonb
    LANGUAGE plpgsql
    STABLE PARALLEL SAFE
AS
$$

BEGIN
    RETURN (
        SELECT jsonb_agg(jsonb_build_object(
            'listId', l.list_id,
            'listName', l.list_name,
            'listDescription', l.list_description,
            'listIsPublic', l.list_is_public,
            'listShareId', l.list_uuid,
            'listPlacesCount', COALESCE(le.place_count, 0) -- Count places for each list
        ))
        FROM public.list l
        LEFT JOIN (
            SELECT list_id, COUNT(*) AS place_count
            FROM public.list_entry
            GROUP BY list_id
        ) le ON l.list_id = le.list_id
        WHERE l.profile_id = input_profile_id -- Group by list_id to count places for each list separately
    );
END;

$$;