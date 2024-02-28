create or replace function get_user_email(input_profile_id integer) 
returns text
language "plpgsql"
security definer
as $$ 
begin
     RETURN COALESCE(
        (SELECT email FROM auth.users AS a
         JOIN public.profile AS p ON p.user_id = a.id
         WHERE p.profile_id = input_profile_id),
        ''
    );
end;
$$;
