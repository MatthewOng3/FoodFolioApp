CREATE
    OR REPLACE FUNCTION get_all_taste_pref()
    returns jsonb
    LANGUAGE plpgsql
    STABLE PARALLEL SAFE
AS
$$
BEGIN
    RETURN (    
      SELECT jsonb_agg(jsonb_build_object(
                'tasteId', taste_pref.taste_id,
                'tasteName', taste_pref.taste_name,
                'tasteType', taste_pref.taste_type
                ))
        FROM public.taste_pref);
END;

$$;