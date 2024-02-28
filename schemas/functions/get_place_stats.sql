CREATE
    OR REPLACE FUNCTION get_place_stats(input_api_place_id text)
    returns jsonb
    LANGUAGE plpgsql
    STABLE PARALLEL SAFE
AS
$$
BEGIN
    RETURN (SELECT jsonb_build_object(
        'placeId', place_id,
        'apiPlaceId', api_place_id,
        'placeSavedCount', (select count(*) from list_entry le where le.api_place_id = p.api_place_id),
        'placeRecommendedCount', place_recommended_count
                            )
        FROM public.place p
        where api_place_id = input_api_place_id);
END;
$$;