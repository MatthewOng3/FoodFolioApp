CREATE OR REPLACE FUNCTION search_users(
        user_profile_id integer,
        username_search_text text
    )
RETURNS jsonb AS $$
DECLARE
    result jsonb;
BEGIN
    SELECT jsonb_agg(jsonb_build_object(
        'profileId', profile_id,
        'username', profile_username,
        'avatar', profile_avatar,
        'bio', profile_bio
    )) INTO result
    FROM public.profile
    WHERE profile_username ILIKE username_search_text || '%' AND profile_id <> user_profile_id;

    RETURN COALESCE(result, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql;
