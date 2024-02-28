CREATE OR REPLACE FUNCTION get_date_joined(input_profile_id integer)
    RETURNS text
    LANGUAGE plpgsql
    STABLE PARALLEL SAFE
AS
$$

BEGIN
    RETURN (
        -- Get the month and year from created_at column in auth.users
        SELECT TO_CHAR(joined_on, 'YYYY-MM')
        FROM public.profile
        WHERE profile_id = input_profile_id
    );
END;

$$;