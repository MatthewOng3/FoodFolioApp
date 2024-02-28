--Update profile info
CREATE OR REPLACE FUNCTION update_profile_url(
    input_user_id UUID,
    input_profile_url TEXT
) RETURNS VOID AS
$$
BEGIN
    UPDATE public.profile
    SET profile_avatar = input_profile_url
    WHERE user_id = input_user_id;
END;
$$ LANGUAGE plpgsql;