insert into auth_users(
username, 
password
) values (
$1,
$2
)
returning id, username;