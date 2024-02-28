CREATE
    OR REPLACE FUNCTION get_profile_taste_pref(input_profile_id integer)
    returns jsonb
    LANGUAGE plpgsql
    STABLE PARALLEL SAFE
AS
$$
BEGIN
    RETURN (
            SELECT jsonb_agg(jsonb_build_object(
            'tasteId', tp.taste_id,
            'tasteName', tp.taste_name,
            'tasteType', tp.taste_type))
            FROM public.user_taste_pref utp 
            JOIN public.taste_pref tp ON utp.taste_id = tp.taste_id
            WHERE utp.profile_id = input_profile_id);
END;

$$;